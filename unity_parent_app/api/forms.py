import frappe

from edu_quality.edu_quality.server_scripts.utils import current_academic_year


@frappe.whitelist()
def get_pending_forms_and_mandatory_notices(guardian_id=None):
    """
    Get all published web forms that the guardian's students haven't submitted yet

    Args:
        guardian_id: The ID of the guardian (user)

    Returns:
        List of pending forms grouped by student
    """
    if not guardian_id:
        guardian_id = frappe.session.user

    # Get guardian document based on user
    guardian = frappe.db.get_value("Guardian", {"user": guardian_id}, "name")
    if not guardian:
        return []

    # Get all students linked to this guardian
    student_guardians = frappe.get_all(
        "Student Guardian",
        filters={"guardian": guardian},
        fields=["parent as student"],
    )

    if not student_guardians:
        return []

    student_ids = [sg.student for sg in student_guardians]

    # Get all program enrollments for these students
    enrollments = frappe.get_list(
        "Program Enrollment",
        filters={
            "academic_year": current_academic_year(),
            "student": ["in", student_ids],
            "docstatus": 1,
            "custom_status": [
                "in",
                ["New student", "Current student"],
            ],  # Only consider active students
        },
        fields=[
            "student",
            "student_name",
            "custom_school as school",
            "program",
            "student_group",
            "custom_status as student_status",
        ],
    )

    # Group enrollments by student
    student_enrollments = {}
    for enrollment in enrollments:
        if enrollment.student not in student_enrollments:
            student_enrollments[enrollment.student] = []
        student_enrollments[enrollment.student].append(enrollment)

    # Get all published web forms with matching enrollment criteria
    result = []

    for student_id, student_enrollment_list in student_enrollments.items():
        student_doc = frappe.get_doc("Student", student_id)
        student_name = (
            student_doc.student_name
            or f"{student_doc.first_name} {student_doc.last_name}".strip()
        )

        # Get web forms matching enrollment criteria
        enrollment = student_enrollment_list[0]  # Use first enrollment for filters
        matching_forms = frappe.get_all(
            "Web Form",
            filters={
                "published": 1,
                "custom_school": ["in", [enrollment.school]],
                "custom_program": ["in", [enrollment.program]],
                "custom_student_group": ["in", [enrollment.student_group]],
                "custom_student_status": ["in", [enrollment.student_status]],
            },
            fields=["name", "title", "route", "introduction_text", "doc_type"],
        )

        pending_forms = []
        for form in matching_forms:
            # Validate that the doc_type has the required fields
            meta = frappe.get_meta(form.doc_type)
            has_student_field = any(
                field.fieldname == "student" for field in meta.fields
            )

            if not has_student_field:
                frappe.log_error(
                    f"Web Form {form.name} uses DocType {form.doc_type} which is missing required fields (student)",
                    "Tgaa Connect Web Form Error",
                )
                continue

            # Check if document of web form's doc_type exists for this student
            meta = frappe.get_meta(form.doc_type)
            has_form_submitted_status = any(
                field.fieldname == "form_submitted_status" for field in meta.fields
            )

            if has_form_submitted_status:
                existing_doc = frappe.get_all(
                    form.doc_type,
                    filters={"student": student_id},
                    fields=["name", "docstatus", "form_submitted_status"],
                    order_by="creation desc",
                )
            else:
                existing_doc = frappe.get_all(
                    form.doc_type,
                    filters={"student": student_id},
                    fields=["name", "docstatus"],
                    order_by="creation desc",
                )

            should_append = True
            form_doc_name = None
            if existing_doc:
                # If document exists and is submitted (docstatus=1), don't append
                if existing_doc[0].docstatus == 1 or existing_doc[0].get(
                    "form_submitted_status"
                ):
                    should_append = False
                form_doc_name = existing_doc[0].name

            if should_append:
                form["pending_form_name"] = form_doc_name
                pending_forms.append(form)
        mandatory_notices = get_mandatory_notices(student_doc)

        if pending_forms or mandatory_notices:
            result.append(
                {
                    "student": {"id": student_id, "name": student_name},
                    "pending_forms": pending_forms,
                    "mandatory_notices": mandatory_notices,
                }
            )

    return result


def get_mandatory_notices(student_doc):
    """
    Get all mandatory notices for a student
    """
    student_id = student_doc.name

    academic_year = current_academic_year()

    mandatory_notices = frappe.get_all(
        "School Notice",
        filters={
            "student": student_id,
            "academic_year": academic_year,
            "approval_status": "Pending",
            "is_mandatory_notice": 1,
        },
        fields=["*"],
        order_by="creation desc",
    )

    return mandatory_notices

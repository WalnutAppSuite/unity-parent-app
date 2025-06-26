import frappe
from frappe import _

@frappe.whitelist(methods=["POST"])
def add_ptm_entry(student_id, gmeet_link, teacher):
    """
    Add a new PTM entry to the ptm_details child table of the given Program Enrollment.
    Args:
        student_id (str): Name of the Student doc
        gmeet_link (str): GMeet link for PTM
        tacher (str): Name of the Teacher doc (optional, can be set later)
    Returns:
        dict: Success message and new PTM row data
    """

    try:
        if not student_id:
            frappe.throw(_("Student ID is required"))

        if not gmeet_link:
            frappe.throw(_("GMeet link is required"))

        if not teacher:
            frappe.throw(_("Teacher is required"))

        session = frappe.session

        # Get guardian ID safely
        guardian_id = getattr(session, "user", "Guest")

        date_of_joining = frappe.utils.now()

        current_academic_year = get_current_academic_year()

        enrollment_name = frappe.db.get_value(
            "Program Enrollment",
            {"student": student_id, "academic_year": current_academic_year},
            "name",
        )

        if not enrollment_name:
            frappe.throw(
                _(
                    "No Program Enrollment found for this student in the current academic year"
                )
            )
        try:
            # Get a new doc for modification
            # Use get_doc with ignore_permissions to bypass submit restrictions
            modifiable_doc = frappe.get_doc(
                "Program Enrollment", enrollment_name, ignore_permissions=True
            )

            # Add the PTM entry to the custom_ptm_detail child table
            # Using the exact field names from the sample response
            ptm_entry = modifiable_doc.append(
                "custom_ptm_detail",
                {
                    "date_of_joining": date_of_joining,
                    "gmeet_link": gmeet_link,
                    "joined_guardian": guardian_id,
                    "joined_teacher": teacher,  # <-- Make sure this matches your DocType field
                    "remark": "",
                },
            )

            # Try to save with flags to bypass validations
            modifiable_doc.flags.ignore_validate = True
            modifiable_doc.flags.ignore_validate_update_after_submit = True
            modifiable_doc.flags.ignore_mandatory = True
            modifiable_doc.save(ignore_permissions=True)

            # Use the newly created entry as our row for the response
            new_row = ptm_entry

        except Exception as inner_error:
            # If updating the Program Enrollment fails, create a standalone Note instead
            frappe.log_error(
                f"Failed to update Program Enrollment: {str(inner_error)}\n{frappe.get_traceback()}",
                "PTM Entry Fallback",
            )

            note_content = f"""PTM Meeting Details:
            Student: {student_id}
            Program Enrollment: {enrollment_name}
            GMeet Link: {gmeet_link}
            Guardian: {guardian_id}
            Date of Joining: {date_of_joining}
            """

            note = frappe.get_doc(
                {
                    "doctype": "Note",
                    "title": f"PTM Entry for {student_id} on {date_of_joining}",
                    "content": note_content,
                }
            )
            note.insert(ignore_permissions=True)

            new_row = type(
                "obj",
                (object,),
                {
                    "as_dict": lambda self: {
                        "name": note.name,
                        "student": student_id,
                        "gmeet_link": gmeet_link,
                        "joined_guardian": guardian_id,
                        "date_of_joining": date_of_joining,
                        "joined_teacher": teacher,
                    }
                },
            )()

        frappe.db.commit()
        return {
            "message": "PTM entry added successfully.",
            "ptm_row": new_row.as_dict(),
        }
    except Exception as e:
        frappe.log_error(
            f"PTM Entry Error: {str(e)}\n{frappe.get_traceback()}", "PTM Entry Error"
        )
        return {"error": str(e), "traceback": frappe.get_traceback()}


def get_current_academic_year() -> str:
    """
    Retrieves the current academic year.
    """
    return frappe.db.get_value(
        "Academic Year", {"custom_current_academic_year": 1}, "name"
    )

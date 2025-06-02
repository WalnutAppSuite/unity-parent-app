import csv
import json

import frappe
import requests
from edu_quality.edu_quality.server_scripts.utils import current_academic_year
from typing import Dict, Any
import json
from aws_integration.utils import send_email_in_batches


def render_jinja(text, object):
    if not text:
        return ""
    if not object:
        return text
    return frappe.render_template(text, object)


def get_guardian_emails(student):
    student_guardians = frappe.get_all(
        "Student Guardian",
        filters={"parent": student, "parenttype": "Student"},
        fields=["guardian"],
    )
    guardians = [
        frappe.get_cached_doc("Guardian", g.get("guardian")) for g in student_guardians
    ]
    guardian_emails = []
    for guardian in guardians:
        if guardian.email_address:
            guardian_emails.append(guardian.email_address)
    return guardian_emails


def send_notification(student_id, subject="", notice_id="", cmap=False, custom=None):
    student_guardians = frappe.get_all(
        "Student Guardian",
        filters={"parent": student_id, "parenttype": "Student"},
        fields=["guardian"],
    )
    guardians = [
        frappe.get_cached_doc("Guardian", g.get("guardian")) for g in student_guardians
    ]
    for guardian in guardians:
        user = guardian.get("user")
        if user:
            push_tokens = frappe.get_all(
                "Mobile Push Token", filters={"user_id": user}, fields=["token"]
            )
            for push_token in push_tokens:
                url = "https://exp.host/--/api/v2/push/send"
                payload = {}
                if cmap:
                    payload = json.dumps(
                        {
                            "to": push_token.get("token"),
                            "title": subject + " - " + student_id,
                            "data": {"url_path": f"/cmap/"},
                            # "body": json.dumps({"url_path": f"/notice/{notice_id}?student={student_id}"})
                        }
                    )
                elif custom and isinstance(custom, dict):
                    custom["to"] = push_token.get("token")
                    payload = json.dumps(custom)
                else:
                    payload = json.dumps(
                        {
                            "to": push_token.get("token"),
                            "title": subject + " - " + student_id,
                            "data": {
                                "url_path": f"/notice/{notice_id}?student={student_id}"
                            },
                            # "body": json.dumps({"url_path": f"/notice/{notice_id}?student={student_id}"})
                        }
                    )
                headers = {"Content-Type": "application/json"}
                requests.request("POST", url, headers=headers, data=payload)


def notification_sender(user, student, subject="", url_path=""):
    push_tokens = frappe.get_all(
        "Mobile Push Token", filters={"user_id": user}, fields=["token"]
    )
    for push_token in push_tokens:
        url = "https://exp.host/--/api/v2/push/send"
        payload = json.dumps(
            {
                "to": push_token.get("token"),
                "title": subject + " - " + student,
                "data": {"url_path": url_path},
            }
        )
        headers = {"Content-Type": "application/json"}
        requests.request("POST", url, headers=headers, data=payload)


def enqueued_specific_notice_emails(__args):
    csv_file = __args.get("csv_file")
    subject = __args.get("subject")
    content = __args.get("notice")
    has_pdf = __args.get("hasPdf")
    if has_pdf:
        content = frappe.utils.get_url() + "/" + pdf

    csv_file_path = frappe.get_site_path() + csv_file
    csv_text = open(csv_file_path, mode="r", encoding="utf-8-sig").read()

    csv_data = csv.DictReader(csv_text.splitlines())
    csv_data = list(csv_data)
    csv_data = [
        {str(key).strip(): value for key, value in row.items()} for row in csv_data
    ]
    school = csv_data[0].get("school")

    bcc_email_group = frappe.get_value("School", school, "bcc_email_group")

    bcc_emails = []
    if bcc_email_group:
        bcc_emails = bcc_emails + [
            eg.email
            for eg in frappe.get_all(
                "Email Group Member",
                filters={"email_group": bcc_email_group},
                fields=["email"],
            )
        ]
        # remove duplicates from bcc_emails
        bcc_emails = list(set(bcc_emails))

    success_ref_ids = []
    failure_ref_ids = []
    failure_texts = []
    school_admin_bcc_email = ""
    student_data = {}
    for row in csv_data:
        try:
            student_id = row.get("ID") or row.get("id") or row.get("name")
            student = frappe.get_cached_doc("Student", student_id)
            if not school_admin_bcc_email:
                school = frappe.get_cached_doc("School", student.school)
                school_admin_bcc_email = school.email_address
            data = {**student.as_dict(), **row}
            notice_subject = render_jinja(subject, data)
            notice_content = render_jinja(content, data)
            student_email = student.student_email_id
            guardian_email = get_guardian_emails(student_id)
            student_data[student_id] = {
                "subject": notice_subject,
                "content": notice_content,
                "recepients": [student_email],
                "cc_recepients": guardian_email,
                "bcc_recepients": bcc_emails
                + ([school_admin_bcc_email] if school_admin_bcc_email else []),
            }
            bcc_emails = []
            success_ref_ids.append(student_id)
        except Exception as e:
            failure_ref_ids.append(row.get("ID") or row.get("id") or row.get("name"))
            failure_texts.append(e)
    send_email_in_batches(student_data)
    if len(failure_ref_ids):
        frappe.get_doc(
            {
                "doctype": "School Notice Error",
                "type": "email",
                "failure_list": json.dumps(failure_ref_ids, default=str, indent=2),
                "failure_messages": json.dumps(failure_texts, default=str, indent=2),
            }
        ).insert(ignore_permissions=True)


def enqueued_specific_notifications(notice_ids):
    success_ref_ids = []
    failure_ref_ids = []
    failure_texts = []
    for notice_id in notice_ids:
        try:
            notice = frappe.get_cached_doc("School Notice", notice_id).as_dict()
            subject = notice.subject
            student_id = notice.student
            send_notification(student_id, subject, notice_id)
            success_ref_ids.append(student_id)
        except Exception as e:
            failure_ref_ids.append(notice_id)
            failure_texts.append(e)

    if len(failure_ref_ids):
        frappe.get_doc(
            {
                "doctype": "School Notice Error",
                "type": "notification",
                "failure_list": json.dumps(failure_ref_ids, default=str, indent=2),
                "failure_messages": json.dumps(failure_texts, default=str, indent=2),
            }
        ).insert(ignore_permissions=True)


def enqueued_specific_notice_docs(__args):
    csv_file = __args.get("csv_file")
    subject = __args.get("subject")
    content = __args.get("notice")
    raw_html = __args.get("raw_html")
    circular_number = __args.get("circular_number")
    categories = categories = [
        {"school_notice_category": c} for c in __args.get("categories", [])
    ]
    requires_approval = __args.get("requires_approval")
    approve_reject_template = __args.get("approval_template")
    has_pdf = __args.get("hasPdf")
    pdf = __args.get("pdf")
    is_mandatory_notice = __args.get("is_mandatory_notice")
    if has_pdf:
        content = frappe.utils.get_url() + "/" + pdf

    csv_file_path = frappe.get_site_path() + csv_file
    csv_text = open(csv_file_path, mode="r", encoding="utf-8-sig").read()

    csv_data = csv.DictReader(csv_text.splitlines())
    csv_data = list(csv_data)
    csv_data = [
        {str(key).strip(): value for key, value in row.items()} for row in csv_data
    ]
    success_ref_ids = []
    failure_ref_ids = []
    failure_texts = []
    notice_ids = []
    for row in csv_data:
        try:
            student_id = row.get("ID") or row.get("id") or row.get("name")
            student = frappe.get_cached_doc("Student", student_id)
            data = {**student.as_dict(), **row}
            notice_subject = render_jinja(subject, data)
            notice_content = render_jinja(content, data)
            notice = frappe.get_doc(
                {
                    "doctype": "School Notice",
                    "student": student.name,
                    "subject": notice_subject,
                    "notice": notice_content,
                    "is_raw_html": 1 if raw_html else 0,
                    "category": categories,
                    "requires_approval": requires_approval,
                    "approve_reject_template": approve_reject_template,
                    "is_pdf": bool(has_pdf) or 0,
                    "pdf": pdf,
                    "circular_number": circular_number,
                    "is_mandatory_notice": is_mandatory_notice,
                }
            ).insert(ignore_permissions=True)
            notice.reload()
            notice_ids.append(notice.name)
            success_ref_ids.append(student_id)
        except Exception as e:
            failure_ref_ids.append(row.get("ID") or row.get("id") or row.get("name"))
            failure_texts.append(frappe.get_traceback())
    frappe.enqueue(enqueued_specific_notifications, queue="long", notice_ids=notice_ids)
    # enqueued_specific_notifications(notice_ids)

    if len(failure_ref_ids):
        frappe.get_doc(
            {
                "doctype": "School Notice Error",
                "type": "notice",
                "failure_list": json.dumps(failure_ref_ids, default=str, indent=2),
                "failure_messages": json.dumps(failure_texts, default=str, indent=2),
            }
        ).insert(ignore_permissions=True)


def enqueued_generic_notice_emails(__args):
    subject = __args.get("subject")
    content = __args.get("notice")
    classes = __args.get("classes")
    divisions = __args.get("divisions")
    student_statuses = __args.get("student_statuses")
    academic_year = __args.get("academic_year")
    has_pdf = __args.get("hasPdf")
    school = __args.get("school")
    if has_pdf:
        content = frappe.utils.get_url() + "/" + pdf

    bcc_email_group = frappe.get_value("School", school, "bcc_email_group")

    bcc_emails = []
    if bcc_email_group:
        bcc_emails = bcc_emails + [
            eg.email
            for eg in frappe.get_all(
                "Email Group Member",
                filters={"email_group": bcc_email_group},
                fields=["email"],
            )
        ]
        # remove duplicates from bcc_emails
        bcc_emails = list(set(bcc_emails))

    students_values = {
        "classes": classes,
        "divisions": divisions,
        "student_statuses": student_statuses,
        "academic_year": academic_year,
    }
    students = []
    if len(classes) > 1 or len(divisions) == 0:
        students = frappe.db.sql(
            """
            select *
            from tabStudent
            where name in (
               select student
               from `tabProgram Enrollment`
               where program in %(classes)s
               and academic_year = %(academic_year)s
            )
            and student_status in %(student_statuses)s
        """,
            values=students_values,
            as_dict=1,
        )
    else:
        students = frappe.db.sql(
            """
            select *
            from tabStudent
            where name in (
               select student
               from `tabProgram Enrollment`
               where student_group in %(divisions)s
               and academic_year = %(academic_year)s
            )
            and student_status in %(student_statuses)s
        """,
            values=students_values,
            as_dict=1,
        )

    success_student_ids = []
    failure_student_ids = []
    failure_texts = []
    school_admin_bcc_email = ""
    student_data = {}
    for student in students:
        try:
            notice_subject = render_jinja(subject, student)
            notice_content = render_jinja(content, student)
            student_email = student.student_email_id
            guardian_email = get_guardian_emails(student.name)
            if not school_admin_bcc_email:
                school = frappe.get_cached_doc("School", student.school)
                school_admin_bcc_email = school.email_address
            student_data[student.name] = {
                "subject": notice_subject,
                "content": notice_content,
                "recepients": [student_email],
                "cc_recepients": guardian_email,
                "bcc_recepients": bcc_emails
                + ([school_admin_bcc_email] if school_admin_bcc_email else []),
            }
            bcc_emails = []
            success_student_ids.append(student.name)
        except Exception as e:
            failure_student_ids.append(student.get("name"))
            failure_texts.append(e)
    send_email_in_batches(student_data)
    if len(failure_student_ids):
        frappe.get_doc(
            {
                "doctype": "School Notice Error",
                "type": "email",
                "failure_list": json.dumps(failure_student_ids, default=str, indent=2),
                "failure_messages": json.dumps(failure_texts, default=str, indent=2),
            }
        ).insert(ignore_permissions=True)


def enqueued_generic_notifications(notice_ids):
    success_student_ids = []
    failure_ids = []
    failure_texts = []
    for notice_id in notice_ids:
        try:
            notice = frappe.get_cached_doc("School Notice", notice_id)
            subject = notice.subject
            students_values = {
                "class": notice.get("class"),
                "division": notice.get("division"),
                "student_status": notice.get("student_status"),
                "academic_year": notice.get("academic_year"),
            }
            if notice.get("division"):
                students = frappe.db.sql(
                    """
                        select *
                        from tabStudent
                        where name in (
                           select student
                           from `tabProgram Enrollment`
                           where student_group = %(division)s
                           and academic_year = %(academic_year)s
                        )
                        and student_status = %(student_status)s
                    """,
                    values=students_values,
                    as_dict=1,
                )
            else:
                students = frappe.db.sql(
                    """
                        select *
                        from tabStudent
                        where name in (
                           select student
                           from `tabProgram Enrollment`
                           where program = %(class)s
                           and academic_year = %(academic_year)s
                        )
                        and student_status = %(student_status)s
                    """,
                    values=students_values,
                    as_dict=1,
                )
            for student in students:
                try:
                    notice_subject = render_jinja(subject, student)
                    send_notification(student.name, notice_subject, notice_id)
                    success_student_ids.append(student.name)
                except Exception as e:
                    failure_ids.append(student.get("name"))
                    failure_texts.append(frappe.get_traceback())
        except Exception as e:
            failure_ids.append(f"notice:{notice_id}")
            failure_texts.append(frappe.get_traceback())

    if len(failure_ids):
        frappe.get_doc(
            {
                "doctype": "School Notice Error",
                "type": "notification",
                "failure_list": json.dumps(failure_ids, default=str, indent=2),
                "failure_messages": json.dumps(failure_texts, default=str, indent=2),
            }
        ).insert(ignore_permissions=True)


def enqueued_generic_notice_docs(__args):
    subject = __args.get("subject")
    content = __args.get("notice")
    is_public = __args.get("is_public")
    school = __args.get("school")
    classes = __args.get("classes")
    divisions = __args.get("divisions")
    has_pdf = __args.get("hasPdf")
    pdf = __args.get("pdf")
    circular_number = __args.get("circular_number")
    categories = [{"school_notice_category": c} for c in __args.get("categories", [])]
    if has_pdf:
        content = frappe.utils.get_url() + "/" + pdf
    student_statuses = __args.get("student_statuses")
    academic_year = __args.get("academic_year")
    raw_html = __args.get("raw_html")
    notice_ids = []
    if is_public:
        notice = frappe.get_doc(
            {
                "doctype": "School Notice",
                "is_generic_notice": 1,
                "school": school,
                "subject": subject,
                "notice": content,
                "academic_year": academic_year,
                "is_raw_html": 1 if raw_html else 0,
                "is_pdf": 1 if has_pdf else 0,
                "pdf": pdf,
                "is_public": 1,
                "circular_number": circular_number,
                "category": categories,
            }
        ).insert(ignore_permissions=True)
        notice.reload()
        notice_ids.append(notice.name)
    else:
        for student_status in student_statuses:
            if len(classes) > 1 or len(divisions) == 0:
                for class_ in classes:
                    notice = frappe.get_doc(
                        {
                            "doctype": "School Notice",
                            "class": class_,
                            "is_generic_notice": 1,
                            "school": school,
                            "subject": subject,
                            "student_status": student_status,
                            "notice": content,
                            "academic_year": academic_year,
                            "is_raw_html": 1 if raw_html else 0,
                            "is_pdf": 1 if has_pdf else 0,
                            "pdf": pdf,
                            "circular_number": circular_number,
                            "category": categories,
                        }
                    ).insert(ignore_permissions=True)
                    notice.reload()
                    notice_ids.append(notice.name)
            else:
                class_ = classes[0]
                for division in divisions:
                    notice = frappe.get_doc(
                        {
                            "doctype": "School Notice",
                            "is_generic_notice": 1,
                            "class": class_,
                            "school": school,
                            "division": division,
                            "subject": subject,
                            "student_status": student_status,
                            "notice": content,
                            "is_pdf": 1 if has_pdf else 0,
                            "pdf": pdf,
                            "academic_year": academic_year,
                            "circular_number": circular_number,
                            "category": categories,
                        }
                    ).insert(ignore_permissions=True)
                    notice.reload()
                    notice_ids.append(notice.name)
    if not is_public:
        frappe.enqueue(
            enqueued_generic_notifications, queue="long", notice_ids=notice_ids
        )
    # enqueued_generic_notifications(notice_ids)


def send_generic_notification(variables, **kwargs):
    """
    Send a generic notification to students based on the supplied filters
    Sending notification using dotted path in funnel
    variables: data from previous node
    kwargs: payload from exec dotted path node
    """
    try:
        doc = variables.get("doc")
        if doc.doctype == "Payment Request":
            student = frappe.get_doc("Student", doc.party)
        elif doc.doctype == "Program Enrollment":
            student = frappe.get_doc("Student", doc.student)

        subject = kwargs.get("subject")
        content = kwargs.get("notice")
        raw_html = kwargs.get("raw_html")
        academic_year = current_academic_year()

        notice = frappe.get_doc(
            {
                "doctype": "School Notice",
                "class": student.program,
                "is_generic_notice": 1,
                "school": student.school,
                "subject": subject,
                "student_status": student.student_status,
                "notice": content,
                "academic_year": academic_year,
                "is_raw_html": 1 if raw_html else 0,
            }
        ).insert(ignore_permissions=True)
        send_notification(student.name, notice.subject, notice.name)
    except Exception:
        frappe.log_error("Push Notification", frappe.get_traceback())


def validate_school(csv_data):
    school = csv_data[0].get("school")
    for row in csv_data:
        if row.get("school") != school:
            raise frappe.exceptions.ValidationError(
                "There are multiple schools in the CSV"
            )


def validate_args(**kwargs):
    has_csv = kwargs.get("has_csv")
    csv_file = kwargs.get("csv_file")
    subject = kwargs.get("subject")
    content = kwargs.get("notice")
    school = kwargs.get("school")
    classes = kwargs.get("classes")
    divisions = kwargs.get("divisions")
    student_statuses = kwargs.get("student_statuses")
    is_test = kwargs.get("is_test")
    academic_year = kwargs.get("academic_year")
    student_data = kwargs.get("student_data")
    has_ids = kwargs.get("has_ids")
    # verify supplied data
    has_pdf = kwargs.get("hasPdf")
    pdf = kwargs.get("pdf")
    is_public = kwargs.get("is_public")
    has_ids = kwargs.get("has_ids")
    categories = kwargs.get("categories", [])
    if has_csv:
        if is_test:
            student_id = (
                student_data.get("ID")
                or student_data.get("id")
                or student_data.get("name")
            )
            student = frappe.get_cached_doc("Student", student_id)
            if not student_data.get("school"):
                raise frappe.exceptions.MandatoryError(
                    "School (school) is required in CSV"
                )
            if student.get("school") != student_data.get("school"):
                raise frappe.exceptions.ValidationError(
                    f"School Mismatch: {student_id} [{student.get('school')}, {student_data.get('school')}]"
                )
        else:
            csv_file_path = frappe.get_site_path() + csv_file
            csv_file_path = frappe.get_site_path() + csv_file
            csv_text = open(csv_file_path, mode="r", encoding="utf-8-sig").read()

            if not csv_text:
                raise frappe.exceptions.ValidationError("CSV File Error: Empty File")

            csv_data = csv.DictReader(csv_text.splitlines())
            csv_data = list(csv_data)

            # verify csv data to check if there are multiple schools
            validate_school(csv_data)

            un_matches = []
            student_ids = [
                row.get("ID") or row.get("id") or row.get("name") for row in csv_data
            ]
            student_schools = frappe.get_all(
                "Student",
                fields=["name", "school"],
                filters={"name": ["in", student_ids]},
            )

            for row in csv_data:
                for student in student_schools:
                    student_id = row.get("ID") or row.get("id") or row.get("name")
                    if student_id == student.name:
                        if student.get("school") != row.get("school"):
                            un_matches.append([student_id, row.get("school")])
                        break

            if len(un_matches):
                error_string = "<br/>".join(
                    [f"{row[0]} [{row[1]}]" for row in un_matches]
                )
                raise frappe.exceptions.ValidationError(
                    f"School Mismatch: <br/> {error_string}"
                )
    else:

        if not is_public and not has_ids:
            if not school:
                raise frappe.exceptions.MandatoryError("School is required")

            if not classes:
                raise frappe.exceptions.MandatoryError("Classes are required")
            if not isinstance(classes, list):
                raise frappe.exceptions.ValidationError("Classes must be a list")
            if not len(classes):
                raise frappe.exceptions.MandatoryError("At least one Class is required")

            if len(classes) == 1 and divisions:
                if not isinstance(divisions, list):
                    raise frappe.exceptions.ValidationError("Divisions must be a list")

            if not student_statuses:
                raise frappe.exceptions.MandatoryError("Student Statuses are required")
            if not isinstance(student_statuses, list):
                raise frappe.exceptions.ValidationError(
                    "Student Statuses must be a list"
                )
            if not len(student_statuses):
                raise frappe.exceptions.MandatoryError(
                    "At least one Student Status is required"
                )
            if not academic_year:
                raise frappe.exceptions.MandatoryError("Academic Year is required")

    if not subject:
        raise frappe.exceptions.MandatoryError("Subject is required")

    if not has_pdf and not content:
        raise frappe.exceptions.MandatoryError("Content is required")
    if has_pdf and not pdf:
        raise frappe.exceptions.MandatoryError("PDF is required")


@frappe.whitelist()
def create_notice(**kwargs):
    has_csv = kwargs.get("has_csv")
    has_ids = kwargs.get("has_ids")
    send_emails = kwargs.get("send_emails")
    is_public = kwargs.get("is_public")
    # verify supplied data
    validate_args(**kwargs)

    if has_csv and not is_public:
        frappe.enqueue(enqueued_specific_notice_docs, __args=kwargs)
        # enqueued_specific_notice_docs(kwargs)
        if send_emails:
            frappe.enqueue(enqueued_specific_notice_emails, queue="long", __args=kwargs)
    elif has_ids:
        frappe.enqueue(enqueued_ids_notice_docs, __args=kwargs)
        if send_emails:
            frappe.enqueue(enqueued_ids_notice_emails, queue="long", __args=kwargs)
    else:
        frappe.enqueue(enqueued_generic_notice_docs, __args=kwargs)
        # enqueued_generic_notice_docs(kwargs)
        if send_emails and not is_public:
            frappe.enqueue(enqueued_generic_notice_emails, queue="long", __args=kwargs)


@frappe.whitelist()
def send_test_mail(**kwargs):
    has_csv = kwargs.get("has_csv")
    student_data = kwargs.get("student_data")
    subject = kwargs.get("subject")
    content = kwargs.get("notice")
    test_emails = kwargs.get("emails")
    classes = kwargs.get("classes")
    divisions = kwargs.get("divisions")
    student_statuses = kwargs.get("student_statuses")
    academic_year = kwargs.get("academic_year")
    is_public = kwargs.get("is_public")

    has_ids = kwargs.get("has_ids")
    student_ids = kwargs.get("student_ids")
    if not test_emails:
        raise frappe.exceptions.MandatoryError("Test Emails are required")

    validate_args(**kwargs, is_test=True)

    notice_subject = subject
    notice_content = content

    if has_csv:
        student_id = (
            student_data.get("ID") or student_data.get("id") or student_data.get("name")
        )
        student = frappe.get_cached_doc("Student", student_id)
        data = {**student.as_dict(), **student_data}
        notice_subject = render_jinja(subject, data)
        notice_content = render_jinja(content, data)

    elif has_ids:
        ids = convert_string_id_to_list(student_ids)
        student_id = ids[0]
        student = frappe.get_cached_doc("Student", student_id)
        data = {**student.as_dict()}
        notice_subject = render_jinja(subject, data)
        notice_content = render_jinja(content, data)

    elif not is_public:
        students = []
        students_values = {
            "classes": classes,
            "divisions": divisions,
            "student_statuses": student_statuses,
            "academic_year": academic_year,
        }
        if len(classes) > 1 or len(divisions) == 0:
            students = frappe.db.sql(
                """
                select *
                from tabStudent
                where name in (
                   select student
                   from `tabProgram Enrollment`
                   where program in %(classes)s
                   and academic_year = %(academic_year)s
                )
                and student_status in %(student_statuses)s
                limit 1
            """,
                values=students_values,
                as_dict=1,
            )
        else:
            students = frappe.db.sql(
                """
                select *
                from tabStudent
                where name in (
                   select student
                   from `tabProgram Enrollment`
                   where student_group in %(divisions)s
                   and academic_year = %(academic_year)s
                )
                and student_status in %(student_statuses)s
                limit 1
            """,
                values=students_values,
                as_dict=1,
            )

        if len(students):
            notice_subject = render_jinja(subject, students[0])
            notice_content = render_jinja(content, students[0])

    test_emails = [e.strip() for e in str(test_emails).split(",")]
    student_data_dict = {
        "Test": {
            "subject": notice_subject,
            "content": notice_content,
            "recepients": test_emails,
        }
    }
    return send_email_in_batches(student_data_dict)


# /api/method/edu_quality.public.py.walsh.admin.get_student_count
@frappe.whitelist()
def get_student_count(**kwargs):
    classes = kwargs.get("classes")
    divisions = kwargs.get("divisions")
    student_statuses = kwargs.get("student_statuses")
    academic_year = kwargs.get("academic_year")
    classes = json.loads(classes)
    divisions = json.loads(divisions)
    student_statuses = json.loads(student_statuses)

    if not len(classes) and not len(divisions):
        return 0

    students_values = {
        "classes": classes,
        "divisions": divisions,
        "student_statuses": student_statuses,
        "academic_year": academic_year,
    }
    if len(classes) > 1 or len(divisions) == 0:
        students = frappe.db.sql(
            """
                    select count(*) as count
                    from tabStudent
                    where name in (
                       select student
                       from `tabProgram Enrollment`
                       where program in %(classes)s
                       and academic_year = %(academic_year)s
                    )
                    and student_status in %(student_statuses)s
                """,
            values=students_values,
            as_dict=1,
        )
    else:
        students = frappe.db.sql(
            """
                    select count(*) as count
                    from tabStudent
                    where name in (
                       select student
                       from `tabProgram Enrollment`
                       where student_group in %(divisions)s
                       and academic_year = %(academic_year)s
                    )
                    and student_status in %(student_statuses)s
                """,
            values=students_values,
            as_dict=1,
        )
    return students[0].get("count")


# renders a email template with provided data, with subject of template as notice subject.
@frappe.whitelist()
def create_notice_from_email_template(data, email_template, send_notif=False):
    try:
        data = json.loads(data) if isinstance(data, str) else data
        email_temp_doc = frappe.get_doc("Email Template", email_template)
        subject = email_temp_doc.subject
        content = ""
        if email_temp_doc.use_html == 1:
            content = email_temp_doc.response_html
        else:
            content = email_temp_doc.response
        content = render_jinja(content, data)
        subject = render_jinja(subject, data)
        student = data.get("student")
        notice = frappe.get_doc(
            {
                "doctype": "School Notice",
                "class": data.get("program"),
                "is_generic_notice": data.get("is_generic_notice") or 0,
                "school": data.get("school"),
                "subject": subject,
                "student": student,
                "division": data.get("division"),
                "student_status": data.get("student_status"),
                "notice": content,
                "academic_year": data.get("academic_year"),
                "is_raw_html": 1,
            }
        ).insert(ignore_permissions=True)

        frappe.enqueue(
            send_notification,
            queue="long",
            student_id=student,
            custom={
                "title": subject,
                "data": {"url_path": f"/notice/{notice.name}?student={student}"},
            },
        )

    except Exception as e:
        frappe.logger("Notice Email").exception(e)
        raise e

def enqueued_ids_notice_docs(__args):
    student_id_string = __args.get("student_ids")
    subject = __args.get("subject")
    content = __args.get("notice")
    raw_html = __args.get("raw_html", 0)
    has_pdf = __args.get("hasPdf")
    requires_approval = __args.get("requires_approval")
    is_mandatory_notice = __args.get("is_mandatory_notice")
    pdf = __args.get("pdf")
    circular_number = __args.get("circular_number")
    approval_reject_template = __args.get("approval_template")
    categories = [{"school_notice_category": c} for c in __args.get("categories", [])]
    academic_year = __args.get("academic_year")

    if has_pdf:
        content = frappe.utils.get_url() + "/" + pdf

    student_ids = convert_string_id_to_list(student_id_string)

    students = frappe.get_all(
        "Student",
        filters={"name": ["in", student_ids]},
        fields=["name", "school", "program", "student_email_id"],
    )
    student_map = {student["name"]: student for student in students}

    success_ref_ids = []
    failure_ref_ids = []
    failure_texts = []
    notice_ids = []

    for student_id in student_ids:
        try:
            student = student_map.get(student_id)
            if not student:
                raise ValueError(f"Student with ID '{student_id}' does not exist.")
            data = student
            notice_subject = render_jinja(subject, data)
            notice_content = render_jinja(content, data)

            notice = frappe.get_doc(
                {
                    "doctype": "School Notice",
                    "student": student["name"],
                    "subject": notice_subject,
                    "notice": notice_content,
                    "is_raw_html": 1 if raw_html else 0,
                    "is_pdf": 1 if has_pdf else 0,
                    "pdf": pdf,
                    "requires_approval": requires_approval,
                    "approve_reject_template": approval_reject_template,
                    "is_mandatory_notice": is_mandatory_notice,
                    "academic_year": academic_year,
                    "circular_number": circular_number,
                    "category": categories,
                }
            ).insert(ignore_permissions=True)

            notice.reload()
            notice_ids.append(notice.name)
            success_ref_ids.append(student_id)

        except Exception as e:
            failure_ref_ids.append(student_id)
            failure_texts.append(f"Error for {student_id}: {str(e)}")
            frappe.logger("School Notice").exception(
                f"Error processing student ID {student_id}"
            )

    if notice_ids:
        frappe.enqueue(
            enqueued_specific_notifications,
            queue="long",
            notice_ids=notice_ids,
        )

    if failure_ref_ids:
        frappe.get_doc(
            {
                "doctype": "School Notice Error",
                "type": "notice",
                "failure_list": json.dumps(failure_ref_ids, default=str, indent=2),
                "failure_messages": json.dumps(failure_texts, default=str, indent=2),
            }
        ).insert(ignore_permissions=True)


def enqueued_ids_notice_emails(__args):
    student_id_string = __args.get("student_ids")
    subject = __args.get("subject")
    content = __args.get("notice")
    has_pdf = __args.get("hasPdf")
    pdf = __args.get("pdf")

    if has_pdf:
        content = frappe.utils.get_url() + "/" + pdf

    student_ids = convert_string_id_to_list(student_id_string)

    students = frappe.db.get_all(
        "Student",
        filters={"name": ["in", student_ids]},
        fields=["name", "school", "student_email_id"],
    )
    student_map = {student["name"]: student for student in students}

    school = students[0]["school"] if students else None

    bcc_emails = []
    if school:
        bcc_email_group = frappe.get_value("School", school, "bcc_email_group")
        if bcc_email_group:
            bcc_emails = bcc_emails + [
                eg.email
                for eg in frappe.get_all(
                    "Email Group Member",
                    filters={"email_group": bcc_email_group},
                    fields=["email"],
                )
            ]
            # removes duplicate from bcc_email
            bcc_emails = list(set(bcc_emails))

    success_ref_ids = []
    failure_ref_ids = []
    failure_texts = []
    school_admin_bcc_email = None
    student_data = {}

    for student_id in student_ids:
        try:
            student = student_map.get(student_id)
            if not student:
                raise ValueError(f"Student ID {student_id} does not exist.")
            if not school_admin_bcc_email:
                school_admin = frappe.get_cached_doc("School", student["school"])
                school_admin_bcc_email = school_admin.email_address

            notice_subject = render_jinja(subject, student)
            notice_content = render_jinja(content, student)
            student_email = student["student_email_id"]
            guardian_emails = get_guardian_emails(student_id)
            student_data[student_id] = {
                "subject": notice_subject,
                "content": notice_content,
                "recepients": [student_email, *guardian_emails],
                "bcc_recepients": bcc_emails
                + ([school_admin_bcc_email] if school_admin_bcc_email else []),
            }
            guardian_emails = get_guardian_emails(student_id)

            success_ref_ids.append(student_id)
        except Exception as e:
            failure_ref_ids.append(student_id)
            failure_texts.append(str(e))
            frappe.logger("School Notice Email").exception(
                f"Error processing student ID {student_id}: {e}"
            )
    send_email_in_batches(student_data)

    if failure_ref_ids:
        frappe.get_doc(
            {
                "doctype": "School Notice Error",
                "type": "email",
                "failure_list": json.dumps(failure_ref_ids, default=str, indent=2),
                "failure_messages": json.dumps(failure_texts, default=str, indent=2),
            }
        ).insert(ignore_permissions=True)


def convert_string_id_to_list(string):
    return [id.strip() for id in string.split(",") if id.strip()]


@frappe.whitelist()
def funnel_create_notice(**data):
    try:
        if not isinstance(data, dict) or not data:
            return
        data = data.get("action_node").get("data")
        data = json.loads(data)
        email_template = data.get("email_template")
        notice = data.get("notice")
        subject = data.get("subject")
        if email_template and not notice and not subject:
            email_template_data = frappe.get_cached_doc(
                "Email Template", email_template
            )
            subject = email_template_data.get("subject")
            notice = email_template_data.get(
                "response_html"
            ) or email_template_data.get("response")
        data["notice"] = notice
        data["subject"] = subject
        create_notice(**data)
    except Exception as e:
        frappe.log_error("Error in funnel_create_notice", frappe.get_traceback())


def send_custom_notification(student_ids, payload={}, title=""):

    if not payload:
        payload = {}
    else:
        try:
            payload = json.loads(payload)
        except Exception as e:
            frappe.log_error(
                "Error parsing payload in notification node", frappe.get_traceback()
            )
            payload = {}

    if not (
        "System Manager" in frappe.get_roles() or "Administrator" in frappe.get_roles()
    ):
        frappe.throw("Not authorized to send notifications")
    all_ids = list(map(str.strip, student_ids.split(",")))

    push_tokens = frappe.get_all(
        "Mobile Push Token",
        filters={"token": ["in", all_ids]},
        fields=["token"],
        pluck="token",
    )
    if push_tokens:
        for push_token in push_tokens:
            url = "https://exp.host/--/api/v2/push/send"
            payload["to"] = push_token
            payload["title"] = title
            headers = {"Content-Type": "application/json"}
            requests.request("POST", url, headers=headers, data=json.dumps(payload))

    student_guardians = frappe.get_all(
        "Student Guardian",
        filters={"parent": ["in", all_ids], "parenttype": "Student"},
        fields=["guardian"],
    )

    guardians = [
        frappe.get_cached_doc("Guardian", g.get("guardian")) for g in student_guardians
    ]

    for guardian in guardians:
        user = guardian.get("user")
        if user:
            push_tokens = frappe.get_all(
                "Mobile Push Token", filters={"user_id": user}, fields=["token"]
            )
            for push_token in push_tokens:
                url = "https://exp.host/--/api/v2/push/send"
                payload["to"] = push_token.get("token")
                payload["title"] = title
                headers = {"Content-Type": "application/json"}
                requests.request("POST", url, headers=headers, data=json.dumps(payload))


@frappe.whitelist()
def send_funnel_notif(**data):
    if not isinstance(data, dict) or not data:
        return
    if not (
        "System Manager" in frappe.get_roles() or "Administrator" in frappe.get_roles()
    ):
        frappe.throw("Not authorized to send notifications")

    data = data.get("action_node").get("data")
    data = json.loads(data)

    token = data.get("tokens")
    payload = data.get("payload")
    title = data.get("title")
    frappe.enqueue(
        send_custom_notification,
        student_ids=token,
        payload=payload,
        title=title,
        timeout=10000,
    )

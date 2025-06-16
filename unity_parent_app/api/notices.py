import frappe

from edu_quality.public.py.walsh.admin import render_jinja

from edu_quality.public.py.walsh.login import logout
from edu_quality.public.py.walsh.login import is_disabled
import json


@frappe.whitelist()
def get_students():
    user = frappe.session.user

    cache_key = f"walsh:guardian_students_{user}"
    students_cache = frappe.cache().get_value(cache_key)

    if students_cache:
        return students_cache

    guardian = frappe.get_cached_doc("Guardian", {"user": user})
    all_student_data = frappe.get_all(
        "Student", filters={"guardian": guardian.name}, fields=["*"]
    )

    student_disabled = all(student.get("enabled") == 0 for student in all_student_data)
    # if all of student disabled log out the parent
    if student_disabled:
        logout()

        frappe.throw(("Not permitted"), frappe.PermissionError)
        return []

    students = [student for student in all_student_data if student.get("enabled")]

    # Cache the results for 10 minutes
    frappe.cache().set_value(cache_key, students, expires_in_sec=600)
    return students


def get_enrollments(student_names):
    user = frappe.session.user
    cache_key = f"walsh:enrollments_{user}"
    enrollments_cache = frappe.cache().get_value(cache_key)

    if enrollments_cache:
        return enrollments_cache

    enrollments_values = {
        "student_names": student_names,
    }

    enrollments = frappe.db.sql(
        """
        select name, custom_school, academic_year, student, student_group, program
        from `tabProgram Enrollment`
        where student in %(student_names)s AND docstatus = 1
        group by custom_school, academic_year, student, student_group, program;
    """,
        values=enrollments_values,
        as_dict=1,
    )

    # Cache the results for 10 minutes
    frappe.cache().set_value(cache_key, enrollments, expires_in_sec=600)
    return enrollments


@frappe.whitelist()
def get_all_notices(
    cursor_creation=None,
    cursor_name=None,
    limit=10,
    search_query=None,
    stared_only=False,
    archived_only=False,
):
    if limit:
        limit = int(limit)
    if not limit:
        limit = 1000

    user = frappe.session.user
    guardian = frappe.get_cached_doc("Guardian", {"user": user})

    # Check guardian status before returning any cached data
    if is_disabled(guardian.name, True):
        return {
            "success": False,
            "data": [],
        }

    # Create cache key based on user and parameters
    cache_key = f"walsh:notices_{user}_{cursor_creation}_{cursor_name}_{limit}_{stared_only}_{archived_only}"
    notices_cache = frappe.cache().get_value(cache_key)
    if notices_cache:
        print("add", cache_key)
        return notices_cache

    cursor = None
    if cursor_name and cursor_creation:
        cursor = {
            "creation": cursor_creation,
            "name": cursor_name,
        }
    students = get_students()
    student_dict = {s.name: s for s in students}
    student_names = [s.name for s in students]

    if not len(students):
        return {
            "error": True,
            "error_type": "no_students",
            "error_message": "No Students Found",
        }

    enrollments = get_enrollments(student_names)
    divisions = [e.student_group for e in enrollments]
    classes = [e.program for e in enrollments]

    notices_values = {
        "student_names": student_names,
        "classes": classes,
        "divisions": divisions,
        "limit": limit + 1,
        "cursor_creation": cursor.get("creation") if cursor else None,
        "cursor_name": cursor.get("name") if cursor else None,
        "search_query": f"%{search_query}%" if search_query else None,
    }

    cursor_condition = (
        "AND (creation <= %(cursor_creation)s AND name != %(cursor_name)s)"
        if cursor
        else ""
    )

    search_condition = (
        "AND (subject LIKE %(search_query)s OR notice LIKE %(search_query)s)"
        if search_query
        else ""
    )

    notices = frappe.db.sql(
        f"""
        select *
        from `tabSchool Notice` notice
        where  ((student in %(student_names)s and is_generic_notice = 0)
            or (
                is_generic_notice = 1 and (
                (notice.division in %(divisions)s)
                or (notice.division is null and notice.class in %(classes)s)
            )
        )) {cursor_condition} {search_condition}
        order by creation desc
        limit %(limit)s
    """,
        values=notices_values,
        as_dict=1,
    )
    final_notices = []
    for notice in notices:
        if notice.is_generic_notice:
            for student in students:
                for enrollment in enrollments:
                    if (
                        notice.division == enrollment.student_group
                        or (
                            not notice.division
                            and notice.get("class") == enrollment.program
                        )
                    ) and (
                        student.name == enrollment.student
                        and notice.student_status == student.get("student_status")
                        and notice.academic_year == enrollment.academic_year
                    ):
                        final_notices.append(
                            {
                                **notice,
                                "notice": render_jinja(notice.notice, student),
                                "subject": render_jinja(notice.subject, student),
                                "student_first_name": student_dict[
                                    student.name
                                ].first_name,
                                "student": student.name,
                            }
                        )
        else:
            final_notices.append(
                {
                    **notice,
                    "student_first_name": student_dict[notice.student].first_name,
                }
            )
    try:

        notice_statuses = frappe.get_all(
            "School Notice Status",
            filters=[
                ["student", "in", student_names],
                ["notice", "in", [notice.get("name") for notice in final_notices]],
                ["user", "=", user],
            ],
            fields=["*"],
        )

        for notice in final_notices:
            for notice_status in notice_statuses:
                if (
                    notice.get("name") == notice_status.notice
                    and notice.get("student") == notice_status.student
                ):
                    notice["is_read"] = notice_status.is_read
                    notice["is_archived"] = notice_status.is_archived
                    notice["is_stared"] = notice_status.is_stared
                    break
    except Exception as e:
        frappe.logger("notice").exception(e)

    filtered_notices = [
        notice
        for notice in final_notices
        if (
            notice.get("is_stared")
            if stared_only
            else (
                notice.get("is_archived")
                if archived_only
                else not notice.get("is_archived")
            )
        )
    ]

    has_more = len(notices) > limit

    next_cursor = (
        {
            "creation": notices[-1].get("creation"),
            "name": notices[-1].get("name"),
        }
        if has_more
        else None
    )
    result = {
        "notices": filtered_notices,
        "next_cursor": next_cursor,
        "has_more": has_more,
    }

    frappe.log_error(cache_key, result)

    frappe.cache().set_value(cache_key, result, expires_in_sec=300)

    return result


def create_or_update_notice_status(notice, student, statues):
    user = frappe.session.user
    if frappe.db.exists(
        "School Notice Status", {"notice": notice, "user": user, "student": student}
    ):
        notice_status = frappe.get_doc(
            "School Notice Status", {"notice": notice, "user": user, "student": student}
        )
        notice_status.update(statues)
        notice_status.save(ignore_permissions=True)
        return notice_status
    else:
        notice_status = frappe.new_doc("School Notice Status")
        notice_status.user = user
        notice_status.notice = notice
        notice_status.student = student
        notice_status.update(statues)
        notice_status.insert(ignore_permissions=True)
        return notice_status


@frappe.whitelist()
def mark_as_stared(notice, student, stared=True):
    return create_or_update_notice_status(
        notice, student, {"is_stared": 1 if stared else 0}
    )


@frappe.whitelist()
def mark_as_archived(notice, student, archived=True):
    return create_or_update_notice_status(
        notice, student, {"is_archived": 1 if archived else 0}
    )


@frappe.whitelist()
def mark_as_read(notice, student, read=True):
    return create_or_update_notice_status(
        notice, student, {"is_read": 1 if read else 0}
    )


@frappe.whitelist()
def get_notice_by_id(id, student=None):
    user = frappe.session.user
    guardian = frappe.get_cached_doc("Guardian", {"user": user})
    if is_disabled(guardian.name, True):
        return {
            "success": False,
            "data": [],
        }
    school_notice_doc = frappe.get_cached_doc("School Notice", id)

    # Only allow access to submitted notices

    school_notice = school_notice_doc.as_dict()
    if student and school_notice.is_generic_notice:
        student_doc = frappe.get_cached_doc("Student", student)
        student_data = student_doc.as_dict()
        school_notice = {
            **school_notice,
            "notice": render_jinja(school_notice_doc.notice, student_data),
            "subject": render_jinja(school_notice_doc.subject, student_data),
            "student_first_name": student_doc.first_name,
            "student": student_doc.name,
        }
    elif school_notice_doc.student:
        school_notice_status = (
            frappe.get_value(
                "School Notice Status",
                {"notice": id, "user": user, "student": student},
                ["is_read", "is_archived", "is_stared"],
                as_dict=True,
            )
            or {}
        )

        school_notice["student_first_name"] = frappe.db.get_value(
            "Student", school_notice.student, "first_name"
        )
        school_notice = {**school_notice, **school_notice_status}

    try:
        create_or_update_notice_status(id, student, {"is_read": 1})
        frappe.db.commit()
    except:
        pass

    return {
        "data": school_notice,
    }

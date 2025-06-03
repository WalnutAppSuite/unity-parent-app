import frappe
from frappe import _
from frappe.utils.response import build_response

@frappe.whitelist()
def get_timetable_data(student_group):
    """Fetches the timetable for a given student group."""

    if not student_group:
        return {
            "success": False,
            "error": "Student Group (Division) is required"
        }

    try:
        result = frappe.db.sql("""
            SELECT 
                JSON_OBJECTAGG(
                    custom_period_no, 
                    subquery.day_schedule
                ) AS structured_data
            FROM (
                SELECT 
                    custom_period_no,
                    JSON_OBJECTAGG(
                        custom_day, 
                        JSON_OBJECT(
                            "time", CONCAT(from_time, " - ", to_time),
                            "instructor", instructor,
                            "subject", course,
                            "room", room
                        )
                    ) AS day_schedule
                FROM `tabCourse Schedule`
                WHERE student_group = %s
                GROUP BY custom_period_no
            ) AS subquery
        """, (student_group,), as_dict=True)

        if not result or not result[0] or not result[0].get('structured_data'):
            return {
                "success": False,
                "error": f"No timetable found for {student_group}"
            }

        structured_timetable = frappe.parse_json(result[0]['structured_data'])

        return {
            "success": True,
            "data": {
                "student_group": student_group,
                "timetable": structured_timetable
            }
        }

    except Exception as e:
        error_message = f"Error fetching timetable for {student_group}: {str(e)}"
        frappe.log_error(f"{error_message}\n{frappe.get_traceback()}", "get_timetable_data")

        return {
            "success": False,
            "error": "An error occurred. Please try again later."
        }

import frappe
from frappe import _
@frappe.whitelist()
def get_observations(student_id, unit=None):
    response = {
        "observations_by_subject": {}
    }
    
    current_academic_year = get_current_academic_year()

    program_enrollment = frappe.get_all("Program Enrollment",
        filters={"student": student_id, "docstatus": 1, "academic_year": current_academic_year},
        fields=["name", "program"]
    )
    
    if not program_enrollment:
        frappe.throw(_("No program enrollment found for this student"))
    
    program = program_enrollment[0].program
    program_doc = frappe.get_doc("Program", program)
    
    course_marks = {
        course.course: {
            "homework": course.get("custom_homework_total_marks", 0) or 0,
            "classroom": course.get("custom_classroom_total_marks", 0) or 0,
            "attendance": course.get("custom_attendance_total_marks", 0) or 0
        }
        for course in program_doc.get("courses", [])
    }

    filters = {
        "program_enrollment": program_enrollment[0].name,
    }
    if unit:
        filters["unit"] = unit

    observation_data = frappe.get_all("Observation Data",
        filters=filters,
        fields=["name", "subject", "observation_type", "average_marks", "unit"]
    )

    for obs in observation_data:
        obs_marks = frappe.get_all(
            "Observation Marks",
            filters={"parent": obs.name},
            fields=["name","docstatus","idx","date","period_number","grade","remarks"]
        )

        # Get total marks for this subject's observation type
        subject_marks = course_marks.get(obs.subject, {})
        total_marks = 0
        
        # Determine which marks to use based on observation type
        obs_type = (obs.observation_type or "").lower()
        if "homework" in obs_type:
            total_marks = subject_marks.get("homework", 0)
        elif "classroom" in obs_type:
            total_marks = subject_marks.get("classroom", 0)
        elif "attendance" in obs_type:
            total_marks = subject_marks.get("attendance", 0)

        observation_details = {
            "name": obs.name,
            "subject": obs.subject,
            "observation_type": obs.observation_type,
            "observation_label": (obs.observation_type or "").split()[0] if obs.observation_type and obs.observation_type.strip() else "Unknown",
            "marks": obs.average_marks,
            "Table": obs_marks,
            "total_marks": total_marks
        }

        # Group observations by subject
        subject_key = obs.subject or "Uncategorized"
        if subject_key not in response["observations_by_subject"]:
            response["observations_by_subject"][subject_key] = []
        response["observations_by_subject"][subject_key].append(observation_details)

    return response

def get_current_academic_year(program_data=None):
    """
    Retrieves the current academic year with 1-minute caching.

    Returns:
        str: Name of the current academic year
    """
    cache_key = "current_academic_year"
    if program_data and hasattr(program_data, 'name'):
        cache_key = f"current_academic_year_{program_data.name}"

    current_year = frappe.cache.get_value(cache_key)

    if not current_year:
        try:
            current_year = frappe.db.get_value(
                "Academic Year", {"custom_current_academic_year": 1}, "name"
            )
        except Exception as e:
            frappe.log_error(f"Error fetching current academic year: {str(e)}")
            return None
                   
        if current_year:
            frappe.cache.set_value(
                cache_key, current_year, expires_in_sec=60
            )  # 1 minute cache

    return current_year

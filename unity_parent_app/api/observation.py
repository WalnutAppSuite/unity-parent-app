import frappe
from frappe import _
from walmiki_lms.walmiki_lms.utils import (
    get_current_academic_year,
)

@frappe.whitelist()
def get_observations(student_id, unit=None):
    response = {
        "observations_by_subject": {}
    }
    
    current_academic_year = get_current_academic_year()

    program_enrollment = frappe.get_all("Program Enrollment",
        filters={"student": student_id, "docstatus": 1, "academic_year": current_academic_year},
        fields=["name"]
    )
    
    if not program_enrollment:
        frappe.throw(_("No program enrollment found for this student"))
    
    program_enrollment_name = program_enrollment[0]["name"]

    filters = {
        "program_enrollment": program_enrollment_name,
    }
    if unit:
        filters["unit"] = unit

    observation_data = frappe.get_all("Observation Data",
        filters=filters,
        fields=["name", "subject", "observation_type", "marks", "scale", "unit"]
    )

    for obs in observation_data:
        obs_marks = frappe.get_all("Observation Marks",
            filters={"parent": obs.name},
            fields=["grade", "remarks", "date", "period_number"]
        )[0] if frappe.db.exists("Observation Marks", {"parent": obs.name}) else {}

        obs_result_filters = {
            "subject": obs.subject,
            "unit": obs.unit,
            "observation_type": obs.observation_type
        }

        obs_result = frappe.get_all("Observation Result",
            filters=obs_result_filters,
            fields=["name", "total_marks"]
        )

        class_avg, division_avg = None, None
        if obs_result:
            avg_scores = frappe.get_all("Observation Average Score",
                filters={"parent": obs_result[0]["name"]},
                fields=["class_average"]
            )
            division_scores = frappe.get_all("Observation Division Average",
                filters={"parent": obs_result[0]["name"]},
                fields=["division_average"]
            )
            class_avg = avg_scores[0]["class_average"] if avg_scores else None
            division_avg = division_scores[0]["division_average"] if division_scores else None
            total_marks = obs_result[0]["total_marks"] if obs_result else None

        observation_details = {
            "name": obs.name,
            "subject": obs.subject,
            "observation_type": obs.observation_type,
            "observation_label": obs.observation_type[0],
            "marks": obs.marks,
            "scale": obs.scale,
            "remarks": obs_marks.get("remarks"),
            "period": obs_marks.get("period_number"),
            "grade": obs_marks.get("grade"),
            "date": obs_marks.get("date"),
            "class_average": class_avg,
            "division_average": division_avg,
            "total_marks": total_marks,
        }

        # Group observations by subject
        subject_key = obs.subject or "Uncategorized"
        if subject_key not in response["observations_by_subject"]:
            response["observations_by_subject"][subject_key] = []
        response["observations_by_subject"][subject_key].append(observation_details)

    return response
import frappe
import re

@frappe.whitelist()
def get_waiting_and_admission_data(academic_year="2025-2026", branch=""):

    if not branch:
        frappe.throw("Branch is required to fetch data")

    query = """
        SELECT 
            COALESCE(s.joining_date, l.custom_walk_in_1_action_date) AS Relevant_Date,
            l.class AS Lead_Class,
            COUNT(DISTINCT l.name) AS Lead_Count,
            COUNT(DISTINCT s.name) AS Admission_Count
        FROM 
            tabLead l
        LEFT JOIN 
            `tabStudent Applicant` sa ON l.name = sa.lead
        LEFT JOIN 
            `tabStudent` s ON sa.name = s.student_applicant
        WHERE 
            l.academic_year = %s
            AND l.custom_walk_in_1_action_date IS NOT NULL
            AND l.class LIKE %s
        GROUP BY 
            Relevant_Date, l.class
        ORDER BY 
            Relevant_Date, l.class
    """

    query_params = [academic_year, f"%{branch}%"]

    results = frappe.db.sql(query, tuple(query_params), as_dict=True)

    frappe.log_error(f"Query Results: {results}", "Debug SQL Output")

    if not results:
        return {"error": "No data found for the given filters."}

    # Initialize data storage
    data_by_date = {}

    for row in results:
        date = row["Relevant_Date"]
        lead_class = row["Lead_Class"]
        lead_count = row["Lead_Count"]
        admission_count = row["Admission_Count"]

        # Debug log
        frappe.log_error(f"Processing row: {row}", "Debug Row Data")

        if date not in data_by_date:
            data_by_date[date] = {
                "waiting": [0] * 13,  
                "admissions": [0] * 13
            }

        # Extract class index
        match = re.search(r'\b\d+\b', lead_class)  # Extract number
        if match:
            class_index = int(match.group())
        elif "nursery" in lead_class.lower():
            class_index = 0
        elif "kg" in lead_class.lower():
            class_index = 1
        else:
            frappe.log_error(f"Unmapped class found: {lead_class}", "Class Mapping Issue")
            continue  # Skip unknown classes

        if 0 <= class_index <= 10:
            data_by_date[date]["waiting"][class_index] = lead_count
            data_by_date[date]["admissions"][class_index] = admission_count

    # Convert to final format
    waiting_data = []
    admission_data = []

    for date, counts in data_by_date.items():
        waiting_total = sum(counts["waiting"])
        admission_total = sum(counts["admissions"])

        counts["waiting"].append(waiting_total)
        counts["admissions"].append(admission_total)

        waiting_data.append({"name": date, "data": counts["waiting"]})
        admission_data.append({"name": date, "data": counts["admissions"]})

    response = {
        "waiting-list-data": waiting_data,
        "admission-data": admission_data
    }

    frappe.log_error(f"Final Response: {response}", "Response Debug")
    
    return response
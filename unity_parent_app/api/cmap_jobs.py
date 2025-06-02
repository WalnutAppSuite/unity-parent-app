import frappe
from frappe.utils.data import *

@frappe.whitelist(allow_guest=True)
def get_upcoming_online_ptm_links(student_id):
    """
    Get upcoming PTM links for a student.
    
    Args:
        student_id (str): The ID of the student
        
    Returns:
        dict: Dictionary containing PTM data and past PTMs flag
    """
    try:
        # Get both division and DLG PTMs in parallel
        division_result = get_online_ptms(student_id, "division")
        dlg_result = get_online_ptms(student_id, "dlg")

        # Combine results
        processed_list = []
        past_ptms_present = False

        if division_result:
            ptm_list, division_past_ptms = division_result
            processed_list.extend(process_ptm_list(ptm_list))
            past_ptms_present = past_ptms_present or division_past_ptms
        
        if dlg_result:
            dlg_ptm_list, dlg_past_ptms = dlg_result
            processed_list.extend(process_ptm_list(dlg_ptm_list))
            past_ptms_present = past_ptms_present or dlg_past_ptms

        return {
            "data": processed_list,
            "past_ptms": bool(past_ptms_present)
        }
        
    except Exception as e:
        frappe.log_error(f"Error in get_upcoming_online_ptm_links: {str(e)}")
        return {"data": [], "past_ptms": False}

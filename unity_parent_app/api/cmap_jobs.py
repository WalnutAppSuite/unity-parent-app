import frappe
from frappe.utils.data import *
from frappe.utils import get_datetime, now_datetime, add_to_date, get_url

import datetime
import requests
import json
from edu_quality.edu_quality.server_scripts.utils import current_academic_year
from frappe.core.doctype.communication.email import make

def generate_mention_html(base_url, user_id, message, name):
    mention_html = f'<div class="ql-editor read-mode"><p>'
    mention_html += (
        f'<span class="mention" data-id="{user_id}" '
        f'data-value="<a href=&quot;{base_url}/app/user-profile/{user_id}&quot; '
        f'target=&quot;_blank&quot;>{user_id}" '
        f'data-denotation-char="@" data-is-group="false" '
        f'data-link="{base_url}/app/user-profile/{user_id}">﻿'
        f'<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>'
        f'<a href="{base_url}/app/user-profile/{user_id}" target="_blank">{name}</a>'
        f"</span>﻿</span> {message}</p></div>"
    )
    return mention_html


def add_mentions(comment_by, user_id, content, reference_doctype, reference_name, name):
    # Format the content to include mentions
    mentioned_html = ""
    mentioned_html += generate_mention_html(
        frappe.utils.get_url(), user_id, message=content, name=name
    )
    # Create a new comment document
    comment = frappe.get_doc(
        {
            "doctype": "Comment",
            "comment_type": "Comment",
            "comment_by": comment_by,
            "content": f"{mentioned_html}",
            "reference_doctype": reference_doctype,
            "reference_name": reference_name,
        }
    )

    # Save the comment
    comment.insert(ignore_permissions=True)


def test():
    comment_by = "chanchal@walnutedu.in"
    mentioned_users = "chanchal@walnutedu.in"
    name = "Chanchal Kulkarni"
    content = "Your Next PTM Meeting for Class Division 10A and Subject "
    reference_doctype = "PTM Scheduler"
    reference_name = "PTM-2024-2025-class_division-False-66116"

    add_mentions(
        comment_by, mentioned_users, content, reference_doctype, reference_name, name
    )


def compare_time(time_str, minute_difference):
    try:
        # Convert time string to datetime object
        time_obj = get_datetime(time_str)

        # Calculate the time before the current time by the specified minute difference
        current_time = now_datetime()
        comparison_time = add_to_date(current_time, minutes=minute_difference)

        # Check if the given time is within the specified difference before the current time
        return time_obj <= comparison_time
    except:
        # Log the error message
        frappe.log_error(f"Error comparing time for PTM Scheduler", frappe.get_traceback())
        return False


def get_user_id_of_instructor(teacher_id):
    employee = frappe.get_value('Instructor', teacher_id, 'employee')
    user_id = frappe.get_value('Employee', employee, 'user_id')
    
    if user_id:
        return user_id
    else:
        frappe.log_error(
            f"User ID not found for instructor {teacher_id}"
        )
        return None


@frappe.whitelist()
def notify_teacher_before_one_hour_job():
    minute_difference = 60
    # Retrieve PTM Scheduler records that need notification
    ptms = frappe.get_all(
        "PTM Scheduler",
        filters={"is_notified": 0, "date": today()},
        fields=[
            "name", "slot", "subject", "teacher", "differential_learning_group", "division", "gmeet_link", "group"
        ],
    )
    notifi_added = []

    for ptm in ptms:
        ptm_url = f"{get_url()}/app/ptm-scheduler/{ptm.name}?view_students" 
        slot = ptm.get("slot")
        if slot:
            # Extract the start time from the slot
            timef = slot.split("-")[0].strip() if "-" in slot else slot.strip()
            if timef and compare_time(timef, minute_difference):
                # Get the user ID of the teacher
                user_id_teacher = get_user_id_of_instructor(ptm.teacher)
                if user_id_teacher:
                    # Notify the teacher
                    notifi_added.append(ptm.name)
                    # Create a comment mentioning the teacher
                    subject = get_subject_template(ptm)
                    content = get_content_template(ptm, subject)
                    make(
                        doctype="PTM Scheduler",
                        name=ptm.name,
                        content=content,
                        subject=subject,
                        recipients=user_id_teacher,
                        communication_medium="Email",
                        send_email=True,
                        now=True,
                    )

    if notifi_added:
        # Update the is_notified flag in a batch
        sql_query = """UPDATE `tabPTM Scheduler` SET is_notified = 1 WHERE name IN %s"""
        frappe.db.sql(sql_query, (tuple(notifi_added),))
        frappe.db.commit()

def get_subject_template(ptm):
    if ptm.differential_learning_group:
        return f"PTM Reminder for DLG {ptm.differential_learning_group}, Group {ptm.group} for Subject {ptm.subject}"
    else:   
        return f"PTM Reminder for Division {ptm.division}, Group {ptm.group} for Subject {ptm.subject}"


def get_content_template(ptm, subject=None):
    ptm_url = f"{get_url()}/app/ptm-scheduler/{ptm.name}?view_students"
    meeting_type = "DLG" if ptm.differential_learning_group else "Division"
    return f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05);">
        <h3 style="color: #1a365d; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">{subject or "PTM Meeting Reminder"}</h3>
        
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
            <p style="margin: 0; line-height: 1.8; color: #4a5568;">
                <strong style="color: #2d3748;">Meeting Type:</strong> <span style="color: #4a5568;">{meeting_type}</span><br>
                {f"<strong style='color: #2d3748;'>Division:</strong> <span style='color: #4a5568;'>{ptm.division}</span><br>" if meeting_type == "Division" else ""}
                {f"<strong style='color: #2d3748;'>DLG:</strong> <span style='color: #4a5568;'>{ptm.differential_learning_group}</span><br>" if meeting_type == "DLG" else ""}
                <strong style="color: #2d3748;">Group:</strong> <span style="color: #4a5568;">{ptm.group}</span><br>
                <strong style="color: #2d3748;">Subject:</strong> <span style="color: #4a5568;">{ptm.subject}</span><br>
                <strong style="color: #2d3748;">Time:</strong> <span style="color: #4a5568;">{ptm.slot}</span>
            </p>
        </div>

        <div style="margin-top: 25px;">
            <a href="{ptm.gmeet_link}" target="_blank" style="display: block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; margin-bottom: 10px; text-align: center;">
                <i class="fa fa-video-camera" style="margin-right: 8px;"></i> Join Meeting
            </a>
            <a href="{ptm_url}" target="_blank" style="display: block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; text-align: center;">
                <i class="fa fa-users" style="margin-right: 8px;"></i> View Students
            </a>
        </div>
    </div>
    """

def get_student_group_info(student_id, group_type="division"):
    """
    Get student group information based on group type.
    
    Args:
        student_id (str): The ID of the student
        group_type (str): Type of group to fetch ('division' or 'dlg')
        
    Returns:
        tuple/list/None: Group information based on type:
            - For division: (student_group, group_no)
            - For dlg: (dlg_list, group_no, student_group)
            - None if no data found or error occurs
    """
    if not student_id or not group_type:
        return None
        
    academic_year = current_academic_year()
    pe_filters = {
        "student": student_id,
        "academic_year": academic_year,
        "docstatus": 1
    }
    
    try:
        fields = ["student_group", "group_no"]
        if group_type == "division":
            # Get division data with all required fields in one query
            pe_data = frappe.db.get_value("Program Enrollment", pe_filters, fields, as_dict=1)
            
            if not pe_data or not pe_data.get("student_group"):
                return None
                
            return pe_data.get("student_group"), pe_data.get("group_no")
            
        elif group_type == "dlg":
            fields = ["name", "group_no"]
            # Get DLG data with all required fields in one query
            pe_data = frappe.db.get_value("Program Enrollment", pe_filters, fields, as_dict=1)
            
            if not pe_data:
                return None
                
            # Get DLG items in a single query
            filters = {"parent": pe_data.name}
            dlg_list = frappe.get_all("Differential Learning Item", filters=filters, fields=["item", "group_no"])
            
            if not dlg_list:
                return None
                
            return dlg_list
            
        else:
            frappe.log_error(f"Invalid group_type: {group_type}")
            return None
            
    except Exception as e:
        frappe.log_error(
            f"Error in get_student_group_info for student {student_id}: {str(e)}"
        )
        return None


def get_datetime_from_time_slot(date, time_slot):
    """
    Convert date and time slot to datetime object.
    
    Args:
        date (datetime.date): The date object
        time_slot (str): Time slot string in format "HH:MM AM/PM"
        
    Returns:
        datetime.datetime: Combined datetime object or None if invalid input
    """
    if not date or not time_slot:
        return None
        
    try:
        time_obj = datetime.datetime.strptime(time_slot.strip(), "%I:%M %p").time()
        return datetime.datetime.combine(date, time_obj)
    except (ValueError, AttributeError) as e:
        frappe.log_error(f"Error parsing time slot: {str(e)}")
        return None


def process_ptm_list(ptm_list):
    """Helper function to process PTM list and add datetime"""
    if not ptm_list:
        return []
        
    for ptm in ptm_list:
        ptm["datetime"] = get_datetime_from_time_slot(
            ptm.get("date"),
            ptm.get("slot", "").split("-")[1] if ptm.get("slot") else None
        )
        
    current_time = datetime.datetime.now()
    filtered_list = [
        item for item in ptm_list
        if item.get("datetime") and item.get("datetime") >= current_time
    ]
    filtered_list.sort(key=lambda x: x["datetime"])
    return filtered_list


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


def get_online_ptms(student_id, group_type):
    """
    Get online PTMs for a student based on group type.
    
    Args:
        student_id (str): The ID of the student
        group_type (str): Either "division" or "dlg"
        
    Returns:
        tuple: (ptm_list, past_ptms_present) or None if student group not found
    """
    try:
        # Get student group information
        group_info = get_student_group_info(student_id, group_type)
        if not group_info:
            return None

        # Base filters for current PTMs
        base_filters = {
            "gmeet_link": ["is", "set"],
            "date": [">=", getdate(today())]
        }
        past_filters = {"date": ["<", getdate(today())]}

        # Get PTM scheduler list based on group type
        ptm_scheduler_list = []
        if group_type == "division":
            student_group, group_no = group_info
            base_filters.update({
                "division": student_group,
                "group": str(group_no)
            })
            ptm_scheduler_list.extend(frappe.get_all(
                "PTM Scheduler",
                filters=base_filters,
                fields=["*"]
            ))
            # Check for past PTMs using a single query
            past_filters["division"] = student_group
            past_filters["group"] = str(group_no)
            past_ptm_exists = frappe.db.exists("PTM Scheduler", past_filters)            
        else:
            # Handle DLG case
            for dlg in group_info:
                dlg_filters = {
                    **base_filters,
                    "differential_learning_group": dlg.item,
                    "group": str(dlg.group_no)
                }
                ptms = frappe.get_all("PTM Scheduler", filters=dlg_filters, fields=["*"])
                ptm_scheduler_list.extend(ptms)

            dlg_items = [i.item for i in group_info]
            # Check for past PTMs using a single query
            past_filters["differential_learning_group"] = ["in", dlg_items]
            past_ptm_exists = frappe.db.exists("PTM Scheduler", past_filters)

        return ptm_scheduler_list, bool(past_ptm_exists)

    except Exception as e:
        frappe.log_error(f"Error in get_online_ptms for student {student_id}", frappe.get_traceback())
        return None

@frappe.whitelist()
def send_ptm_notifications_to_students():
    ptm_scheduler_list = get_ptm_scheduler_list()
    if not ptm_scheduler_list:
        return
    
    current_datetime = get_datetime().replace(second=0, microsecond=0)
    timeframes = {
        "12 Hours": datetime.timedelta(hours=12),
        "30 Minutes": datetime.timedelta(minutes=30),
        "5 Minutes": datetime.timedelta(minutes=5)
    }
    
    # Pre-process all PTM datetimes to avoid repeated calculations
    ptm_datetimes = {}
    for item in ptm_scheduler_list:
        ptm_datetimes[item["name"]] = get_datetime_from_time_slot(
            item["date"], 
            item["slot"].split("-")[0]
        ).replace(second=0, microsecond=0)
    
    # Group PTMs by notification timeframe
    notification_groups = {timeframe: [] for timeframe in timeframes}
    already_notified = set()
    
    # Process each PTM once and check all timeframes
    for item in ptm_scheduler_list:
        scheduled_datetime = ptm_datetimes[item["name"]]
        key = calculate_key(item)
        
        if key not in already_notified:
            for timeframe, delta in timeframes.items():
                cutoff_datetime = scheduled_datetime - delta
                if current_datetime == cutoff_datetime:
                    notification_groups[timeframe].append(item)
                    already_notified.add(key)
                    break  # No need to check other timeframes once notified
    
    # Process notifications in batches
    for timeframe, items in notification_groups.items():
        if items:
            handle_notify(items, timeframe)


def get_ptm_scheduler_list():
    today_date = getdate(today())
    tomorrow_date = getdate(add_days(today(), 1))

    # Get all PTM schedules for today and tomorrow with gmeet links
    filters = {
        "gmeet_link": ["is", "set"],
        "date": ("between", [today_date, tomorrow_date]),
    }
    fields = ["name", "division", "group", "differential_learning_group", "date", "slot"]
    ptm_scheduler_list = frappe.get_all("PTM Scheduler", filters=filters, fields=fields)    

    return ptm_scheduler_list


def handle_notify(ptm_items, time_inwords):
    if not ptm_items:
        return

    for item in ptm_items:
        ptm_doc = frappe.get_cached_doc("PTM Scheduler", item.get("name"))
        ptm_data = ptm_doc.get_students_for_ptm_division()
        student_data = ptm_data.get("students")
        if student_data:
            student_ids = [student.get("name") for student in student_data]
            if student_ids:
                notification_handler(student_ids, time_inwords)

def calculate_key(ptm_data):
    """Generate a unique key for a PTM schedule to avoid duplicate notifications"""
    is_dlg = bool(ptm_data.get("differential_learning_group"))
    ptm_type = "DLG" if is_dlg else "Division"
    ptm_field = "differential_learning_group" if is_dlg else "division"
    return f"{ptm_type}#{ptm_data.get(ptm_field)}#{ptm_data.get('group')}#{ptm_data.get('slot')}#{ptm_data.get('date')}"

def notification_handler(student_data, time_inwords):
    """Send notifications to guardians of students about upcoming PTM"""
    if not student_data:
        return
        
    student_ids = tuple(student_data)
    
    # Get all guardians with users for the given students in a single query
    guardian_details = frappe.get_all("Student Guardian", filters={"parent": ("in", student_ids)}, fields=["guardian.user"], distinct=True)
    
    # Send notifications to all guardians
    subject = f"Online PTM in {time_inwords}. Please join in!"
    # Batch send notifications
    for guardian in guardian_details:
        if guardian.user:
            send_notification_custom(subject=subject, user=guardian.user)


def send_notification_custom(subject, user):
    """Send push notification to a user's registered mobile devices"""
    if not user:
        return
        
    # Get all push tokens for the user
    push_tokens = frappe.get_all(
        "Mobile Push Token", filters={"user_id": user}, fields=["token"]
    )
    
    if not push_tokens:
        return
        
    url = "https://exp.host/--/api/v2/push/send"
    headers = {"Content-Type": "application/json"}
    
    # Prepare the notification payload
    notification_data = {
        "title": subject,
        "data": {"url_path": "/ptm-link"}
    }
    
    # Send to all tokens
    for push_token in push_tokens:
        token = push_token.get("token")
        if token:
            payload = json.dumps({**notification_data, "to": token})
            try:
                requests.request("POST", url, headers=headers, data=payload)
            except Exception as e:
                frappe.log_error(f"Push notification failed: {str(e)}", "PTM Notification Error")

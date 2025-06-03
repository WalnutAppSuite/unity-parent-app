import frappe

from edu_quality.edu_quality.server_scripts.student import mark_entry
from frappe.query_builder import Order
from datetime import datetime, timedelta
from edu_quality.edu_quality.server_scripts.utils import current_academic_year

from edu_quality.edu_quality.doctype.student_attendance_sheet.student_attendance_sheet import (
    get_holidays,
)


@frappe.whitelist()
def add_leave_note(
    note, status, student, dates, program, start_date, end_date, guardian=None
):
    """Add leave note for a student across multiple dates

    Args:
        note (str): Reason for leave
        status (str): Status type
        student (str): Student ID
        dates (list): List of dates
        program (str): Program/class
        start_date (str): Start date range
        end_date (str): End date range
        guardian (str): Guardian/user who applied for leave
    """
    # if not frappe.has_permission("Student", doc=student):
    #     return []
    holidays = get_holidays(start_date, end_date, program, True)
    doc = frappe.get_cached_doc("Guardian", guardian)
    for date in dates:
        date_obj = datetime.strptime(str(date), "%Y-%m-%d").date()
        if date_obj in holidays:
            continue

        mark_entry(
            student,
            "absent",
            note,
            date,
            user=doc.user,
            guardian=guardian,
            duplicate_check=True,
        )
    return {
        "success": True,
        "message": "Note Saved",
    }


@frappe.whitelist()
def add_early_pick_up(
    status,
    student,
    date,
    time,
    program,
    note=None,
    guardian=None,
):
    """Add early pickup or other attendance status for a student

    Args:
        status (str): Status type (early, late, etc.)
        student (str): Student ID
        date (str): Date of early pickup
        time (str): Time of early pickup
        program (str): Program/class
        note (str, optional): Reason note
        guardian (str, optional): Guardian/user who requested pickup
    """
    # if not frappe.has_permission("Student", doc=student):
    #     raise frappe.ValidationError("Accesss Denied")

    date_obj = datetime.strptime(str(date), "%Y-%m-%d").date()
    doc = frappe.get_cached_doc("Guardian", guardian)
    holidays = get_holidays(date, date, program, True)

    if date_obj in holidays:
        return {
            "success": False,
            "message": "Date Picked is an Holiday",
        }
    mark_entry(
        student,
        status,
        note,
        date,
        time,
        user=doc.user,
        guardian=guardian,
        duplicate_check=True,
    )

    return {
        "success": True,
        "message": "Note Saved",
    }


@frappe.whitelist()
def get_past_pick_ups(student):
    # if not frappe.has_permission("Student", doc=student):
    #     raise frappe.ValidationError("Accesss Denied")
    ae_qb = frappe.qb.DocType("Attendance Entry")
    ad_qb = frappe.qb.DocType("Absent and Delay")

    query = (
        frappe.qb.from_(ae_qb)
        .inner_join(ad_qb)
        .on((ae_qb.name == ad_qb.parent) & (student == ae_qb.student))
        .where(ad_qb.status.isin(["absent", "sick", "leave"]))
        .orderby(ae_qb.date, order=Order.desc)
        .select(
            ad_qb.reason,
            ae_qb.date,
        )
    )
    results = query.run(as_dict=True)
    for result in results:
        if result["date"]:
            date_obj = datetime.strptime(str(result["date"]), "%Y-%m-%d")
            result["date"] = date_obj.strftime("%d/%m/%y")
    return results


@frappe.whitelist()
def get_academic_year_months(student_id=None):
    """
    Get all months in the current academic year along with total student absence data

    Args:
        student_id (str, optional): Student ID to fetch absence data for

    Returns:
        dict: Dictionary containing academic year details and total absence data
    """
    # Get current academic year
    # if not frappe.has_permission("Student", doc=student_id):
    #     raise frappe.ValidationError("Accesss Denied")
    academic_year = current_academic_year()
    acad_doc = frappe.get_cached_doc("Academic Year", academic_year)

    if not acad_doc:
        return {
            "success": False,
            "message": "No current academic year found",
            "data": None,
        }

    academic_year = acad_doc
    start_date = academic_year.year_start_date
    end_date = academic_year.year_end_date

    # Use our helper function to get all months
    months_data = get_all_months_for_year(start_date, end_date)
    total_absences = 0

    # Calculate total absences for the academic year (if student_id provided)
    if student_id:
        # Get total absences from the main table
        absence_data = frappe.db.sql(
            """
            SELECT
                COUNT(*) as absent_count
            FROM
                `tabAttendance Entry`
            WHERE
                student = %s
                AND date BETWEEN %s AND %s
                AND status = 'Absent'
                AND docstatus IN (0, 1)
        """,
            (student_id, start_date, end_date),
            as_dict=True,
        )

        # Get total absences from the child table
        absent_delays = frappe.db.sql(
            """
            SELECT
                COUNT(*) as count
            FROM
                `tabAttendance Entry` ae
            INNER JOIN
                `tabAbsent and Delay` ad ON ae.name = ad.parent
            WHERE
                ae.student = %s
                AND ae.date BETWEEN %s AND %s
                AND ad.status IN ('absent', 'sick')
                AND ae.docstatus IN (0, 1)
        """,
            (student_id, start_date, end_date),
            as_dict=True,
        )

        total_absences = (absence_data[0].absent_count if absence_data else 0) + (
            absent_delays[0].count if absent_delays else 0
        )

    return {
        "success": True,
        "message": "Academic year months retrieved successfully",
        "data": {
            "academic_year": academic_year.name,
            "start_date": str(start_date),
            "end_date": str(end_date),
            "months": months_data,
            "total_absences": total_absences,
        },
    }


@frappe.whitelist(allow_guest=True)
def get_student_attendance_events(
    student_id, month, year=None, program="3-Walnut School at Wakad"
):
    """
    Get all attendance events for a student in a specific month, using correct year based on academic year

    Args:
        student_id (str): Student ID
        month (int): Month number (1-12)
        year (int): Year (this will be adjusted based on academic year)
        program (str): Program name

    Returns:
        list: List of events with title, date, and color
    """
    # if not frappe.has_permission("Student", doc=student_id):
    #     raise frappe.ValidationError("Accesss Denied")
    events = []
    
    # Get the correct year for the month based on academic year
    correct_year, academic_year_info = get_correct_year_for_month(month)

    if not correct_year:
        return events

    # Convert month and year to datetime objects for comparison
    int_month = int(month)
    month_start_date = f"{correct_year}-{int_month:02d}-01"

    # Calculate end date based on month
    if int_month == 12:
        next_month_year = correct_year + 1
        next_month = 1
    else:
        next_month_year = correct_year
        next_month = int_month + 1

    month_end_date = f"{next_month_year}-{next_month:02d}-01"
    month_end_date = (
        datetime.strptime(month_end_date, "%Y-%m-%d") - timedelta(days=1)
    ).strftime("%Y-%m-%d")

    # Get holidays
    holidays = get_holidays(month_start_date, month_end_date, program, True)
    
    # Add holidays to events
    for holiday in holidays:
        holiday_event = {
            "title": "Holiday",
            "date": holiday.strftime("%Y-%m-%d"),
            "status": "Holiday",
        }
        events.append(
            {
                "title": "Holiday",
                "date": holiday.strftime("%Y-%m-%d"),
                "color": get_status_color(holiday_event),
            }
        )

    # Get attendance entries
    ae_qb = frappe.qb.DocType("Attendance Entry")
    ad_qb = frappe.qb.DocType("Absent and Delay")

    # Get regular attendance entries
    attendance_entries = frappe.get_all(
        "Attendance Entry",
        filters={
            "student": student_id,
            "date": ["between", [month_start_date, month_end_date]],
            "docstatus": [0, 1],
        },
        fields=["status", "date", "name", "approval_status"],
    )

    # Process regular attendance entries
    for entry in attendance_entries:
        events.append(
            {
                "title": entry.status,
                "date": entry.date.strftime("%Y-%m-%d"),
                "color": get_status_color(entry),
                "approval_status": (
                    entry.approval_status if hasattr(entry, "approval_status") else None
                ),
            }
        )

    # Get all child table entries (Absent and Delay)
    special_events = (
        frappe.qb.from_(ae_qb)
        .inner_join(ad_qb)
        .on(ae_qb.name == ad_qb.parent)
        .where(
            (ae_qb.student == student_id)
            & (ae_qb.date.between(month_start_date, month_end_date))
            & (ae_qb.docstatus.isin([0, 1]))
        )
        .select(
            ad_qb.status,
            ae_qb.date,
            ad_qb.timestamp,
            ad_qb.reason,
            ad_qb.user,
            ae_qb.approval_status,
        )
        .run(as_dict=True)
    )

    # Map status patterns to title
    status_mapping = {
        "absent": {"title": "Absent"},
        "sick": {"title": "Sick"},
        "late": {"title": "Late"},
        "early": {"title": "Early Pickup"},
    }

    # Process each child table entry as a separate event
    for event in special_events:
        status_lower = event.status.lower()

        # Check if the status contains any of our target keywords
        matched_status = None
        for key in status_mapping:
            if key in status_lower:
                matched_status = key
                break

        if matched_status:
            # Keep original status title if possible, or use mapped title
            title = (
                event.status
                if event.status
                else status_mapping[matched_status]["title"]
            )

            events.append(
                {
                    "title": title,
                    "date": event.date.strftime("%Y-%m-%d"),
                    "color": get_status_color(event),
                    "timestamp": (
                        event.timestamp.strftime("%H:%M:%S")
                        if event.timestamp
                        else None
                    ),
                    "reason": event.reason,
                    "user": event.user,
                    "approval_status": (
                        event.approval_status
                        if hasattr(event, "approval_status")
                        else None
                    ),
                }
            )
    return [event for event in events if event["title"] is not None]


def get_all_months_for_year(start_date, end_date):
    """
    Generate all months between two dates with their start and end dates

    Args:
        start_date (date): Start date
        end_date (date): End date

    Returns:
        list: List of dictionaries containing month details
    """
    # Generate all months in the given date range
    start_datetime = datetime.strptime(str(start_date), "%Y-%m-%d")
    end_datetime = datetime.strptime(str(end_date), "%Y-%m-%d")

    current_date = start_datetime
    months_data = []

    while current_date <= end_datetime:
        year = current_date.year
        month = current_date.month
        month_name = current_date.strftime("%B")

        # Calculate month start and end dates
        month_start = datetime(year, month, 1).date()
        if month == 12:
            next_month_start = datetime(year + 1, 1, 1).date()
        else:
            next_month_start = datetime(year, month + 1, 1).date()
        month_end = next_month_start - timedelta(days=1)

        month_data = {
            "month_name": month_name,
            "month_number": month,
            "year": year,
            "month_start": month_start,
            "month_end": month_end,
        }

        months_data.append(month_data)

        # Move to next month
        if month == 12:
            current_date = datetime(year + 1, 1, 1)
        else:
            current_date = datetime(year, month + 1, 1)

    return months_data


def get_status_color(entry):
    """
    Determine the color for an attendance entry based on status and approval status

    Args:
        entry: The attendance entry object with status and possibly approval_status

    Returns:
        str: Color code using Walsh color scheme
    """

    # First check approval status if it exists
    if hasattr(entry, "approval_status") and entry.approval_status:
        if entry.approval_status == "Pending":
            return "var(--walsh-warning)"  # Yellow for pending
        elif entry.approval_status == "Approved":
            return "var(--walsh-success)"  # Green for approved
        elif entry.approval_status == "Rejected":
            return "var(--walsh-red)"  # Red for rejected
    return "gray"


def get_correct_year_for_month(month, academic_year_doc=None):
    """
    Determine the correct calendar year for a given month based on academic year boundaries

    Args:
        month (int): Month number (1-12)
        academic_year_doc (object, optional): Academic year document. If None, gets current academic year.

    Returns:
        int: The correct calendar year for the given month
        dict: Academic year details including start_date and end_date
    """
    if not academic_year_doc:
        acad_year = current_academic_year()
        academic_year_doc = frappe.get_cached_doc("Academic Year", acad_year)

    if not academic_year_doc:
        return None, None

    # Get academic year boundaries
    start_date = academic_year_doc.year_start_date
    end_date = academic_year_doc.year_end_date
    start_year = start_date.year
    end_year = end_date.year

    # Determine the correct year for the given month based on academic year
    academic_start_month = start_date.month
    int_month = int(month)

    # If academic year spans two calendar years (e.g., starts in April 2024, ends in March 2025)
    if start_year != end_year:
        # If month is before the starting month of academic year, it belongs to the second calendar year
        correct_year = end_year if int_month < academic_start_month else start_year
    else:
        correct_year = start_year

    academic_year_info = {
        "academic_year": academic_year_doc.name,
        "start_date": start_date,
        "end_date": end_date,
        "start_year": start_year,
        "end_year": end_year,
    }

    return correct_year, academic_year_info

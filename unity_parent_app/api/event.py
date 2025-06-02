import frappe
from frappe import _
from edu_quality.public.py.walsh.login import is_disabled


@frappe.whitelist()
def get_student_events(student_id=None, page=1, page_size=20, event_name_filter=""):
    """
    Get all events for a student based on their current program enrollment

    Args:
    student_id (str): Name of the Student record
        page (int): Page number for pagination
        page_size (int): Number of events per page
        event_name_filter (str): Filter events by name/title

    Returns:
        dict: List of events and pagination info
    """
    try:
        # Authentication check - ensure user is logged in
        if frappe.session.user == "Guest":
            frappe.throw(_("Authentication required"), frappe.AuthenticationError)
        
        # Check if user is a guardian and has access to this student
        if not student_id:
            return {"events": [], "total": 0, "page": page, "page_size": page_size}
            
        # Verify that the logged-in user is the guardian of this student
        student_doc = frappe.get_doc("Student", student_id)
        user_guardians = frappe.get_all(
            "Guardian", 
            filters={"user": frappe.session.user}, 
            fields=["name"]
        )
        
        if not user_guardians:
            frappe.throw(_("Access denied. User is not a guardian."), frappe.PermissionError)
        
        guardian_names = [g.name for g in user_guardians]
        student_guardians = [sg.guardian for sg in student_doc.get("guardians", [])]
        
        # Check if any of the user's guardian records match the student's guardians
        if not any(guardian in student_guardians for guardian in guardian_names):
            frappe.throw(_("Access denied. You don't have permission to view this student's events."), frappe.PermissionError)
        
        # Check if guardian account is disabled
        for guardian_name in guardian_names:
            if guardian_name in student_guardians and is_disabled(guardian_name, logout_if_defaulter=True):
                frappe.throw(_("Access denied. Your account is disabled."), frappe.PermissionError)

        # Calculate pagination offsets
        page = int(page) if page else 1
        page_size = int(page_size) if page_size else 20
        start = (page - 1) * page_size

        # Get the student's program
        student_program = None
        try:
            # Import current_academic_year function
            from edu_quality.edu_quality.server_scripts.utils import (
                current_academic_year,
            )

            # Get current academic year
            current_year = current_academic_year()

            # Get student's current program enrollment
            enrollment = frappe.db.get_value(
                "Program Enrollment",
                {
                    "student": student_id,
                    "academic_year": current_year,
                    "docstatus": 1,  # Only submitted documents
                },
                ["program", "custom_school"],
                as_dict=True,
            )

            if enrollment and enrollment.program:
                student_program = enrollment.program
                student_school = enrollment.custom_school

            # Log if no program found
            if not student_program:
                frappe.log_error(
                    f"No program enrollment found for student {student_id}",
                    "Event Gallery API",
                )
                return {"events": [], "total": 0, "page": page, "page_size": page_size}

        except Exception as e:
            frappe.log_error(
                f"Error getting student program: {str(e)}", "Event Gallery API"
            )
            return {"events": [], "total": 0, "page": page, "page_size": page_size}

        # Build filter conditions and parameters
        filter_conditions = []
        filter_params = [student_program, student_school]
        
        # Event name filter
        if event_name_filter:
            filter_conditions.append("AND e.subject LIKE %s")
            filter_params.append(f"%{event_name_filter}%")
        
        filter_clause = " ".join(filter_conditions)
        
        # Use a more efficient query with join
        # First get the total count for pagination
        # Updated query to include school filtering for "All Classes" events
        total_count_query = f"""
            SELECT COUNT(DISTINCT e.name) as total
            FROM `tabEvent` e
            LEFT JOIN `tabEvent Class` ec ON e.name = ec.parent
            WHERE (
                ec.class = %s 
                OR (e.all_classes = 1 AND e.custom_branch = %s)
            )
            AND e.custom_publish_to_mobile_app=1
            {filter_clause}
        """
        total_count = frappe.db.sql(total_count_query, filter_params, as_dict=True)
        total = total_count[0].total if total_count else 0
        
        # Main query to get events with pagination
        # Updated query to include school filtering for "All Classes" events
        events_query = f"""
            SELECT 
                e.name as id,
                e.subject as title,
                DATE_FORMAT(e.starts_on, '%%Y-%%m-%%d') as date,
                e.description,
                e.background_image as thumbnail,
                (SELECT COUNT(*) FROM `tabEvent Gallery Image` gi WHERE gi.parent = e.name) as imageCount
            FROM 
                `tabEvent` e
            LEFT JOIN 
                `tabEvent Class` ec ON e.name = ec.parent
            WHERE 
                (
                    ec.class = %s 
                    OR (e.all_classes = 1 AND e.custom_branch = %s)
                )
                AND e.custom_publish_to_mobile_app=1
                {filter_clause}
            GROUP BY 
                e.name 
            ORDER BY 
                e.starts_on DESC
            LIMIT %s OFFSET %s
        """

        # Add pagination parameters to filter_params
        query_params = filter_params + [page_size, start]
        events_list = frappe.db.sql(events_query, query_params, as_dict=True)
        # Process the events
        for event in events_list:
            # If no thumbnail, use a default image
            if not event.get("thumbnail"):
                event["thumbnail"] = "/assets/edu_quality/images/event_default.jpg"

            # Limit description length
            if event.get("description") and len(event.get("description")) > 100:
                event["description"] = event.get("description")[:100] + "..."

        return {
            "events": events_list,
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    except Exception as e:
        frappe.log_error(f"Error in get_student_events: {str(e)}", "Event Gallery API")
        return {
            "events": [],
            "total": 0,
            "page": page,
            "page_size": page_size,
            "error": str(e),
        }


@frappe.whitelist()
def get_event_details(event_id=None):
    """
    Get details of a specific event including all images

    Args:
        event_id (str): Name of the Event record

    Returns:
        dict: Event details with images
    """
    try:
        # Authentication check - ensure user is logged in
        if frappe.session.user == "Guest":
            frappe.throw(_("Authentication required"), frappe.AuthenticationError)
        
        # Check if user is a guardian
        user_guardians = frappe.get_all(
            "Guardian", 
            filters={"user": frappe.session.user}, 
            fields=["name"]
        )
        
        if not user_guardians:
            frappe.throw(_("Access denied. User is not a guardian."), frappe.PermissionError)
        
        # Check if any guardian account is disabled
        for guardian in user_guardians:
            if is_disabled(guardian.name, logout_if_defaulter=True):
                frappe.throw(_("Access denied. Your account is disabled."), frappe.PermissionError)
        
        if not event_id:
            return {"event": {}, "success": False, "message": "Event ID is required"}

        # Optimized query to get event details and images in one go
        event_query = """
            SELECT 
                e.name as id,
                e.subject as title,
               
                e.description,
                e.background_image as thumbnail
            FROM 
                `tabEvent` e
            WHERE 
                e.name = %s
                AND e.custom_publish_to_mobile_app=1
            LIMIT 1
        """

        event_details = frappe.db.sql(event_query, (event_id,), as_dict=True)

        if not event_details:
            return {"event": {}, "success": False, "message": "Event not found"}

        event_data = event_details[0]

        # Get gallery images
        images_query = """
            SELECT 
                image as url,
                image as thumbnail,
                image_caption as caption,
                idx
            FROM 
                `tabEvent Gallery Image`
            WHERE 
                parent = %s
            ORDER BY 
                idx
        """

        gallery_images = frappe.db.sql(images_query, (event_id,), as_dict=True)

        # Process images for client-side format
        images_list = []
        for idx, img in enumerate(gallery_images):
            img["id"] = f"img_{idx+1}"
            if not img.get("caption"):
                img["caption"] = f"Image {idx+1}"
            images_list.append(img)

        event_data["images"] = images_list
        event_data["imageCount"] = len(images_list)

        # If no thumbnail, use default
        if not event_data.get("thumbnail"):
            event_data["thumbnail"] = "/assets/edu_quality/images/event_default.jpg"

        return {"event": event_data, "success": True}

    except Exception as e:
        frappe.log_error(f"Error in get_event_details: {str(e)}", "Event Gallery API")
        return {"event": {}, "success": False, "message": str(e)}

# Copyright (c) 2024, Hybrowlabs Technologies and contributors
# For license information, please see license.txt

import frappe
import os

@frappe.whitelist()
def ensure_folder_exists(folder_name):
    """
    Ensure a local folder exists for the event
    """
    try:
        if not folder_name:
            frappe.throw("Folder name is required")

        formData = {
            "file_name": folder_name,
            "folder": "Home"
        }

        # Check if folder exists in Home directory
        try:
            res = frappe.db.get_value("File", {"name": f"Home/{folder_name}"})
            if not res:
                # Create folder if it doesn't exist
                frappe.get_doc({
                    "doctype": "File",
                    "file_name": folder_name,
                    "is_folder": 1,
                    "folder": "Home"
                }).insert()

            return {
                "status": "SUCCESS",
                "message": f"Folder Home/{folder_name} exists or was created"
            }
        except Exception as e:
            frappe.log_error(f"Error ensuring folder exists: {str(e)}", "Event Image Handler")
            return {
                "status": "ERROR",
                "message": f"Failed to create folder: {str(e)}"
            }
    except Exception as e:
        frappe.log_error(f"Error in ensure_folder_exists: {str(e)}", frappe.get_traceback())
        return {
            "status": "ERROR",
            "message": str(e)
        }

@frappe.whitelist()
def process_event_image(**data):
    """
    Process event images - using Frappe's native file storage
    Similar to carnival event logic but for Event doctype

    1. Organize file in the correct folders
    2. Update file document with proper attachments
    3. Ensure all files are private
    4. Add to event gallery if needed by directly attaching to child table
    """
    try:
        # Handle both mobile and web upload parameters
        if "storedParams" in data:
            # Mobile app upload
            folder_name = data.get("storedParams", {}).get("folder_name")
            is_background = data.get("storedParams", {}).get("is_background", False)
            add_to_gallery = data.get("storedParams", {}).get("add_to_gallery", True)
            file_doc_name = data.get("name")
        else:
            # Direct API call
            folder_name = data.get("folder_name")
            is_background = data.get("is_background", False)
            add_to_gallery = data.get("add_to_gallery", True)
            file_doc_name = data.get("file_doc_name")

        if not folder_name:
            frappe.throw("Folder name is required")

        if not file_doc_name:
            frappe.throw("File document name is required")

        # Get the file document
        file_doc = frappe.get_doc("File", file_doc_name)

        # Update file document
        file_doc.folder = f'Home/{folder_name}'
        file_doc.is_private = 1  # Ensure it's private
        file_doc.attached_to_doctype = "Event"
        file_doc.attached_to_name = folder_name
        file_doc.save(ignore_permissions=True)

        # Add to gallery or set as background image if needed
        event_doc = frappe.get_doc("Event", folder_name)

        if is_background:
            event_doc.background_image = file_doc.file_url
            event_doc.save(ignore_permissions=True)

            return {
                "status": "SUCCESS",
                "message": "File uploaded and set as background image",
                "file_url": file_doc.file_url
            }
        elif add_to_gallery:
            # Following carnival event approach - append to child table
            # Check if image is already in gallery to avoid duplicates
            image_exists = False
            for img in event_doc.get("custom_gallery_images", []):
                if img.image == file_doc.file_url:
                    image_exists = True
                    break

            if not image_exists:
                # Add to the gallery child table
                event_doc.append("custom_gallery_images", {
                    "image": file_doc.file_url,
                    "image_caption": ""
                })
                event_doc.save(ignore_permissions=True)

            return {
                "status": "SUCCESS",
                "message": "File uploaded and added to gallery",
                "file_url": file_doc.file_url
            }
        else:
            return {
                "status": "SUCCESS",
                "message": "File uploaded",
                "file_url": file_doc.file_url
            }

    except Exception as e:
        frappe.log_error(
            f"Event image upload error: {str(e)}",
            frappe.get_traceback()
        )
        return {
            "status": "ERROR",
            "message": str(e)
        }

@frappe.whitelist()
def handle_background_image(event_name, file_doc_name):
    """
    Handle event background image setting

    Args:
        event_name: Name of the event doctype
        file_doc_name: Name of the file document
    """
    try:
        # Process file using direct parameters (compatible with both web and mobile)
        result = process_event_image(
            folder_name=event_name,
            file_doc_name=file_doc_name,
            is_background=True,
            add_to_gallery=False
        )

        return result

    except Exception as e:
        frappe.log_error(
            f"Background image update error: {str(e)}",
            frappe.get_traceback()
        )
        return {
            "status": "ERROR",
            "message": str(e)
        }

@frappe.whitelist()
def batch_process_event_images(file_doc_names=None, event_name=None):
    """
    Process multiple images for an event gallery
    Uses carnival event approach of direct child table attachment

    Args:
        file_doc_names: List of File document names
        event_name: Name of the Event

    Returns:
        dict: Results of upload operations
    """
    if not file_doc_names or not event_name:
        frappe.throw("Both file_doc_names and event_name are required")

    if isinstance(file_doc_names, str):
        import json
        file_doc_names = json.loads(file_doc_names)

    results = []

    for file_name in file_doc_names:
        try:
            # Using direct parameters instead of nested structure
            result = process_event_image(
                folder_name=event_name,
                file_doc_name=file_name,
                is_background=False,
                add_to_gallery=True
            )
            results.append({
                "file_name": file_name,
                "status": result.get("status"),
                "file_url": result.get("file_url"),
                "message": result.get("message")
            })
        except Exception as e:
            frappe.log_error(f"Error processing file {file_name}: {str(e)}", "Batch Event Image Process")
            results.append({
                "file_name": file_name,
                "status": "ERROR",
                "message": str(e)
            })

    # Log overall batch results
    frappe.logger("Event Gallery").info(f"Batch processed {len(results)} images for event {event_name}")

    return {
        "status": "SUCCESS" if all(r.get("status") == "SUCCESS" for r in results) else "PARTIAL",
        "results": results
    }
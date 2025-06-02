import frappe
from edu_quality.api.google_service_auth import GoogleServiceAccountAuth
from googleapiclient.discovery import build
from requests import get, post
from googleapiclient.errors import HttpError
import os
import secrets
from edu_quality.public.py.utils import add_indian_country_code
import re
import json
import time


PASSWORD_LENGTH = 12
MAX_RETRIES = 3


def get_google_admin_object():
    """
    Returns an object of Google Admin.
    """

    oauth_obj = GoogleServiceAccountAuth("admin")

    google_admin = oauth_obj.get_google_service_object()

    return google_admin


# edu_quality.api.google_admin.get_google_users
@frappe.whitelist()
def get_google_users():
    admin_obj = get_google_admin_object()
    return admin_obj.users().list()


@frappe.whitelist()
def get_google_user_with_key(email_key):
    """
    Get a Google user by email key with retry mechanism and Discord notification on failure
    """
    admin_obj = get_google_admin_object()
    MAX_RETRIES = 3
    retry_count = 0
    last_error = None
    
    while retry_count < MAX_RETRIES:
        try:
            frappe.log_error(f"Attempt {retry_count + 1} - Getting Google user with key: {email_key}", "Google User Lookup")
            result = (
                admin_obj.users()
                .get(
                    userKey=f"{email_key}@walnutedu.in",
                )
                .execute()
            )
            return result
        
        except Exception as e:
            last_error = e
            retry_count += 1
            
            frappe.log_error(
                f"Google User Lookup failed (Attempt {retry_count}/{MAX_RETRIES})",
                str([
                    frappe.get_traceback(),
                    "variables",
                    email_key,
                    str(e)
                ])
            )
            
            if retry_count < MAX_RETRIES:
                import time
                time.sleep(2 ** retry_count)  # 2, 4, 8 seconds between retries
    
    error_message = f"Failed to lookup Googl    e user after {MAX_RETRIES} attempts\n\n" \
                   f"**User Details:**\n" \
                   f"- Email Key: {email_key}\n" \
                   f"- Full Email: {email_key}@walnutedu.in\n\n" \
                   f"**Error:**\n{str(last_error)}"
    
    send_discord_webhook(error_message, title="Google User Lookup Failed")
    
    return None


def send_discord_webhook(message, title="Google Account Creation Failed"):
    """
    Send a notification to Discord webhook when Google account creation fails
    """
    try:
        webhook_url = "https://discord.com/api/webhooks/1201755894812266556/zGlBQMIRiLGzZHFFaX4QXFVwBeZZTNhgKI7raND9721WYg8Piuwja2_DX6C11QHJJLVo"
            
        # Prepare the Discord message payload
        payload = {
            "embeds": [{
                "title": title,
                "description": message,
                "color": 15158332,  # Red color for error
                "timestamp": frappe.utils.now_datetime().isoformat()
            }]
        }
        
        response = post(
            webhook_url,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 204:
            frappe.log_error(f"Successfully sent Discord notification: {title}", "Discord Notification")
            return True
        else:
            frappe.log_error(f"Discord webhook failed with status {response.status_code}", "Discord Notification Failed")
            return False
    except Exception as e:
        frappe.log_error(f"Discord webhook error: {str(e)}", "Discord Notification Failed")
        return False

@frappe.whitelist()
def create_google_user(
    email_key, first_name, last_name, recovery_mail, phone_no, school, org_unit_path=None
):
    user_service = get_google_admin_object()
    exception = False
    existing_user = None
    
    # Check if user already exists
    try:
        existing_user = (
            user_service.users()
            .get(
                userKey=f"{email_key}@walnutedu.in",
            )
            .execute()
        )
        return existing_user  # User already exists, return the user data
    except:
        exception = True  # User doesn't exist, proceed with creation

    # Prepare user data for creation
    new_user = {
        "primaryEmail": f"{email_key}@walnutedu.in",
        "name": {
            "givenName": first_name,
            "familyName": last_name,
        },
        "password": "walnut@12345",
        "changePasswordAtNextLogin": True,
        "ipWhitelisted": False,
        "orgUnitPath": org_unit_path or f"/{school}/Students",
    }
    
    # Validate and set recovery email
    recovery_mail = (str(recovery_mail) or "feedback@walnutedu.in").strip().lower()
    email_pattern = r"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    match = re.match(email_pattern, recovery_mail)
    if not match:
        recovery_mail = "feedback@walnutedu.in"
    new_user["recoveryEmail"] = recovery_mail
    
    # Add recovery phone if available
    if phone_no:
        try:
            formatted_phone = add_indian_country_code(phone_no, True)
            new_user["recoveryPhone"] = formatted_phone
        except Exception as phone_error:
            frappe.log_error(f"Error formatting phone number: {str(phone_error)}", "Google Account Creation")
    
    # Retry mechanism for account creation
    retry_count = 0
    last_error = None
    
    while retry_count < MAX_RETRIES:
        try:
            frappe.log_error(f"Attempt {retry_count + 1} - Creating account for {email_key}@walnutedu.in", "Google Account Creation")
            resp = (
                user_service.users()
                .insert(
                    body=new_user,
                )
                .execute()
            )
            frappe.log_error(f"Successfully created account for {email_key}@walnutedu.in", "Google Account Creation")
            return resp  # Success, return the response
        
        except Exception as e:
            last_error = e
            retry_count += 1
            
            # Log the error
            frappe.log_error(
                f"Google Account Creation failed (Attempt {retry_count}/{MAX_RETRIES})",
                str([
                    frappe.get_traceback(),
                    "variables",
                    email_key,
                    first_name,
                    last_name,
                    recovery_mail,
                    phone_no,
                    school,
                    str(e)
                ])
            )
            
            if retry_count < MAX_RETRIES:
                time.sleep(2 ** retry_count)  # 2, 4, 8 seconds between retries
    
    # All retries failed, send Discord notification
    error_message = f"Failed to create Google account after {MAX_RETRIES} attempts\n\n" \
                   f"**Student Details:**\n" \
                   f"- Email: {email_key}@walnutedu.in\n" \
                   f"- Name: {first_name} {last_name}\n" \
                   f"- School: {school}\n\n" \
                   f"**Error:**\n{str(last_error)}"
    
    send_discord_webhook(error_message)
    
    return None  # Return None to indicate failure


def add_user_to_group(email, group_email):
    try:
        user_service = get_google_admin_object()
        user_service.members().insert(
            groupKey=group_email, body={"email": email, "role": "MEMBER"}
        ).execute()
    except Exception as e:
        frappe.logger("google_groups").exception(e)


def remove_user_from_group(email, group_email):
    try:
        user_service = get_google_admin_object()
        user_service.members().delete(groupKey=group_email, memberKey=email)
    except Exception as e:
        frappe.logger("google_groups").exception(e)


def suspend_google_user(email):
    try:
        user_service = get_google_admin_object()
        user_service.users().update(
            userKey=email,
            body={"suspended": True},
        ).execute()
    except:
        frappe.log_error(
            f"suspend_google_user failed: {email}", frappe.get_traceback()
        )


def unsuspend_google_user(email):
    try:
        user_service = get_google_admin_object()
        user_service.users().update(
            userKey=email,
            body={"suspended": False},
        ).execute()
    except:
        frappe.log_error(
            f"unsuspend_google_user failed: {email}", frappe.get_traceback()
        )


def delete_google_user(email):
    try:
        user_service = get_google_admin_object()
        user_service.users().delete(userKey=email).execute()
    except:
        frappe.log_error(
            f"delete_google_user failed: {email}", frappe.get_traceback()
        )
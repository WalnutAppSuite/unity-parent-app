import frappe

@frappe.whitelist()
def check_and_deduct_stock(docname):
    try:
        sales_invoice = frappe.get_doc("Sales Invoice", docname)
        stock_issues = []

        for item in sales_invoice.items:
            if not item.warehouse:
                continue  

            # Get available stock
            available_qty = frappe.db.get_value("Bin", 
                {"item_code": item.item_code, "warehouse": item.warehouse}, 
                "actual_qty"
            ) or 0  
            if available_qty < item.qty:
                stock_issues.append(f"Item {item.item_code} has only {available_qty} in stock, but {item.qty} is required.")

        if stock_issues:
            return {"status": "error", "message": "\n".join(stock_issues)}

        return process_pending_sales_invoices_for_single_invoice(sales_invoice)

    except Exception as e:
        frappe.log_error(f"Error in check_and_deduct_stock for Sales Invoice {docname}: {str(e)}", "Stock Processing Error")
        return {"status": "error", "message": str(e)}



def process_pending_sales_invoices_for_single_invoice(sales_invoice):
    try:
        company = sales_invoice.company
        pos_profile = sales_invoice.pos_profile

        # Determine source school based on POS Profile
        if pos_profile == "Uniform Fursungi":
            source_school = "Walnut School at Fursungi"
        elif pos_profile == "Uniform Wakad":
            source_school = "Walnut School at Wakad"
        elif pos_profile == "Uniform Shivane":
            source_school = "Walnut School at Shivane"
        else:
            return {"status": "error", "message": f"Invalid POS Profile {pos_profile} for Sales Invoice {sales_invoice.name}"}

        stock_deducted = False  
        log_data = []  

        for item in sales_invoice.items:
            if not item.warehouse:
                continue  

            stock_entry = frappe.get_doc({
                "doctype": "Stock Entry",
                "company": company,
                "custom_source_school": source_school,
                "stock_entry_type": "Material Issue",
                "items": [{
                    "item_code": item.item_code,
                    "qty": item.qty,
                    "s_warehouse": item.warehouse
                }]
            })
            stock_entry.insert()
            stock_entry.submit() 
            stock_deducted = True  
            log_data.append(f"Stock deducted: {item.qty} for {item.item_code} from {item.warehouse}")

        if stock_deducted:
            frappe.db.set_value("Sales Invoice", sales_invoice.name, "custom_booking_status", "Delivered")
            frappe.db.commit()
            log_data.append(f"Updated Sales Invoice {sales_invoice.name} to Delivered")

        if log_data:
            frappe.log_error("\n".join(log_data), f"Stock Update Log for {sales_invoice.name}")

        return {"status": "success", "message": "Stock deducted successfully"}

    except Exception as e:
        frappe.log_error(f"Unexpected error: {str(e)}", "Sales Invoice Processing Error")
        return {"status": "error", "message": str(e)}

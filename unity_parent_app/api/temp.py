import frappe


@frappe.whitelist()
def change_test_taker_passwords(student_ids, password="Walnut@12345"):
    user_qb = frappe.qb.DocType("User")
    test_taker_qb = frappe.qb.DocType("Test Taker")
    student_qb = frappe.qb.DocType("Student")

    query = (
        frappe.qb.from_(student_qb)
        .left_join(test_taker_qb)
        .on(student_qb.name == test_taker_qb.student)
        .inner_join(user_qb)
        .on(user_qb.name == test_taker_qb.user)
        .where((student_qb.name.isin(student_ids)))
        .select(user_qb.enabled, user_qb.name, student_qb.name.as_("student"))
    )
    data = query.run(as_dict=True)

    for user in data:
        if user.name:
            d = frappe.get_doc("User", user.name)
            if not user.enabled:
                d.enabled = 1
            d.new_password = password
            d.save()
        else:
            try:
                create_test_taker(user.student)
            except Exception as e:
                frappe.log_error(
                    f"Error Creating Test Taker for student {user.student}",
                    frappe.get_traceback(),
                )


def create_test_taker(student):
    if not frappe.db.exists("Test Taker", {"student": student}):
        doc = frappe.new_doc("Test Taker")
        doc.update({"student": student})
        doc.insert(ignore_permissions=True)


@frappe.whitelist()
def async_change_test_taker_passwords(student_ids, password="Walnut@12345"):
    frappe.enqueue(
        change_test_taker_passwords,
        queue="long",
        timeout=60000,
        password=password,
        student_ids=student_ids,
    )

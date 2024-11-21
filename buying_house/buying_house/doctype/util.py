import frappe
from frappe.utils import get_site_path


@frappe.whitelist()
def get_sku_details(customer_po_name):
    # Fetch the required data from the 'SKU Detail' doctype with a condition
    results = frappe.db.get_all(
        'SKU Detail',
        fields=['sku', 'item_description', 'size'],
        filters={'parent': customer_po_name}  # Filter by parent field
    )
    return results


@frappe.whitelist()
def capture(file=None):
    # Access uploaded file content and metadata
    file_content = frappe.local.uploaded_file
    file_name = frappe.local.uploaded_filename

    # Define the path to save the file
    file_path = get_site_path("public", "files", file_name)

    # Write the uploaded file to the defined path
    with open(file_path, "wb") as f:
        f.write(file_content)

    # Create a new File record in the Frappe system
    file_doc = frappe.get_doc({
        "doctype": "File",
        "file_name": file_name,
        "file_url": f"/files/{file_name}",
        "is_private": 0  # Set to 1 if the file should be private
    })
    file_doc.insert(ignore_permissions=True)

    # Commit the changes to the database
    frappe.db.commit()

    # Return the file object
    return file_doc
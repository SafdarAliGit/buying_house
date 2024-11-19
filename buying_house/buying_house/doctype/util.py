import frappe


@frappe.whitelist()
def get_sku_details(customer_po_name):
    # Fetch the required data from the 'SKU Detail' doctype with a condition
    results = frappe.db.get_all(
        'SKU Detail',
        fields=['sku', 'item_description', 'size'],
        filters={'parent': customer_po_name}  # Filter by parent field
    )
    return results

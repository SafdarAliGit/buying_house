import frappe
from frappe.utils import get_site_path
from frappe.query_builder import Field
from frappe.query_builder.functions import Coalesce


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




@frappe.whitelist()
def fetch_min_max_values(**args):
    # Define the main table and child table
    levels_master = frappe.qb.DocType("Levels Master")
    levels_master_items = frappe.qb.DocType("Levels Master Items")

    # Build the query
    query = (
        frappe.qb.from_(levels_master)
        .join(levels_master_items)
        .on(levels_master.name == levels_master_items.parent)
        .where(
            (levels_master.inspection_type == args.get("inspection_type"))
            & (levels_master.inspection_levels == args.get("inspection_levels"))
            & (levels_master.min_qty <= int(args.get("total_pcs")))
            & (levels_master.max_qty >= int(args.get("total_pcs")))
            & (levels_master_items.level_value == args.get("aql_level"))

        )
        .select(levels_master_items.min_value, levels_master_items.max_value)
        .limit(1)  # Fetch only the first record
    )

    # Execute the query
    result = query.run(as_dict=True)

    # Return the result
    return result[0] if result else None

  # Use comparison operators

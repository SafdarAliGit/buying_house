import frappe
from frappe.utils import get_site_path
from frappe.query_builder import Field
from frappe.query_builder.functions import Coalesce


@frappe.whitelist()
def get_sku_details(customer_po_name):
    # Fetch data from the 'SKU Detail' doctype
    sku_detail_results = frappe.db.get_all(
        'SKU Detail',
        fields=[
            'sku', 'item_description', 'no_of_ctn', 'no_of_doz', 'pcs',
            's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl',
            '7xl', '8xl', '9xl', '10xl', '11xl', '12xl'
        ],
        filters={'parent': customer_po_name}  # Filter by parent field
    )

    # Fetch data from the 'SKU Detail Item' doctype
    sku_detail_home_item_results = frappe.db.get_all(
        'SKU Detail Home',
        fields=['sku', 'product_type', 'size', 'qty_ctn', 'qty_pcs'],
        filters={'parent': customer_po_name}  # Filter by parent field
    )

    # Combine the results into a dictionary
    combined_results = {
        'sku_detail': sku_detail_results,  # Data from 'SKU Detail'
        'sku_detail_home_item': sku_detail_home_item_results  # Data from 'SKU Detail Item'
    }

    return combined_results


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
        .select(levels_master_items.min_value, levels_master_items.max_value, levels_master_items.qty)
        .limit(1)  # Fetch only the first record
    )

    # Execute the query
    result = query.run(as_dict=True)

    # Return the result
    return result[0] if result else None


# Use comparison operators
@frappe.whitelist()
def get_specs_template(parent_name):
    child = frappe.qb.DocType("PO Specs Template Item")
    specs = (
        frappe.qb.from_(child)
        .select(
            child.specification,
            child.standard_value
        )
        .where(child.parent == parent_name)
    ).run(as_dict=True)

    return specs

@frappe.whitelist()
def get_item_specification_details(item_code):
    parent_name = frappe.db.get_value("Item Specification", {"item": item_code}, "name")

    if not parent_name:
        return {
            "item_spec1": [],
            "item_spec2": [],
            "item_spec3": [],
        }

    item_spec1 = frappe.db.sql("SELECT * FROM `tabItem Spec1` WHERE parent=%s order by idx", parent_name, as_dict=True)
    item_spec2 = frappe.db.sql("SELECT * FROM `tabItem Spec2` WHERE parent=%s order by idx", parent_name, as_dict=True)
    item_spec3 = frappe.db.sql("SELECT * FROM `tabItem Spec3` WHERE parent=%s order by idx", parent_name, as_dict=True)

    return {
        "item_spec1": item_spec1,
        "item_spec2": item_spec2,
        "item_spec3": item_spec3,
    }
# @frappe.whitelist()
# def get_item_specification_details_for_inspection_report(customer_po):
#     parent_name = frappe.get_doc("Customer PO", customer_po).name

#     if not parent_name:
#         return {
#             "item_spec1": [],
#             "item_spec2": [],
#             "item_spec3": [],
#         }

#     item_spec1 = frappe.db.sql("SELECT * FROM `tabCPO Item Spec1` WHERE parent=%s", parent_name, as_dict=True)
#     item_spec2 = frappe.db.sql("SELECT * FROM `tabCPO Item Spec2` WHERE parent=%s", parent_name, as_dict=True)
#     item_spec3 = frappe.db.sql("SELECT * FROM `tabCPO Item Spec3` WHERE parent=%s", parent_name, as_dict=True)

#     return {
#         "item_spec1": item_spec1,
#         "item_spec2": item_spec2,
#         "item_spec3": item_spec3,
#     }

// Copyright (c) 2024, safdar211@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Customer PO', {
    refresh: function (frm) {
        frm.set_query('item_description', 'sku_detail', function (doc, cdt, cdn) {
            return {
                filters: [
                    ["Item", "item_group", "in", ["Garments"]]
                ]
            };
        });
        frm.set_query('product_type', 'sku_detail_home', function (doc, cdt, cdn) {
            return {
                filters: [
                    ["Item", "item_group", "in", ["Home Textile"]]
                ]
            };
        });
        fetch_photo(frm);
        calculate_totals(frm);

        frm.add_custom_button(__('Create Inspection Report'), function () {
            // Navigate to the "Inspection Report" form
            frappe.new_doc('Inspection Report');
        }, __('Actions'));



    },
    customer_name: function (frm) {
        frm.set_value('customer_name_abbrevation', getAbbreviation(frm.doc.customer_name));
    },
    validate: function (frm) {
        calculate_totals(frm); // Ensure totals are updated before saving
    }
});

frappe.ui.form.on('SKU Detail', {
    no_of_ctn: function (frm, cdt, cdn) {
        update_pcs_for_row(cdt, cdn);
        calculate_totals(frm);
    },
    no_of_doz: function (frm, cdt, cdn) {
        update_pcs_for_row(cdt, cdn);
        calculate_totals(frm);
    },
    pcs: function (frm) {
        calculate_totals(frm);
    }
})

frappe.ui.form.on('SKU Detail Home', {
    qty_pcs: function (frm) {
        calculate_totals_home(frm);
    },
    qty_ctn: function (frm) {
        calculate_totals_home(frm);
    }
});

function fetch_photo(frm) {
    if (frm.doc.customer_logo) {
        frappe.db.get_value('Customer PO', frm.doc.name, 'customer_logo', (r) => {
            if (r && r.customer_logo) {
                // Display the image using HTML in the HTML field
                frm.fields_dict['logo'].$wrapper.html(`<img style="padding:6px; border: 1px solid #bbbebf;border-radius: 5px;" src="${r.customer_logo}" width="150px">`);
            } else {
                // Clear the HTML field if no image is available
                frm.fields_dict['logo'].$wrapper.html('');
            }
        });
    } else {
        frm.fields_dict['logo'].$wrapper.html('');
    }

}

function getAbbreviation(inputString) {
    if (!inputString || typeof inputString !== 'string') {
        return '';
    }
    const words = inputString.trim().split(/\s+/);
    const abbreviation = words.map(word => word.charAt(0).toUpperCase()).join('');
    return abbreviation;
}

function calculate_totals(frm) {
    // Initialize totals
    let totalCtn = 0;
    let totalDozens = 0;
    let totalPcs = 0;
    // Iterate through the child table rows
    if (frm.doc.sku_detail) {
        frm.doc.sku_detail.forEach(row => {
            totalCtn += row.no_of_ctn || 0;
            totalDozens += row.no_of_doz || 0;
            totalPcs += row.pcs || 0;
        });
    }
    // Assign totals to the parent fields
    frm.set_value('total_ctn', totalCtn);
    frm.set_value('total_dozens', totalDozens);
    frm.set_value('total_pcs', totalPcs);
}

function calculate_totals_home(frm) {
    // Initialize totals
    let total_qty_ctn = 0;
    let total_qty_pcs = 0;
    let total_pcs = 0;
    total_pcs = frm.doc.total_pcs || 0;
    // Iterate through the child table rows
    if (frm.doc.sku_detail_home) {
        frm.doc.sku_detail_home.forEach(row => {
            total_qty_ctn += row.qty_ctn || 0;
            total_qty_pcs += row.qty_pcs || 0;
        });
    }
    // Assign totals to the parent fields
    frm.set_value('total_qty_ctn', total_qty_ctn);
    frm.set_value('total_qty_pcs', total_qty_pcs);
    frm.set_value('sum_pcs', total_qty_pcs + total_pcs);
}

// Function to update `pcs` for a specific row when `no_of_ctn` or `no_of_doz` changes
function update_pcs_for_row(cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row) {
        const pcs = (row.no_of_ctn || 0) * (row.no_of_doz || 0);
        frappe.model.set_value(cdt, cdn, 'pcs', pcs);
    }

}
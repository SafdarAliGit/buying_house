// Copyright (c) 2025, safdar211@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('PO Specs', {
    // refresh: function(frm) {

    // }
    po_specs_template: function (frm) {
        // Call the server-side function to fetch specifications
        frappe.call({
            method: 'buying_house.buying_house.doctype.util.get_specs_template',
            args: {
                parent_name: frm.doc.po_specs_template  // Field holding the parent name
            },
            callback: function (r) {
                if (r.message) {
                    // Clear the existing child table entries before adding new ones
                    frm.clear_table('pos_specs_item');

                    // Check if there are specifications to add

                    if (r.message.length > 0) {
                        r.message.forEach(spec => {
                            // Create a new row in the child table for each specification
                            let row = frm.add_child('po_specs_item', {
                                specification: spec.specification,
                                standard_value: spec.standard_value
                            });
                        });

                        // Refresh the child table to display new rows
                        frm.refresh_field('po_specs_item');
                    } else {
                        frappe.msgprint(__('No specifications found for the given parent name.'));
                    }
                } else {
                    frappe.msgprint(__('No specifications found for the given parent name.'));
                }
            },
            error: function (err) {
                // Handle errors during the server call
                frappe.msgprint(__('An error occurred while fetching specifications.'));
                console.error(err);
            }
        });
    }

});

frappe.ui.form.on('PO Specs Item', {
    required_value: function (frm, cdt, cdn) {
        calculate_diff(frm, cdt, cdn);
    }
});

function calculate_diff(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let diff = 0;
    let standard_value = row.standard_value;
    let required_value = row.required_value;
    diff = standard_value - required_value;
    frappe.model.set_value(cdt, cdn, 'diff', diff);
}
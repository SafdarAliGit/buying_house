// Copyright (c) 2024, safdar211@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Levels Master', {
    refresh: function (frm) {
        frm.fields_dict['inspection_levels'].get_query = function (doc) {
            return {
                filters: {
                    inspection_type: frm.doc.inspection_type // Filters employees by the selected department
                }
            };
        };

    },
    min_qty: function (frm) {
        if (frm.doc.min_qty == 2) {
            frm.set_value('max_qty', 8);
        } else if (frm.doc.min_qty == 9) {
            frm.set_value('max_qty', 15);
        } else if (frm.doc.min_qty == 16) {
            frm.set_value('max_qty', 25);
        } else if (frm.doc.min_qty == 26) {
            frm.set_value('max_qty', 50);
        } else if (frm.doc.min_qty == 51) {
            frm.set_value('max_qty', 90);
        } else if (frm.doc.min_qty == 91) {
            frm.set_value('max_qty', 150);
        } else if (frm.doc.min_qty == 151) {
            frm.set_value('max_qty', 280);
        } else if (frm.doc.min_qty == 281) {
            frm.set_value('max_qty', 500);
        } else if (frm.doc.min_qty == 501) {
            frm.set_value('max_qty', 1200);
        } else if (frm.doc.min_qty == 1201) {
            frm.set_value('max_qty', 3200);
        } else if (frm.doc.min_qty == 3201) {
            frm.set_value('max_qty', 10000);
        } else if (frm.doc.min_qty == 10001) {
            frm.set_value('max_qty', 35000);
        } else if (frm.doc.min_qty == 35001) {
            frm.set_value('max_qty', 150000);
        } else if (frm.doc.min_qty == 150001) {
            frm.set_value('max_qty', 500000);
        } else if (frm.doc.min_qty == 500001) {
            frm.set_value('max_qty', 50000000);
        }
    },



});

frappe.ui.form.on('Levels Master Items', {
    levels_master_items_add: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn); // Get the newly added child row
        if (frm.doc.qty) {
            row.qty = frm.doc.qty; // Copy qty from the master field
            frm.refresh_field('levels_master_items'); // Refresh the child table
        } else {
            frappe.throw("Enter Qty in master form");
        }
    }
});

// Copyright (c) 2025, safdar211@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('PO Specs', {
    // refresh: function(frm) {

    // }
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
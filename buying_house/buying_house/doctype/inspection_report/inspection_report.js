// Copyright (c) 2024, safdar211@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Inspection Report', {
    refresh: function (frm) {
        frm.add_custom_button('Upload Multiple Images', function () {
            new frappe.ui.FileUploader({
                method: 'buying_house.buying_house.doctype.util.capture',
                make_attachments_public: "False",
                dialog_title: "Inspection Report Images",
                disable_file_browser: "False",
                frm: frm,
                restrictions: {
                    allowed_file_types: [".png"]
                },
                on_success(file) {
                    let child = frm.add_child('inspection_upload');
                    child.image = file.file_url; // Ensure 'file_url' is the correct property
                    frm.refresh_field('inspection_upload');
                    frappe.msgprint(__('Successfully uploaded: {0}', [file.file_name]));
                }

            });
        });

        fetch_photo(frm);
    }, packed_in_carton: function (frm) {
        calculate_packed_in_carton_percent(frm);
    }, finished_not_packed: function (frm) {
        calculate_finished_not_packed_percent(frm);
    },
    not_finished: function (frm) {
        calculate_not_finished_percent(frm);
    },
    customer_po: function (frm) {
        fill_inspection_report_child(frm);
    }
});

function fetch_photo(frm) {
    if (frm.doc.customer_logo) {
        frappe.db.get_value('Inspection Report', frm.doc.name, 'customer_logo', (r) => {
            if (r && r.customer_logo) {
                // Display the image using HTML in the HTML field
                frm.fields_dict['logo'].$wrapper.html(`<img style="padding:6px; border: 1px solid #bbbebf;border-radius: 5px;margin-bottom: 92px;" src="${r.customer_logo}" width="150px">`);
            } else {
                // Clear the HTML field if no image is available
                frm.fields_dict['logo'].$wrapper.html('');
            }
        });
    } else {
        frm.fields_dict['logo'].$wrapper.html('');
    }

}

function packed_in_carton_percent(frm) {
    let packed_in_carton_percent = (frm.doc.packed_in_carton * 100) / total_pcs;
}

function calculate_packed_in_carton_percent(frm) {
    if (frm.doc.total_pcs && frm.doc.total_pcs > 0) {
        let packed_in_carton_percent = (frm.doc.packed_in_carton * 100) / frm.doc.total_pcs;
        frm.set_value('packed_in_carton_percent', packed_in_carton_percent); // Refresh the field to show updated value
    } else {
        frappe.msgprint(__('Please ensure "Total Pcs" is greater than zero.'));
    }
}

function calculate_finished_not_packed_percent(frm) {
    if (frm.doc.total_pcs && frm.doc.total_pcs > 0) {
        let finished_not_packed_percent = (frm.doc.finished_not_packed * 100) / frm.doc.total_pcs;
        frm.set_value('finished_not_packed_percent', finished_not_packed_percent); // Refresh the field to show updated value
    } else {
        frappe.msgprint(__('Please ensure "Total Pcs" is greater than zero.'));
    }
}

function calculate_not_finished_percent(frm) {
    if (frm.doc.total_pcs && frm.doc.total_pcs > 0) {
        let not_finished_percent = (frm.doc.not_finished * 100) / frm.doc.total_pcs;
        frm.set_value('not_finished_percent', not_finished_percent); // Refresh the field to show updated value
    } else {
        frappe.msgprint(__('Please ensure "Total Pcs" is greater than zero.'));
    }
}

function fill_inspection_report_child(frm) {
    frappe.call({
        method: 'buying_house.buying_house.doctype.util.get_sku_details', // Replace with the actual path
        args: {
            customer_po_name: frm.doc.customer_po // Pass the current document's name as the filter
        },
        callback: function (response) {
            if (response.message) {
                const data = response.message;

                // Clear existing rows in the child table
                frm.clear_table('inspection_report_item');

                // Add rows to the child table
                data.forEach(row => {
                    let child = frm.add_child('inspection_report_item');
                    child.sku = row.sku;
                    child.item_description = row.item_description;
                    child.size = row.size;
                });

                // Refresh the child table to display the new data
                frm.refresh_field('inspection_report_item');
            } else {
                frappe.msgprint(__('No SKU Details found for the given Customer PO.'));
            }
        }
    });
}


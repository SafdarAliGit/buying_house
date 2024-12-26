// Copyright (c) 2024, safdar211@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Inspection Report', {

    refresh: function (frm) {


        frm.fields_dict['inspection_levels'].get_query = function (doc) {
            return {
                filters: {
                    inspection_type: frm.doc.inspection_type // Filters employees by the selected department
                }
            };
        };

        fetch_photo(frm);
    },
    upload_multiple_images: function (frm) {
        // Prompt the user with a Select field for the upload label
        frappe.prompt(
            {
                fieldname: 'upload_label',
                fieldtype: 'Select',
                label: 'Select Upload Label',
                reqd: 1, // Make it required
                options: [
                    "Unlock",
                    "Carton Images",
                    "Packaging Images",
                    "Measurements",
                    "Print",
                    "Faults"
                ].join('\n') // Add options as newline-separated values
            },
            (values) => {
                // Store the upload_label value selected by the user
                let upload_label = values.upload_label;

                // Proceed with the file uploader
                new frappe.ui.FileUploader({
                    method: 'buying_house.buying_house.doctype.util.capture',
                    make_attachments_public: "False",
                    dialog_title: "Inspection Report Images",
                    disable_file_browser: "False",
                    frm: frm,
                    restrictions: {
                        allowed_file_types: [".png", ".jpg", ".jpeg", ".gif", ".bmp"]
                    },
                    on_success(file) {
                        // Add the file and same label to the child table
                        let child = frm.add_child('inspection_upload');
                        child.image = file.file_url; // Set file URL
                        child.upload_label = upload_label; // Set the same label for all rows
                        frm.refresh_field('inspection_upload'); // Refresh child table
                        frappe.msgprint(__('Successfully uploaded: {0}', [file.file_name]));
                    }
                });
            },
            __('Upload Label'),
            __('Done')
        );
    },

    packed_in_carton: function (frm) {
        calculate_packed_in_carton_percent(frm);
    }, finished_not_packed: function (frm) {
        calculate_finished_not_packed_percent(frm);
    },
    not_finished: function (frm) {
        calculate_not_finished_percent(frm);
    },
    customer_po: function (frm) {
        fill_inspection_report_child(frm);
    },
    aql_level: function (frm) {
        fetch_min_max_values(frm);
    },
    inspection_levels: function (frm) {
        fetch_min_max_values(frm);
    }
});

function fetch_photo(frm) {
    if (frm.doc.customer_logo) {
        frappe.db.get_value('Inspection Report', frm.doc.name, 'customer_logo', (r) => {
            if (r && r.customer_logo) {
                // Display the image using HTML in the HTML field
                frm.fields_dict['logo'].$wrapper.html(`<img style="padding:6px; border: 1px solid #bbbebf;border-radius: 5px;margin-bottom: 15px;" src="${r.customer_logo}" width="150px" height="200px">`);
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
    // Call the server-side method to get SKU details
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
                let total_no_of_ctn = 0;
                // Add rows to the child table
                data.forEach(row => {
                    let child = frm.add_child('inspection_report_item');
                    child.sku = row.sku;
                    child.item_description = row.item_description;
                    child.no_of_ctn = row.no_of_ctn || 0;
                    total_no_of_ctn += row.no_of_ctn || 0;// Default to 0 if undefined
                    child.no_of_doz = row.no_of_doz || 0; // Default to 0 if undefined
                    child.pcs = row.pcs || 0; // Default to 0 if undefined
                    child.s = row.s || 0; // Default to 0 if undefined
                    child.m = row.m || 0; // Default to 0 if undefined
                    child.l = row.l || 0; // Default to 0 if undefined
                    child.xl = row.xl || 0; // Default to 0 if undefined
                    child['2xl'] = row['2xl'] || 0; // Use bracket notation for keys starting with a number
                    child['3xl'] = row['3xl'] || 0;
                    child['4xl'] = row['4xl'] || 0;
                    child['5xl'] = row['5xl'] || 0;
                    child['6xl'] = row['6xl'] || 0;
                    child['7xl'] = row['7xl'] || 0;
                    child['8xl'] = row['8xl'] || 0;
                    child['9xl'] = row['9xl'] || 0;
                    child['10xl'] = row['10xl'] || 0;
                    child['11xl'] = row['11xl'] || 0;
                    child['12xl'] = row['12xl'] || 0;
                });

                // Refresh the child table to display the new data
                frm.refresh_field('inspection_report_item');
                frm.set_value("total_no_of_ctn", total_no_of_ctn);
            } else {
                frappe.msgprint(__('No SKU Details found for the given Customer PO.'));
            }
        },
        error: function (error) {
            frappe.msgprint(__('An error occurred while retrieving SKU details: ' + error.message));
        }
    });
}


function fetch_min_max_values(frm) {
    frappe.call({
        method: 'buying_house.buying_house.doctype.util.fetch_min_max_values', // Replace with the actual path
        args: {
            inspection_type: frm.doc.inspection_type,
            inspection_levels: frm.doc.inspection_levels,
            total_pcs: frm.doc.total_pcs,
            aql_level: frm.doc.aql_level,
        },
        callback: function (response) {
            if (response.message) {
                console.log(response.message);
                frm.set_value("aql_minor", response.message.min_value);
                frm.set_value("aql_major", response.message.max_value);
            } else {
                frappe.msgprint(__('No Data Found'));
            }
        }
    });
}


// Copyright (c) 2024, safdar211@gmail.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Inspection Report HT', {
    minor_fault: function(frm) {
        check_inspection_result(frm);
    },
    major_fault: function(frm) {
        check_inspection_result(frm);
    },

    after_save: function(frm) {
        highlight_negative_values(frm);
    },
    refresh: function (frm) {
        highlight_negative_values(frm);
        
        // frm.fields_dict['ir_item_spec1'].grid.wrapper.find('.btn-open-row').on('click', function() {
        //     setup_child_row_highlight(frm);
        // });
        
            
         // List of fieldnames to apply the same background color
         let fields = ['item', 'item2', 'item3', 'item4', 'item5'];

         fields.forEach(fieldname => {
             // Wait for the field to be rendered
             frm.fields_dict[fieldname].$wrapper
                 .find('input')
                 .css('background-color', '#006400'); // light green
         });
         
   

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
        // Prompt the user with a dialog for both select and open-ended input
        frappe.prompt(
            [
                {
                    fieldname: 'upload_label',
                    fieldtype: 'Select',
                    label: 'Select Upload Label',
                    reqd: 0, // Make it optional, priority will be given to the open-ended input
                    options: [
                        "Unlock",
                        "Carton Images",
                        "Packaging Images",
                        "Measurements",
                        "Print",
                        "Faults"
                    ].join('\n') // Add options as newline-separated values
                },
                {
                    fieldname: 'custom_upload_label',
                    fieldtype: 'Data',
                    label: 'Custom Upload Label',
                    reqd: 0 // Optional field for user to input their own label
                }
            ],
            (values) => {
                // Check if the custom_upload_label field has a value
                let upload_label = values.custom_upload_label || values.upload_label;

                if (!upload_label) {
                    frappe.msgprint(__('Please select or enter an upload label.'));
                    return;
                }

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
                        // Add the file and label to the child table
                        let child = frm.add_child('inspection_upload');
                        child.image = file.file_url; // Set file URL
                        child.upload_label = upload_label; // Set the label (custom or selected)
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

    item: function(frm) {
        if (frm.doc.item) {
            frappe.call({
                method: 'buying_house.buying_house.doctype.util.get_item_specification_details', // adjust to your method path
                args: {
                    item_code: frm.doc.item
                },
                callback: function(r) {
                    if (r.message) {
                        // Clear existing rows
                        frm.clear_table('ir_item_spec1');
                        frm.clear_table('ir_item_spec2');
                        frm.clear_table('ir_item_spec3');

                        // Populate cpo_item_spec1
                        r.message.item_spec1.forEach(row => {
                            let child = frm.add_child('ir_item_spec1');
                            child.spec_name = row.spec_name;
                            child.s = row.s;
                            child.m = row.m;
                            child.l = row.l;
                            child.xl = row.xl;
                            
                        });

                        // Populate cpo_item_spec2
                        r.message.item_spec2.forEach(row => {
                            let child = frm.add_child('ir_item_spec2');
                            child.spec_name = row.spec_name;
                            child['2xl'] = row['2xl'];
                            child['3xl'] = row['3xl'];
                            child['4xl'] = row['4xl'];
                            child['5xl'] = row['5xl'];
                            
                        });

                        // Populate cpo_item_spec3
                        r.message.item_spec3.forEach(row => {
                            let child = frm.add_child('ir_item_spec3');
                            child.spec_name = row.spec_name;
                            child['6xl'] = row['6xl'];
                            child['7xl'] = row['7xl'];
                            child['8xl'] = row['8xl'];
                            child['9xl'] = row['9xl'];
                            child['10xl'] = row['10xl'];
                        });

                        frm.refresh_field('ir_item_spec1');
                        frm.refresh_field('ir_item_spec2');
                        frm.refresh_field('ir_item_spec3');
                    }
                }
            });
        }
    },
    item2: function(frm) {
        if (frm.doc.item) {
            frappe.call({
                method: 'buying_house.buying_house.doctype.util.get_item_specification_details2', // adjust to your method path
                args: {
                    item_code: frm.doc.item2
                },
                callback: function(r) {
                    if (r.message) {
                        // Clear existing rows
                        frm.clear_table('ir_item_spec11');
                        frm.clear_table('ir_item_spec22');
                        frm.clear_table('ir_item_spec33');

                        // Populate cpo_item_spec1
                        r.message.item_spec1.forEach(row => {
                            let child = frm.add_child('ir_item_spec11');
                            child.spec_name = row.spec_name;
                            child.s = row.s;
                            child.m = row.m;
                            child.l = row.l;
                            child.xl = row.xl;
                            
                        });

                        // Populate cpo_item_spec2
                        r.message.item_spec2.forEach(row => {
                            let child = frm.add_child('ir_item_spec22');
                            child.spec_name = row.spec_name;
                            child['2xl'] = row['2xl'];
                            child['3xl'] = row['3xl'];
                            child['4xl'] = row['4xl'];
                            child['5xl'] = row['5xl'];
                            
                        });

                        // Populate cpo_item_spec3
                        r.message.item_spec3.forEach(row => {
                            let child = frm.add_child('ir_item_spec33');
                            child.spec_name = row.spec_name;
                            child['6xl'] = row['6xl'];
                            child['7xl'] = row['7xl'];
                            child['8xl'] = row['8xl'];
                            child['9xl'] = row['9xl'];
                            child['10xl'] = row['10xl'];
                        });

                        frm.refresh_field('ir_item_spec11');
                        frm.refresh_field('ir_item_spec22');
                        frm.refresh_field('ir_item_spec33');
                    }
                }
            });
        }
    },
    item3: function(frm) {
        if (frm.doc.item) {
            frappe.call({
                method: 'buying_house.buying_house.doctype.util.get_item_specification_details3', // adjust to your method path
                args: {
                    item_code: frm.doc.item3
                },
                callback: function(r) {
                    if (r.message) {
                        // Clear existing rows
                        frm.clear_table('ir_item_spec111');
                        frm.clear_table('ir_item_spec222');
                        frm.clear_table('ir_item_spec333');

                        // Populate cpo_item_spec1
                        r.message.item_spec1.forEach(row => {
                            let child = frm.add_child('ir_item_spec111');
                            child.spec_name = row.spec_name;
                            child.s = row.s;
                            child.m = row.m;
                            child.l = row.l;
                            child.xl = row.xl;
                            
                        });

                        // Populate cpo_item_spec2
                        r.message.item_spec2.forEach(row => {
                            let child = frm.add_child('ir_item_spec222');
                            child.spec_name = row.spec_name;
                            child['2xl'] = row['2xl'];
                            child['3xl'] = row['3xl'];
                            child['4xl'] = row['4xl'];
                            child['5xl'] = row['5xl'];
                            
                        });

                        // Populate cpo_item_spec3
                        r.message.item_spec3.forEach(row => {
                            let child = frm.add_child('ir_item_spec333');
                            child.spec_name = row.spec_name;
                            child['6xl'] = row['6xl'];
                            child['7xl'] = row['7xl'];
                            child['8xl'] = row['8xl'];
                            child['9xl'] = row['9xl'];
                            child['10xl'] = row['10xl'];
                        });

                        frm.refresh_field('ir_item_spec111');
                        frm.refresh_field('ir_item_spec222');
                        frm.refresh_field('ir_item_spec333');
                    }
                }
            });
        }
    },
    item4: function(frm) {
        if (frm.doc.item) {
            frappe.call({
                method: 'buying_house.buying_house.doctype.util.get_item_specification_details4', // adjust to your method path
                args: {
                    item_code: frm.doc.item4
                },
                callback: function(r) {
                    if (r.message) {
                        // Clear existing rows
                        frm.clear_table('ir_item_spec1111');
                        frm.clear_table('ir_item_spec2222');
                        frm.clear_table('ir_item_spec3333');

                        // Populate cpo_item_spec1
                        r.message.item_spec1.forEach(row => {
                            let child = frm.add_child('ir_item_spec1111');
                            child.spec_name = row.spec_name;
                            child.s = row.s;
                            child.m = row.m;
                            child.l = row.l;
                            child.xl = row.xl;
                            
                        });

                        // Populate cpo_item_spec2
                        r.message.item_spec2.forEach(row => {
                            let child = frm.add_child('ir_item_spec2222');
                            child.spec_name = row.spec_name;
                            child['2xl'] = row['2xl'];
                            child['3xl'] = row['3xl'];
                            child['4xl'] = row['4xl'];
                            child['5xl'] = row['5xl'];
                            
                        });

                        // Populate cpo_item_spec3
                        r.message.item_spec3.forEach(row => {
                            let child = frm.add_child('ir_item_spec3333');
                            child.spec_name = row.spec_name;
                            child['6xl'] = row['6xl'];
                            child['7xl'] = row['7xl'];
                            child['8xl'] = row['8xl'];
                            child['9xl'] = row['9xl'];
                            child['10xl'] = row['10xl'];
                        });

                        frm.refresh_field('ir_item_spec1111');
                        frm.refresh_field('ir_item_spec2222');
                        frm.refresh_field('ir_item_spec3333');
                    }
                }
            });
        }
    },
    item5: function(frm) {
        if (frm.doc.item) {
            frappe.call({
                method: 'buying_house.buying_house.doctype.util.get_item_specification_details5', // adjust to your method path
                args: {
                    item_code: frm.doc.item5
                },
                callback: function(r) {
                    if (r.message) {
                        // Clear existing rows
                        frm.clear_table('ir_item_spec11111');
                        frm.clear_table('ir_item_spec22222');
                        frm.clear_table('ir_item_spec33333');

                        // Populate cpo_item_spec1
                        r.message.item_spec1.forEach(row => {
                            let child = frm.add_child('ir_item_spec11111');
                            child.spec_name = row.spec_name;
                            child.s = row.s;
                            child.m = row.m;
                            child.l = row.l;
                            child.xl = row.xl;
                            
                        });

                        // Populate cpo_item_spec2
                        r.message.item_spec2.forEach(row => {
                            let child = frm.add_child('ir_item_spec22222');
                            child.spec_name = row.spec_name;
                            child['2xl'] = row['2xl'];
                            child['3xl'] = row['3xl'];
                            child['4xl'] = row['4xl'];
                            child['5xl'] = row['5xl'];
                            
                        });

                        // Populate cpo_item_spec3
                        r.message.item_spec3.forEach(row => {
                            let child = frm.add_child('ir_item_spec33333');
                            child.spec_name = row.spec_name;
                            child['6xl'] = row['6xl'];
                            child['7xl'] = row['7xl'];
                            child['8xl'] = row['8xl'];
                            child['9xl'] = row['9xl'];
                            child['10xl'] = row['10xl'];
                        });

                        frm.refresh_field('ir_item_spec11111');
                        frm.refresh_field('ir_item_spec22222');
                        frm.refresh_field('ir_item_spec33333');
                    }
                }
            });
        }
    },

    customer_po: function (frm) {
        fill_inspection_report_child(frm);
        // if (frm.doc.customer_po) {
        //     frappe.call({
        //         method: 'buying_house.buying_house.doctype.util.get_item_specification_details_for_inspection_report', // adjust to your method path
        //         args: {
        //             customer_po: frm.doc.customer_po
        //         },
        //         callback: function(r) {
        //             if (r.message) {
        //                 // Clear existing rows
        //                 frm.clear_table('ir_item_spec1');
        //                 frm.clear_table('ir_item_spec2');
        //                 frm.clear_table('ir_item_spec3');

        //                 // Populate cpo_item_spec1
        //                 r.message.item_spec1.forEach(row => {
        //                     let child = frm.add_child('ir_item_spec1');
        //                     Object.assign(child, row); // or manually set fields
        //                 });

        //                 // Populate cpo_item_spec2
        //                 r.message.item_spec2.forEach(row => {
        //                     let child = frm.add_child('ir_item_spec2');
        //                     Object.assign(child, row);
        //                 });

        //                 // Populate cpo_item_spec3
        //                 r.message.item_spec3.forEach(row => {
        //                     let child = frm.add_child('ir_item_spec3');
        //                     Object.assign(child, row);
        //                 });

        //                 frm.refresh_field('ir_item_spec1');
        //                 frm.refresh_field('ir_item_spec2');
        //                 frm.refresh_field('ir_item_spec3');
        //             }
        //         }
        //     });
        // }
    },

    aql_level: function (frm) {
        fetch_min_1_values(frm);
    },
    aql_level_minor: function (frm) {
        fetch_min_2_values(frm);
    },
    inspection_levels: function (frm) {
        fetch_min_1_values(frm);
        fetch_min_2_values(frm);
    }
});

frappe.ui.form.on('IR Item Spec1', {
   
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
                let total_no_of_ctn = 0;
                let total_pcs = 0;
                let total_qty_ctn = 0;
                let total_qty_pcs = 0;
                const sku_detail = response.message.sku_detail;
                // Clear existing rows in the child table
                if (sku_detail) {
                    frm.clear_table('inspection_report_item');
                    // Add rows to the child table
                    sku_detail.forEach(row => {
                        let child = frm.add_child('inspection_report_item');
                        child.sku = row.sku;
                        child.item_description = row.item_description;
                        child.no_of_ctn = row.no_of_ctn || 0;
                        total_no_of_ctn += row.no_of_ctn || 0;// Default to 0 if undefined
                        child.no_of_doz = row.no_of_doz || 0; // Default to 0 if undefined
                        child.pcs = row.pcs || 0;
                        total_pcs += row.pcs || 0;// Default to 0 if undefined
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
                    frm.set_value("total_pcs", total_pcs);
                }

                const sku_detail_home_item = response.message.sku_detail_home_item;
                if (sku_detail_home_item) {
                    frm.clear_table('sku_detail_home_item');
                    // Add rows to the child table
                    sku_detail_home_item.forEach(row => {
                        let child = frm.add_child('sku_detail_home_item');
                        child.sku = row.sku;
                        child.product_type = row.product_type;
                        child.size = row.size;
                        child.qty_ctn = row.qty_ctn || 0;
                        total_qty_ctn += row.qty_ctn || 0;
                        child.qty_pcs = row.qty_pcs || 0;
                        total_qty_pcs += row.qty_pcs || 0;
                    });

                    // Refresh the child table to display the new data
                    frm.refresh_field('sku_detail_home_item');
                    frm.set_value("total_qty_ctn", total_qty_ctn);
                    frm.set_value("total_qty_pcs", total_qty_pcs);
                    frm.set_value("sum_pcs", total_qty_pcs + total_pcs);
                }

            } else {
                frappe.msgprint(__('No SKU Details found for the given Customer PO.'));
            }
        },
        error: function (error) {
            frappe.msgprint(__('An error occurred while retrieving SKU details: ' + error.message));
        }
    });
}


function fetch_min_1_values(frm) {
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
                frm.set_value("aql_minor", response.message.min_value);
                frm.set_value("sample_size", response.message.qty);
            } else {
                frappe.msgprint(__('No Data Found'));
            }
        }
    });
}

function fetch_min_2_values(frm) {
    frappe.call({
        method: 'buying_house.buying_house.doctype.util.fetch_min_max_values', // Replace with the actual path
        args: {
            inspection_type: frm.doc.inspection_type,
            inspection_levels: frm.doc.inspection_levels,
            total_pcs: frm.doc.total_pcs,
            aql_level: frm.doc.aql_level_minor,
        },
        callback: function (response) {
            if (response.message) {
                frm.set_value("aql_minor_pcs", response.message.min_value);
                frm.set_value("sample_size", response.message.qty);
            } else {
                frappe.msgprint(__('No Data Found'));
            }
        }
    });
}

frappe.ui.form.on('Inspection Report Item', {
    pcs: function (frm, cdt, cdn) {
        calculate_total_pcs(frm);
    },
    inspection_report_item_remove: function (frm, cdt, cdn) {
        calculate_total_pcs(frm);
        calculate_total_no_of_ctn(frm);
    },
    no_of_ctn: function (frm, cdt, cdn) {
        calculate_total_no_of_ctn(frm);
    }
});


frappe.ui.form.on('SKU Detail Home Item', {
    qty_pcs: function (frm) {
        calculate_totals_home_item(frm);
    },
    qty_ctn: function (frm) {
        calculate_totals_home_item(frm);
    }
});

function calculate_total_pcs(frm) {
    var total_pcs = 0;
    $.each(frm.doc.inspection_report_item || [], function (i, d) {
        total_pcs += flt(d.pcs);
    });
    frm.set_value("total_pcs", total_pcs);
}

function calculate_total_no_of_ctn(frm) {
    var total_no_of_ctn = 0;
    $.each(frm.doc.inspection_report_item || [], function (i, d) {
        total_no_of_ctn += flt(d.no_of_ctn);
    });
    frm.set_value("total_no_of_ctn", total_no_of_ctn);
}

function calculate_totals_home_item(frm) {
    // Initialize totals
    let total_qty_ctn = 0;
    let total_qty_pcs = 0;
    let total_pcs = 0;
    total_pcs = frm.doc.total_pcs || 0;
    // Iterate through the child table rows
    if (frm.doc.sku_detail_home_item) {
        frm.doc.sku_detail_home_item.forEach(row => {
            total_qty_ctn += row.qty_ctn || 0;
            total_qty_pcs += row.qty_pcs || 0;
        });
    }
    // Assign totals to the parent fields
    frm.set_value('total_qty_ctn', total_qty_ctn);
    frm.set_value('total_qty_pcs', total_qty_pcs);
    frm.set_value('sum_pcs', total_qty_pcs + total_pcs);
}

function highlight_negative_values(frm) {
    frm.fields_dict['ir_item_spec1'].grid.wrapper.find('.grid-row').each(function() {
        let $row = $(this);
        $row.find('[data-fieldname]').each(function() {
            let $field = $(this);
            let value = $field.text().trim();
            if (value.startsWith('-')) {
                $field.css('color', 'red');
            } else {
                $field.css('color', '');
            }
        });
    });
}



function check_inspection_result(frm) {
    let minor_fault = frm.doc.minor_fault || 0;
    let major_fault = frm.doc.major_fault || 0;
    let aql_level_minor = frm.doc.aql_level_minor || 0;
    let aql_level = frm.doc.aql_level || 0;

    // If either fault exceeds its respective AQL level, set Fail
    if (minor_fault > aql_level_minor || major_fault > aql_level) {
        frm.set_value('inpection_report', 'Fail');
    } else {
        frm.set_value('inpection_report', 'Pass');
    }
}

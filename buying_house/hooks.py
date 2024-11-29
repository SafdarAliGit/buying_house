# from apps.healthcare.healthcare.hooks import required_apps
from . import __version__ as app_version

app_name = "buying_house"
app_title = "Buying House"
app_publisher = "safdar211@gmail.com"
app_description = "Buying House"
app_email = "safdar211@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/buying_house/css/buying_house.css"
# app_include_js = "/assets/buying_house/js/buying_house.js"

# include js, css files in header of web template
# web_include_css = "/assets/buying_house/css/buying_house.css"
# web_include_js = "/assets/buying_house/js/buying_house.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "buying_house/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "buying_house.utils.jinja_methods",
#	"filters": "buying_house.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "buying_house.install.before_install"
# after_install = "buying_house.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "buying_house.uninstall.before_uninstall"
# after_uninstall = "buying_house.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "buying_house.utils.before_app_install"
# after_app_install = "buying_house.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "buying_house.utils.before_app_uninstall"
# after_app_uninstall = "buying_house.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "buying_house.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"buying_house.tasks.all"
#	],
#	"daily": [
#		"buying_house.tasks.daily"
#	],
#	"hourly": [
#		"buying_house.tasks.hourly"
#	],
#	"weekly": [
#		"buying_house.tasks.weekly"
#	],
#	"monthly": [
#		"buying_house.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "buying_house.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "buying_house.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "buying_house.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["buying_house.utils.before_request"]
# after_request = ["buying_house.utils.after_request"]

# Job Events
# ----------
# before_job = ["buying_house.utils.before_job"]
# after_job = ["buying_house.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"buying_house.auth.validate"
# ]


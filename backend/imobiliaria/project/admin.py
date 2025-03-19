from django.contrib import admin
from django.apps import apps
from django.contrib.admin.sites import AlreadyRegistered

# Customize the admin site header
admin.site.site_header = "Imobiliária Admin Panel"
admin.site.site_title = "Imobiliária Admin"
admin.site.index_title = "Welcome to Imobiliária Admin Panel"

# Register all models dynamically
models = apps.get_models()
for model in models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass  # Skip models that are already registered

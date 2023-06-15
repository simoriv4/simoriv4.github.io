from django.contrib import admin

from pipeman.models import Repository, Settings

# Register your models here.
class RepositoryAdmin(admin.ModelAdmin):
    list_display = ["gitlab_pid", "project_name", "is_manual"]
    filter_horizontal = ["parents"]

admin.site.register(Repository, RepositoryAdmin)

class SettingsAdmin(admin.ModelAdmin):
    list_display =["gitlab_host", "gitlab_token"]

admin.site.register( Settings, SettingsAdmin)

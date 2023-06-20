from django import forms

from pipeman.models import Repository


class RepositoryForm(forms.ModelForm):
    class Meta:
        model = Repository
        fields = ["gitlab_pid", "project_name", "is_manual"]

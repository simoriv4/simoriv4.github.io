from pipeman.models import Settings
from django.core.management.base import BaseCommand, CommandParser
import gitlab

from pipeman.getdependencystatus import getDependecyStatus


class Command(BaseCommand):
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("--project", "-p", default=None, required=False)

    def handle(self, *args, **kwargs):  # restituisce l'id di dell'ultimo nodo
        settings = Settings.objects.first()
        gl = gitlab.Gitlab(
            url=settings.gitlab_host, private_token=settings.gitlab_token
        )
        getDependecyStatus(gl, kwargs["project"])

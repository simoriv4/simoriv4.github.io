import json
from rest_framework import routers, viewsets, status
from rest_framework.response import Response
from pipeman.api.serializers import RepositorySerializer
from pipeman.models import Repository
1
class RepositoryViewSet(viewsets.ModelViewSet):
    serializer_class = RepositorySerializer
    queryset = Repository.objects.all()
    lookup_field = "gitlab_pid"

    def partial_update(self, request, *args, **kwargs):
        object= self.get_object()
        parents = dict(request.data)["parents"]
        object.parents.clear()
        for parent in parents:
            if parent == object.gitlab_pid:
                serialized_object = self.serializer_class(object)
                return Response(data=serialized_object.data, status=status.HTTP_406_NOT_ACCEPTABLE)

            repo, created = Repository.objects.get_or_create(gitlab_pid = parent)
            object.parents.add(repo)

        object.save()

        serialized_object = self.serializer_class(object)
        return Response(data=serialized_object.data, status=status.HTTP_200_OK)

router = routers.DefaultRouter()

router.register(r"repositories", RepositoryViewSet, "repositories_view_set")

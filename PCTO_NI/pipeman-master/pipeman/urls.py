from django.urls import path, include
from pipeman.api.api import router
from .import views

app_name = "pipeman"

urlpatterns = [
    path("", views.indexView.as_view(), name="indexView"),
    path("gitlab-repositories/", views.allRepoView.as_view(), name="allRepoView"),
    path("gitlab-repositories/<repo_id>/edit/", views.editView.as_view(), name="editView"),
    path("graph/<repo_id>/", views.graphView.as_view(), name="graphView"),
    path("repositories-status/<repo_id>", views.getRepoList.as_view(), name="getRepoList"),
    path('api-v1/', include(router.urls)),
]

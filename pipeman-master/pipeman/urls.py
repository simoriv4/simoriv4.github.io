from django.urls import path, re_path, include
from pipeman.api.api import router
from .import views

app_name = "pipeman"

urlpatterns = [
    path("", views.indexView.as_view(), name="indexView"),
    re_path(r"graph/(?P<repo_id>\d+)/$", views.graphView.as_view(), name="graphView"),
    path("repositories-status/<repo_id>", views.getRepoList.as_view(), name="getRepoList"),
    path('api-v1/', include(router.urls)),
]

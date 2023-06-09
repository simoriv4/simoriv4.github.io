from django.db.models.query import QuerySet
from pipeman.models import Repository, Settings
from django.shortcuts import get_object_or_404
from django.views import generic
from django.http import HttpResponseBadRequest, JsonResponse
import gitlab
from pipeman.getdependencystatus import getDependecyStatus

settings = Settings.objects.first()
gl = gitlab.Gitlab(url = settings.gitlab_host, private_token = settings.gitlab_token)

class indexView(generic.ListView):
    template_name = "pipeman/index.html"
    model=Repository
    context_object_name='repositories'

    def get_queryset(self):
        return Repository.objects.filter(is_manual = True)

class graphView(generic.DetailView):
    template_name = "pipeman/graph.html"
    context_object_name='repository'

    def get_object(self):
        return get_object_or_404(Repository, gitlab_pid=self.kwargs['repo_id'])
    
class getRepoList(generic.ListView):
    def get(self, request, repo_id):
        try:
            all_projects = getDependecyStatus(gl, int(repo_id))
            dict_projects = []
            for proj in all_projects:
                obj = {
                    "project_name":proj.project_name,
                    "gitlab_pid":proj.gitlab_pid,
                    "status":proj.status,
                    "error_mex":proj.error_mex,
                    "parents":list(proj.parents.values_list("gitlab_pid"))
                }
                dict_projects.append(obj)
            return JsonResponse(dict_projects, safe=False)
        except Exception as e:
            return HttpResponseBadRequest()
 
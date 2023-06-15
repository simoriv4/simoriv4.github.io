from django.db.models.query import QuerySet
from django.urls import reverse
import requests
from pipeman.forms import RepositoryForm
from pipeman.models import Repository, Settings
from django.shortcuts import get_object_or_404
from django.views import generic
from django.http import HttpResponseBadRequest, JsonResponse
import gitlab
from pipeman.getdependencystatus import getDependecyStatus
from rest_framework import status
from rest_framework.response import Response


settings = Settings.objects.first()
if settings is not None:
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


class editView(generic.UpdateView):
    template_name = "pipeman/edit.html"
    form_class = RepositoryForm

    def get_object(self):
        return get_object_or_404(Repository, gitlab_pid=self.kwargs['repo_id'])
    
    def get_success_url(self):
        return reverse("pipeman:allRepoView")


class allRepoView(generic.ListView):
    template_name = "pipeman/gitlab_repositories.html"
    model=Repository
    context_object_name='repositories'
    
class getRepoList(generic.ListView):
    def get(self, request, repo_id):
        try:
            all_projects = getDependecyStatus(gl, int(repo_id))
            dict_projects = []
            #controllo se le repositories esitono
            # request = requests.get("http://127.0.0.1:8000/repositories-status/")
            # if request.status_code == 404:
            if len(all_projects) > 0 and type(all_projects[0]) == str: # se il primo elemento è una stringa significa che almeno una repo non esiste su gitlab
                dict_projects.append(all_projects[0])
                obj = {
                    "project_name":all_projects[1].project_name,
                    "gitlab_pid":all_projects[1].gitlab_pid,
                }
                dict_projects.append(obj)
                return JsonResponse(dict_projects, safe=False)

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
 
from django.db.models.query import QuerySet
from django.urls import reverse
import requests
from pipeman.forms import RepositoryForm
from pipeman.models import Repository, Settings
from django.shortcuts import get_object_or_404
from django.views import generic
from django.http import HttpResponseBadRequest, JsonResponse
import gitlab
from pipeman.getdependencystatus import find_tags_sort, getDependecyStatus, getDescendants
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin


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

class detailsView(generic.DetailView):
    template_name = "pipeman/details.html"
    context_object_name='repository'

    def get_object(self):
        return get_object_or_404(Repository, gitlab_pid=self.kwargs['repo_id'])

class getRepoView(generic.ListView):
    def get(self, request, repo_id):
        try:
            all_projects = getDependecyStatus(gl, int(repo_id))
            repo = None
            for proj in all_projects:
                if proj.gitlab_pid == int(repo_id):
                    repo = proj

            dict_projects = []
            defaul_branch_last_commit = {
                "commit_id": repo.defaul_branch_last_commit["id"],
                "title":repo.defaul_branch_last_commit["title"],
                "committed_date":repo.defaul_branch_last_commit["committed_date"],
                "author_name":repo.defaul_branch_last_commit["author_name"],
                "author_email":repo.defaul_branch_last_commit["author_email"],
                "web_url":repo.defaul_branch_last_commit["web_url"]
            }
            last_tag_commit = {
                "commit_id": repo.last_tag_commit["id"],
                "title":repo.last_tag_commit["title"],
                "committed_date":repo.last_tag_commit["committed_date"],
                "author_name":repo.last_tag_commit["author_name"],
                "author_email":repo.last_tag_commit["author_email"],
                "web_url":repo.last_tag_commit["web_url"]
            }
#            last_tag_commit = f"commit_id: {repo.last_tag_commit["id"]},\ntitle:{repo.last_tag_commit["title"]},\ncommitted_date:{repo.last_tag_commit["committed_date"]},\nauthor_name:{repo.last_tag_commit["author_name"]},\nauthor_email:{repo.last_tag_commit["author_email"]},\nweb_url:{repo.last_tag_commit["web_url"]}
            children = getDescendants(repo.gitlab_pid)
            leaf_children = []
            for child in children:
                if len(child.getChild) == 0:
                    leaf_children.append({
                        "project_name":child.project_name,
                        "gitlab_pid":child.gitlab_pid
                    })

            obj = {
                "project_name":repo.project_name,
                "gitlab_pid":repo.gitlab_pid,
                "status":repo.status,
                "error_mex":repo.error_mex,
                "parents":list(repo.parents.values_list("gitlab_pid")),
                "leaf_children": leaf_children,
                "defaul_branch_last_commit":defaul_branch_last_commit,
                "last_tag_commit":last_tag_commit
            }
            dict_projects.append(obj)
            return JsonResponse(dict_projects, safe=False)
        except Exception as e:
            return HttpResponseBadRequest()
    
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
                defaul_branch_last_commit = {
                    "commit_id": proj.defaul_branch_last_commit["id"],
                    "title":proj.defaul_branch_last_commit["title"],
                    "committed_date":proj.defaul_branch_last_commit["committed_date"],
                    "author_name":proj.defaul_branch_last_commit["author_name"],
                    "author_email":proj.defaul_branch_last_commit["author_email"],
                    "web_url":proj.defaul_branch_last_commit["web_url"]
                }
                last_tag_commit = {
                    "commit_id": proj.last_tag_commit["id"],
                    "title":proj.last_tag_commit["title"],
                    "committed_date":proj.last_tag_commit["committed_date"],
                    "author_name":proj.last_tag_commit["author_name"],
                    "author_email":proj.last_tag_commit["author_email"],
                    "web_url":proj.last_tag_commit["web_url"]
                }
                obj = {
                    "project_name":proj.project_name,
                    "gitlab_pid":proj.gitlab_pid,
                    "status":proj.status,
                    "error_mex":proj.error_mex,
                    "parents":list(proj.parents.values_list("gitlab_pid")),
                    "defaul_branch_last_commit":defaul_branch_last_commit,
                    "last_tag_commit":last_tag_commit
                }
                dict_projects.append(obj)
            return JsonResponse(dict_projects, safe=False)
        except Exception as e:
            return HttpResponseBadRequest()
 
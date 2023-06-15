from django.test import TestCase
from pipeman.getdependencystatus import setGray
from pipeman.models import Repository
from pipeman.tests.seed_db import seed_db

class SetGrayTest(TestCase):

    def setUp(selg):
        seed_db()

    def test_gary(self):
        projects_red = [Repository.objects.get(gitlab_pid = 8)]
        all_projects = [Repository.objects.get(gitlab_pid = 1), Repository.objects.get( gitlab_pid = 2), Repository.objects.get(gitlab_pid = 3),Repository.objects.get(gitlab_pid = 4), Repository.objects.get(gitlab_pid = 5), Repository.objects.get(gitlab_pid = 6), Repository.objects.get(gitlab_pid = 7), Repository.objects.get(gitlab_pid = 8)]

        all_projects = setGray(all_projects, projects_red)
        for project in all_projects:
            if project.project_name == "Repository7" or project.project_name == "Repository3" or project.project_name == "Repository2" or project.project_name == "Repository1":
                self.assertEqual(project.status, "gray")
    
    def test_no_project_red(self):
        all_projects = [Repository.objects.get(gitlab_pid = 1), Repository.objects.get( gitlab_pid = 2), Repository.objects.get(gitlab_pid = 3),Repository.objects.get(gitlab_pid = 4), Repository.objects.get(gitlab_pid = 5), Repository.objects.get(gitlab_pid = 6), Repository.objects.get(gitlab_pid = 7), Repository.objects.get(gitlab_pid = 8)]
        projects_red = []
        for project in all_projects:
            project.status =  ""

        all_projects = setGray(all_projects, projects_red)

        for project in all_projects:
            self.assertNotEqual(project.status, "gray")


    
        


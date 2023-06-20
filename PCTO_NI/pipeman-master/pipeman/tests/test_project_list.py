from django.test import TestCase
from pipeman.getdependencystatus import getListParents
from pipeman.models import Repository
from pipeman.tests.seed_db import seed_db


class ProjectListTest(TestCase):
    def setUp(selg):
        seed_db()

    def test_list_parents(self):
        repos, count = getListParents(1)
        self.assertEqual(len(repos), 8)
        i = 1
        for repo in repos:
            repo = Repository.objects.get(gitlab_pid=i)
            self.assertIn(repo, repos)
            i += 1

    def test_list_parents_error(self):
        repo9 = Repository(gitlab_pid=9, project_name="Repository9")
        repo9.save()
        repo7 = Repository.objects.get(gitlab_pid=7)
        repo9.parents.add(repo7)

        repos, count = getListParents(1)
        self.assertEqual(len(repos), 8)

    def test_inexistent_repo(self):
        repos, count = getListParents(12345)
        self.assertEqual(
            len(repos), count, 0
        )  # non è stata mai richiamata la funzione repeat--> l'id non esiste

    def test_error_duplicate(self):
        repos, count = getListParents(1)
        for repo in repos:
            i = 0
            for repo_2 in repos:
                if repo == repo_2:
                    i += 1

            self.assertEqual(i, 1)

    def test_max_chiamate(self):
        repo9 = Repository(gitlab_pid=9, project_name="Repository9")
        repo9.save()
        repo7 = Repository.objects.get(gitlab_pid=7)
        repo7.parents.add(repo9)
        repo7.parents.add(repo7)
        repo9.save()

        repos, count = getListParents(1)
        self.assertEqual(count, 50)

    def test_child_without_parent(self):
        repos, count = getListParents(8)  # ultimo child--> senza padri
        self.assertEqual(len(repos), 1)

    # def test_children(self):
    #     repos, count = getListParents(1)
    #     for repo in repos:

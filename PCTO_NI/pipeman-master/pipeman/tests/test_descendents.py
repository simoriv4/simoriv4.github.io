from django.test import TestCase
from pipeman.getdependencystatus import getDescendants
from pipeman.models import Repository
from pipeman.tests.seed_db import seed_db


class ProjectDescendants(TestCase):
    def setUp(selg):
        seed_db()

    def test_descendants_length(self):
        descendants = getDescendants(5)
        self.assertEqual(len(descendants), 4)

    def test_invalid_project(self):
        descendents = getDescendants(11111)
        self.assertEqual(descendents, None)

    def test_descendants(self):
        descendants = getDescendants(8)
        descendant7 = Repository.objects.get(gitlab_pid=7)
        descendant3 = Repository.objects.get(gitlab_pid=3)
        descendant2 = Repository.objects.get(gitlab_pid=2)
        descendant1 = Repository.objects.get(gitlab_pid=1)

        self.assertEqual(len(descendants), 4)
        self.assertIn(descendant7, descendants)
        self.assertIn(descendant3, descendants)
        self.assertIn(descendant2, descendants)
        self.assertIn(descendant1, descendants)

    def test_project_without_descendants(self):
        descendants = getDescendants(1)
        self.assertEqual(len(descendants), 0)

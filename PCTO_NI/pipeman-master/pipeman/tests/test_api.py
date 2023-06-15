from django.test import TestCase
from pipeman.api.api import RepositoryViewSet
from pipeman.models import Repository
from pipeman.tests.seed_db import seed_db
from rest_framework.test import APIRequestFactory


class TestPartialUpdate(TestCase):
    def setUp(self):
        seed_db()
        
    def test_partial_update(self):
        request_body = {
            "parents":[
                4,
                1
            ]
        }
        not_exist = False
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/3/", data=request_body)
        response = view(request, gitlab_pid=3)
        self.assertEqual(len(request_body["parents"]), len(response.data["parents"]))
        for parent in response.data["parents"]:
            self.assertIn(parent, request_body["parents"])
            try:
                repo = Repository.objects.get(gitlab_pid = parent)
            except Exception:
                not_exist = True

        self.assertFalse(not_exist)

        

    def test_project_not_exist(self):
        request_body = {
            "parents":[
                4,
                1
            ]
        }
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/12345/", data=request_body)
        response = view(request, gitlab_pid=12345)
        self.assertEqual(response.status_code, 404)

    def test_parent_not_exist(self):
        request_body = {
            'parents': [
                7,
                1234
            ]
        }
        not_exist = False
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/3/", data=request_body)
        response = view(request, gitlab_pid=3)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(request_body["parents"]), len(response.data["parents"]))
        for parent in response.data["parents"]:
            self.assertIn(parent, request_body["parents"])
            try:
                repo = Repository.objects.get(gitlab_pid = parent)
            except Exception:
                not_exist = True

        self.assertFalse(not_exist)
            
    
    def test_no_parents(self):
        request_body = {
            'parents': [
            ]
        }
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/3/", data=request_body)
        response = view(request, gitlab_pid=3)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(request_body["parents"]), len(response.data["parents"]))
        self.assertEqual(len(response.data["parents"]),0)

    def test_no_parents(self):
        request_body = {
            'parents': [
                4,
                6
            ]
        }
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/99932131/", data=request_body)
        response = view(request, gitlab_pid=99932131)
        self.assertEqual(response.status_code, 404)

    def test_same_parents(self):
        request_body = {
            'parents': [
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                6
            ]
        }
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/3/", data=request_body)
        response = view(request, gitlab_pid=3)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["parents"]),2)

    def test_many_parents(self):
        request_body = {
            'parents': [
                4,
                2,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                124,
                1234,
                40,
                26
            ]
        }
        not_exist = False
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/3/", data=request_body)
        response = view(request, gitlab_pid=3)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(request_body["parents"]), len(response.data["parents"]))
        for parent in response.data["parents"]:
            self.assertIn(parent, request_body["parents"])
            try:
                repo = Repository.objects.get(gitlab_pid = parent)
            except Exception:
                not_exist = True

        self.assertFalse(not_exist)
        
    
    def test_parent_of_himself(self):
        request_body = {
            'parents': [
                4,
                2,
                5,
                6,
                7,
                3,
                9,
                10,
                11,
                12,
                124,
                1234,
                40,
                26
            ]
        }
        factory = APIRequestFactory()
        view = RepositoryViewSet.as_view({"patch":"partial_update"})
        request = factory.patch("/api-v1/repositories/3/", data=request_body)
        response = view(request, gitlab_pid=3)
        self.assertEqual(response.status_code, 406)


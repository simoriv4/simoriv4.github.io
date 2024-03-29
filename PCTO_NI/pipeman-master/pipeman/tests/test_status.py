from django.test import TestCase
from gitlab import Gitlab
from pipeman.getdependencystatus import tagControl
from pipeman.models import Repository
from pipeman.tests.seed_db import seed_db

gl = Gitlab("http://localhost", job_token="CI_JOB_TOKEN", api_version="4")

test_mr = False
test_branch_date = "2023-05-29T13:09:16.000+00:00"
test_id_commit_branch = 2
test_id_commit_tag = 2
test_tag_parent_date = "2023-05-29T13:09:16.000+00:00"
test_tag_date = "2023-05-29T13:09:16.000+00:00"
last_pipeline_status = "success"


class RepoStatusTest(TestCase):
    def setUp(self):
        seed_db()

    def test_status_green(self):
        parent = Repository.objects.get(gitlab_pid=4)
        status, error_mex = tagControl(
            test_tag_date,
            test_branch_date,
            test_id_commit_branch,
            test_id_commit_tag,
            test_mr,
            test_tag_parent_date,
            False,
            last_pipeline_status,
            parent,
        )
        self.assertEqual(status, "green")

    def test_status_yellow(self):
        parent = Repository.objects.get(gitlab_pid=4)
        test_branch_date = "2023-05-29T14:09:16.000+00:00"
        test_tag_date = "2023-05-29T13:09:16.000+00:00"
        test_id_commit_branch = 2
        test_id_commit_tag = 3
        status, error_mex = tagControl(
            test_tag_date,
            test_branch_date,
            test_id_commit_branch,
            test_id_commit_tag,
            test_mr,
            test_tag_parent_date,
            False,
            last_pipeline_status,
            parent,
        )
        self.assertEqual(status, "yellow")

    def test_status_red(self):
        parent = Repository.objects.get(gitlab_pid=4)
        test_mr = False
        test_branch_date = "2023-05-29T13:09:16.000+00:00"
        test_id_commit_branch = 2
        test_id_commit_tag = 2
        test_tag_parent_date = "2023-05-29T14:09:16.000+00:00"
        test_tag_date = "2023-05-29T13:09:16.000+00:00"

        status, error_mex = tagControl(
            test_tag_date,
            test_branch_date,
            test_id_commit_branch,
            test_id_commit_tag,
            test_mr,
            test_tag_parent_date,
            False,
            last_pipeline_status,
            parent,
        )
        self.assertEqual(status, "red")

    def test_last_tag_protected_no_default_branch(
        self,
    ):  # se un tag è protetto in un branch che non sia quello di default
        parent = Repository.objects.get(gitlab_pid=4)
        test_id_commit_tag = 2
        test_id_commit_branch = 3
        test_branch_date = "2023-05-29T13:09:16.000+00:00"
        test_tag_date = "2023-05-29T14:09:16.000+00:00"

        status, error_mex = tagControl(
            test_tag_date,
            test_branch_date,
            test_id_commit_branch,
            test_id_commit_tag,
            test_mr,
            test_tag_parent_date,
            True,
            last_pipeline_status,
            parent,
        )
        self.assertEqual(status, "red")

    def test_no_parents(self):
        parent = Repository.objects.get(gitlab_pid=4)
        test_branch_date = "2023-05-29T14:09:16.000+00:00"
        test_tag_date = "2023-05-29T13:09:16.000+00:00"
        test_tag_parent_date = None
        test_id_commit_branch = 2
        test_id_commit_tag = 3
        status, error_mex = tagControl(
            test_tag_date,
            test_branch_date,
            test_id_commit_branch,
            test_id_commit_tag,
            test_mr,
            test_tag_parent_date,
            False,
            last_pipeline_status,
            parent,
        )
        self.assertEqual(status, "yellow")

    def test_parent_older_last_tag_child(self):
        parent = Repository.objects.get(gitlab_pid=4)
        test_tag_parent_date = "2023-05-29T13:09:16.000+00:00"
        test_tag_date = "2023-05-29T14:09:16.000+00:00"

        status, error_mex = tagControl(
            test_tag_date,
            test_branch_date,
            test_id_commit_branch,
            test_id_commit_tag,
            test_mr,
            test_tag_parent_date,
            False,
            last_pipeline_status,
            parent,
        )
        self.assertEqual(status, "green")

    def test_pipeline_failed(self):
        parent = Repository.objects.get(gitlab_pid=4)
        last_pipeline_status = "failed"
        status, error_mex = tagControl(
            test_tag_date,
            test_branch_date,
            test_id_commit_branch,
            test_id_commit_tag,
            test_mr,
            test_tag_parent_date,
            False,
            last_pipeline_status,
            parent,
        )
        self.assertEqual(status, "red")

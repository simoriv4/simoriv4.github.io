from django.test import TestCase
from gitlab import Gitlab
from gitlab.v4.objects import ProjectMergeRequest, ProjectBranch, ProjectTag
from pipeman.getdependencystatus import tagControl
from pipeman.tests.seed_db import seed_db

gl = Gitlab("http://localhost", job_token="CI_JOB_TOKEN", api_version="4")

test_mr = False
test_branch_date = '2023-05-29T13:09:16.000+00:00'
test_id_commit_branch = 2
test_id_commit_tag = 2
test_tag_parent_date = '2023-05-29T13:09:16.000+00:00'
test_tag_date ='2023-05-29T13:09:16.000+00:00'

class RepoStatusTest(TestCase):
    def setUp(selg):
        seed_db()
        
    
    def test_status_green(self):
        status = tagControl(test_tag_date, test_branch_date, test_id_commit_branch, test_id_commit_tag, test_mr, test_tag_parent_date, False)
        self.assertEqual(status, "verde")
    
    def test_status_yellow(self):
        test_branch_date = '2023-05-29T14:09:16.000+00:00'
        test_tag_date = '2023-05-29T13:09:16.000+00:00'
        test_id_commit_branch = 2
        test_id_commit_tag = 3
        status = tagControl(test_tag_date, test_branch_date, test_id_commit_branch, test_id_commit_tag, test_mr, test_tag_parent_date, False)
        self.assertEqual(status, "giallo")

    def test_status_red(self):
        test_mr = False
        test_branch_date = '2023-05-29T13:09:16.000+00:00'
        test_id_commit_branch = 2
        test_id_commit_tag = 2
        test_tag_parent_date = '2023-05-29T14:09:16.000+00:00'
        test_tag_date ='2023-05-29T13:09:16.000+00:00'

        status = tagControl(test_tag_date, test_branch_date, test_id_commit_branch, test_id_commit_tag, test_mr, test_tag_parent_date, False)
        self.assertEqual(status, "rosso")

    def test_last_tag_protected_no_default_branch(self): # se un tag è protetto in un branch che non sia quello di default
        test_id_commit_tag = 2
        test_id_commit_branch = 3
        test_branch_date = '2023-05-29T13:09:16.000+00:00'
        test_tag_date ='2023-05-29T14:09:16.000+00:00'
        
        status = tagControl(test_tag_date, test_branch_date, test_id_commit_branch, test_id_commit_tag, test_mr, test_tag_parent_date, True)
        self.assertEqual(status, "rosso")

    def test_no_parents(self):
        test_branch_date = '2023-05-29T14:09:16.000+00:00'
        test_tag_date = '2023-05-29T13:09:16.000+00:00'
        test_tag_parent_date = None
        test_id_commit_branch = 2
        test_id_commit_tag = 3
        status = tagControl(test_tag_date, test_branch_date, test_id_commit_branch, test_id_commit_tag, test_mr, test_tag_parent_date, False)
        self.assertEqual(status, "giallo")

    def test_parent_older_last_tag_child(self):
        test_tag_parent_date = '2023-05-29T13:09:16.000+00:00'
        test_tag_date ='2023-05-29T14:09:16.000+00:00'

        status = tagControl(test_tag_date, test_branch_date, test_id_commit_branch, test_id_commit_tag, test_mr, test_tag_parent_date, False)
        self.assertEqual(status, "verde")




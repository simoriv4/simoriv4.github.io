from django.db import models

class Repository(models.Model):
    gitlab_pid = models.IntegerField(unique=True)
    project_name = models.CharField(max_length=255, default="")
    parents = models.ManyToManyField("Repository", related_name="related_repository_repository", blank=True)
    is_manual = models.BooleanField(default=False)
    # defaul_branch_last_commit = models.CharField(max_length=255, default="")
    # last_tag_commit = models.CharField(max_length=255, default="")
    
    @property
    def getChild(self):
        return list(Repository.objects.get(gitlab_pid = self.gitlab_pid).related_repository_repository.all()) #restituisce tutti i figli di quel project --> relazione many to many inversa

    # @property
    # def getLeafChild(self):
    #     leafs_list = []

    class Meta:
        verbose_name_plural = "Repositories"

class Settings(models.Model):
    gitlab_host = models.CharField(max_length=255) 
    gitlab_token = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = "Settings"
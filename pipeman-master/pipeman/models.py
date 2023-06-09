from django.db import models

class Repository(models.Model):
    gitlab_pid = models.IntegerField()
    project_name = models.CharField(max_length=255)
    parents = models.ManyToManyField("Repository", related_name="related_repository_repository", blank=True)
    is_manual = models.BooleanField(default=False)

    @property
    def getChild(self):
        return list(Repository.objects.get(gitlab_pid = self.gitlab_pid).related_repository_repository.all()) #restituisce tutti i figli di quel project --> relazione many to many inversa
    @property
    def getAllChildren(self):
        children =self.getChild
        for child in children:
            list_childrend = list(Repository.objects.get(gitlab_pid = child.gitlab_pid).related_repository_repository.all()) #estendo la lista di children con i figli dei figli
            for element in list_childrend:
                try:
                    children.remove(element)
                except Exception:
                    pass
                children.append(element)
        
        return children


    class Meta:
        verbose_name_plural = "Repositories"

class Settings(models.Model):
    gitlab_host = models.CharField(max_length=255) 
    gitlab_token = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = "Settings"
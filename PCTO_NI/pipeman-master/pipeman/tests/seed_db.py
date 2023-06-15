from pipeman.models import Repository 


def seed_db():

    repo1 = Repository(
        gitlab_pid=1,
        project_name="Repository1"
    )
    repo1.save()

    repo2 = Repository(
        gitlab_pid=2,
        project_name="Repository2"
    )
    repo2.save()

    repo3 = Repository(
        gitlab_pid=3,
        project_name="Repository3"
    )
    repo3.save()

    repo4 = Repository(
        gitlab_pid=4,
        project_name="Repository4"
    )
    repo4.save()

    repo5 = Repository(
        gitlab_pid= 5,
        project_name = "Repository5"
    )
    repo5.save()

    repo6 = Repository(
        gitlab_pid= 6,
        project_name = "Repository6"
    )
    repo6.save()

    repo7 = Repository(
        gitlab_pid= 7,
        project_name = "Repository7"
    )
    repo7.save()

    repo8 = Repository(
        gitlab_pid= 8,
        project_name = "Repository8"
    )
    repo8.save()

    
    # repo1.parents.add(repo2)
    # repo1.parents.add(repo4)
    # repo1.parents.add(repo5)

    # repo1.save()

    # repo2.parents.add(repo3)

    # repo2.save()


    # repo4.parents.add(repo3)
    # repo4.save()

    repo1.parents.add(repo2)

    repo1.save()

    repo2.parents.add(repo3)
    repo2.parents.add(repo4)
    repo2.parents.add(repo6)

    repo2.save()

    repo3.parents.add(repo7)
    repo3.parents.add(repo5)

    repo3.save()

    repo4.parents.add(repo5)
    repo4.save()

    repo7.parents.add(repo8)
    repo8.save()


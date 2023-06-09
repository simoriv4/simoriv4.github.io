import gitlab
import argparse
import datetime

gl = gitlab.Gitlab(url='https://gitlab.sandbox', private_token='glpat-xPbZX8VGsd9DJzTFPcNc')

# # anonymous read-only access for public resources (GitLab.com)
# gl = gitlab.Gitlab()

# # anonymous read-only access for public resources (self-hosted GitLab instance)
# gl = gitlab.Gitlab('https://gitlab.example.com')

# # private token or personal token authentication (GitLab.com)
# gl = gitlab.Gitlab(private_token='JVNSESs8EwWRx5yDxM5q')

# private token or personal token authentication (self-hosted GitLab instance)
# gl = gitlab.Gitlab(url='https://gitlab.sandbox', private_token='glpat-xPbZX8VGsd9DJzTFPcNc')
# project = gl.projects.get(1)# oauth token authentication


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--project","-p",default=None, required=False)

    args = parser.parse_args()

    project = args.project



    if project == None:
        projects = gl.projects.list()
        #se non viene \passato niente, stampo id e nome di ogni elemento della lista
        for project in projects:
            print(f"id: {project.get_id()}, name: {project.name}")

    else:
        #se passo l'id visualizzo tutti i dettagli di quell'id
        #verifico se è valido
        
        #project = gl.projects.ge

        if project.isnumeric() == True:
            try:
                project_object = gl.projects.get(project) #controllo che il porject passato esista
            except Exception as err:
                print("errore")
                return

            #lista di tag 
            # tags =gl.projects.get(project).tags.list().sort(key=lambda x:datetime.datetime.fromisoformat(x.commit["committed_date"]))

            def test(arg):
                return datetime.datetime.fromisoformat(arg.commit["committed_date"]).timestamp()*1000
                

            tags =gl.projects.get(project).tags.list()
            tags.sort(key=test)

            for tag in tags:
                print(f"id: {tag.get_id()}")

            if project_object != None:
                #se esiste
                print(f"id: {project_object.get_id()}, name: {project_object.name}")
                Branchs = gl.projects.get(project).branches.list()
                for default in Branchs:
                    if default.default == True:
                        defaultBranch = default

                    print(f"{default.default}, nome: {default.name}")
                print(defaultBranch.name)
                print(defaultBranch.commit)

                #trovo l'ultimo tag

                #tags.sort() #riordino discendente
                print(f"id: {tags[len(tags)-1].get_id()}")

                lastTag = tags[len(tags)-1]

                defaultBranchDate =  datetime.datetime.fromisoformat(defaultBranch.commit["committed_date"]).timestamp()
                lastTagDate = datetime.datetime.fromisoformat(lastTag.commit["committed_date"]).timestamp()

                commits = gl.projects.get(project).commits.list(ref_name='my_branch')
                mergeRequest = gl.projects.get(project).mergerequests.list(state='opened')

                if defaultBranch.commit == lastTag.commit:
                    print("verde")
                if defaultBranchDate > lastTagDate:
                    print("giallo")
                if len(mergeRequest) > 0:
                    print("blu")
                if defaultBranchDate < lastTagDate:
                    print("rosso")
            else:
                print("ID non valido!")            

        else:
            print("ID non valido!")          

            #verde--> ultimo commit = al commit a cui si riferisce il tag
            # giallo --> se faccio un commit dopo un tag sul defaulBranch
            # blu --> se c'è un commit successivo al commit del master 
            # ross-> se ultimo tga ha pipeline fallita
                # -> se il figlio ha una data più vecchio del padre
            
            
if __name__ == "__main__":
    main()








#gl = gitlab.Gitlab('https://gitlab.example.com', oauth_token='my_long_token_here')

# job token authentication (to be used in CI)
# bear in mind the limitations of the API endpoints it supports:
# https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html
#import os
#gl = gitlab.Gitlab('https://gitlab.example.com', job_token=os.environ['CI_JOB_TOKEN'])

# # Define your own custom user agent for requests
# gl = gitlab.Gitlab('https://gitlab.example.com', user_agent='my-package/1.0.0')

# # make an API request to create the gl.user object. This is not required but may be useful
# # to validate your token authentication. Note that this will not work with job tokens.
# gl.auth()

# # Enable "debug" mode. This can be useful when trying to determine what
# # information is being sent back and forth to the GitLab server.
# # Note: this will cause credentials and other potentially sensitive
# # information to be printed to the terminal.
# gl.enable_debug()
import datetime

# import gitlab
from pipeman.gitlab_api import list_project_opened_mr
from pipeman.models import Repository, Settings
#from pipeman.project_child import projectChild


MAX_CHIAMATE = 50 #massimo numero di chiamate alla funzione ricorsiva
def getListParents(id_last_child):
    def repeat(repeat_count, all_projects, id_last_child):
        if repeat_count < MAX_CHIAMATE:
            repeat_count+=1 #incremento il numero 
            #tutti i parent collegati a quel child
            all_parents_project =list(Repository.objects.get(gitlab_pid = id_last_child).parents.all())
            #scorro per ogni parent la funzione ricorsiva
            for parent in all_parents_project:
                #aggiungo il parent se non è già stato fatto alla lista di tutti i projects
                try:
                    all_projects.remove(parent)
                except Exception:
                    pass
                all_projects.append(parent)
                all_projects, repeat_count = repeat(repeat_count, all_projects, parent.gitlab_pid)

            return all_projects, repeat_count #ritorno tutti i projects raccolti
            
        # all_projects = None
        return all_projects, repeat_count

    #parto dall'ultimo child
    all_projects = list()
    repeat_count = 0

    try:
        #aggiungo il primo child alla lista
        all_projects.append(Repository.objects.get(gitlab_pid = id_last_child))
    except Exception:
                return all_projects, repeat_count #id_last_child non esiste
    #per il controllo "cane che si morde la coda"--> se un child è il padre di un padre si crea un anello infinito--> metto un contatore per ogni volta che viene richiamata la funzione
    all_projects,repeat_count = repeat(repeat_count, all_projects, id_last_child)

    return all_projects, repeat_count    

def exist_repositories_on_gitlab(all_projects, gl):
    for project in all_projects:
        try:
            repo = gl.projects.get(project.gitlab_pid)
        except Exception:
            all_projects.clear()
            all_projects.append("ERROR. Project does not exist.")
            all_projects.append(project)
            return False, all_projects
    return True, all_projects

def find_tags_sort(gl,id):
    #trovo l'ultimo tag per confrontarlo
    tags = gl.projects.get(id).tags.list()
    #riordino i tag in ordine crescente--> in base alla data in mills
    tags.sort(key = convert_data)
    return tags

def convert_data(arg):
    return datetime.datetime.fromisoformat(arg.commit["committed_date"]).timestamp()*1000

def tagControl(last_tag_date, defaultBranch_date, id_commit_defaultBranch, id_commit_last_tag, merge_request, last_tag_parent_date, is_protected, last_pipeline_status):

    #eseguo i controlli
    #rosso
    # red, parent_red = control_red(last_tag_date, project)
    if last_tag_parent_date is not None:
        if last_tag_parent_date > last_tag_date:
            return "red", "il padre è più giovane del figlio "
    if is_protected == True:
        return "red", "il tag è protetto e non si trova sul branch di default"
    if last_pipeline_status == None:
        return "red", "non ci sono pipelines sul tag"
    if last_pipeline_status == "failed":
        return "red", "l'ultima pipeline sul tag è fallita"
    
    if last_pipeline_status == "success":
        if id_commit_defaultBranch == id_commit_last_tag and merge_request == False and last_tag_parent_date <= last_tag_date and last_pipeline_status == "success":
            return "green", ""
        if defaultBranch_date > last_tag_date:
            return "yellow", "default branch più giovane dell'utlimo tag"
        if merge_request == True:
            return "blue", "merge request"
    


def getDescendants(id_project):
    #calcolo tutti tutti i figli dei figli di quel parent
    try:
        children = Repository.objects.get(gitlab_pid = id_project).getAllChildren
        return children
    except Exception:
        return None

def isDuplicate(all_projects, project):
    for prj in all_projects:
        if prj.project_obj.gitlab_pid == project.project_obj.gitlab_pid:
            return True
    
    return False

def protected_tags_in_branch(gl, branches, id_project):
    for branch in branches:
        tags = find_tags_sort(gl, id_project)
        if len(tags) > 0:
            last_tag = tags[len(tags)-1]
            if branch.default != True and last_tag.protected == True:
                return True
    return False
            
def getIndex(project, all_projects):
    index = 0
    for proj in all_projects:
        if proj == project:
            return index
        index+=1
    return None

def setStatus(all_projects, project, status):
    #controllo che i project con uno stato più grave non vengano cambiati
    status_project = None
    try:
        status_project = all_projects[getIndex(project, all_projects)].status
    except Exception:
        return True
    if status_project != "red" or status_project == None:
        if status == "red" and (status_project == "green" or status_project == "yellow" or status_project == "blue"):
            return True
        if status_project == "green" and status == "yellow":
            return True
        
    return False

def setGray(all_projects, projects_red):
    #prendo i figli di ogni project_red e cambio lo stato in grigio
    for project_red in projects_red:
        children = getDescendants(project_red.gitlab_pid)
        for child in children:
            try:
            #trovo il project corrispondente a child in all_projects e cambio lo stato
                all_projects[getIndex(child, all_projects)].status = "gray"
            except Exception:
                pass
            # print(f"{child.project_name} {all_projects[getIndex(child, all_projects)].status}")
    return all_projects
            

def getDependecyStatus(gl, id_last_child):
    #ottengo tutti i project in una lista
    all_projects, count = getListParents(id_last_child = id_last_child) #count viene ritornato per i test    merge_request = False
    if count < 50:
        all_projects_exist, all_projects = exist_repositories_on_gitlab(all_projects, gl)
        if all_projects_exist == True:
            #lista contenente tutti i projects rossi--> calcolerò i descendants di ogni project sarà grigio
            projects_red = list()
            #controllo lo stato1
            for project in all_projects:
                #default branch
                repository = gl.projects.get(project.gitlab_pid)
                project.project_name = repository.name
                project.save()
                branches = repository.branches.list() # lista contenente il tag corrente
                #controllo che non ci siano dei tag protetti in branch che non siano di default--> True--> rosso
                is_protected = protected_tags_in_branch(gl, branches, project.gitlab_pid)
                for branch in branches:
                    if branch.default == True:
                        defaultBranch = branch
                #trovo l'ultimo tag per confrontarlo
                tags = find_tags_sort(gl, project.gitlab_pid)
                #last tag
                if len(tags) > 0:
                    last_tag = tags[len(tags)-1]    #corrisponde all'ultimo tag della lista
                    # #trovo la data del default branch
                    defaultBranch_date = datetime.datetime.fromisoformat(defaultBranch.commit["committed_date"]).timestamp()
                    # #trovo la data del last tag
                    last_tag_date = datetime.datetime.fromisoformat(last_tag.commit["committed_date"]).timestamp()
                    
                    #salvo tutti i parents di quel project
                    all_parents_project=list(Repository.objects.get(gitlab_pid = project.gitlab_pid).parents.all())
                    #salvo le pipelines del tag
                    pipelines = gl.projects.get(project.gitlab_pid).pipelines.list()
                    last_pipeline_status = None
                    for pipeline in pipelines:
                        #trovo last_pipeline_tag-_> non se non si trova è rosso
                        is_tag_pipeline = gl.projects.get(project.gitlab_pid).pipelines.get(pipeline.id).tag
                        if is_tag_pipeline == True:
                            last_pipeline_tag = pipeline
                            last_pipeline_status = last_pipeline_tag.status #salvato in ordine dalla più nuova alla più vecchia
                            break
                    #salvo le merge request
                    mr = list_project_opened_mr(project.gitlab_pid, gl)
                    if len(mr) > 0:
                        merge_request = True
                    else:
                        merge_request = False
                    #scorro per trovare il parent_red
                    for parent in all_parents_project:
                        #trovo il last tag del parent corrente
                        id_parent = parent.gitlab_pid
                        tags_parent = find_tags_sort(gl, id_parent)
                        if len(tags_parent) == 0:
                            project.status = "red"
                            project.error_mex = "il parent non ha tag"
                            projects_red.append(project) # bisogna salvarsi il project rosso per poter trovare i suoi child da mettere grigi alla fine del controllo di tutti gli altri project
                            # print(f"{project.project_name}  {project.status}")
                            continue

                        last_tag_parent = tags_parent[len(tags_parent)-1]
                        last_tag_parent_date = datetime.datetime.fromisoformat(last_tag_parent.commit["committed_date"]).timestamp()
                        

                        #controllo lo stato
                        #controllo che i project con uno stato più grave non vengano cambiati
                        status, error_mex = tagControl(last_tag_date, defaultBranch_date, defaultBranch.commit["id"], last_tag.commit["id"], merge_request, last_tag_parent_date, is_protected, last_pipeline_status)

                        if setStatus(all_projects, project, status) == True:
                            project.status = status
                            project.error_mex = error_mex
                            
                            # print(f"{project.project_name} {project.status}")
                        if project.status == "red": #rosso è il projct corrente--> i figli diventano grigi
                            projects_red.append(project) # bisogna salvarsi il project rosso per poter trovare i suoi child da mettere grigi alla fine del controllo di tutti gli altri project
                    if len(all_parents_project) == 0: #and setStatus(all_projects, project) == True:
                        #controllo che i project con uno stato più grave non vengano cambiati
                        last_tag_parent_date  = 0
                        status, error_mex = tagControl(last_tag_date, defaultBranch_date, defaultBranch.commit["id"], last_tag.commit["id"], merge_request, last_tag_parent_date, is_protected, last_pipeline_status)
                        if setStatus(all_projects, project, status) == True:
                            project.status = status
                            project.error_mex = error_mex
                            # print(f"{project.project_name}  {project.status}")
                        if status == "red":
                            projects_red.append(project)
                            #project.error_mex = error_mex

                        # all_projects[getIndex(project, all_projects)].status = tagControl(last_tag_date, defaultBranch_date, defaultBranch.commit, last_tag.commit, merge_request, 0, is_protected) #non ci sono parent di quel project
                else:
                    project.status = "red" # se non ci sono tag è rosso
                    projects_red.append(project)
                    project.error_mex = "non ci sono tag"

                    # bisogna salvarsi il project rosso per poter trovare i suoi child da mettere grigi alla fine del controllo di tutti gli altri project
                    # print(f"{project.project_name} {project.status}")
            if len(all_projects) > 1:
                #faccio diventare grigi i figli di ogni project_red
                all_projects = setGray(all_projects, projects_red)
    else:
        all_projects.clear()
    
    return all_projects     # la lista contiene tutti i projects con il colore dello stato alla voce status di ogni project

#verde--> ultimo commit = al commit a cui si riferisce il tag
# giallo --> se faccio un commit sul defaulBranch dopo un tag 
# blu --> se c'è un commit successivo al commit del master 
# rosso-> se ultimo tag ha pipeline fallita
#      -> se il figlio ha una data più vecchio del padre
#         se tag protetto su un branch non default
#         se non ci sono tag

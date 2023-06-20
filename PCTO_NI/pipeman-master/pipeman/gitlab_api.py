def list_project_opened_mr(project_id, gl):
    # controllo se ci sono state delle merge request
    return gl.projects.get(project_id).mergerequests.list(state="opened")

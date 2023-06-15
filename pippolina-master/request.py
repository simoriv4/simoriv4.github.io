import argparse
import base64
import json
from os import PathLike
import os
import requests
import yaml

parser = argparse.ArgumentParser()

parser.add_argument(
    '-f',
    '--file',
    help='The path of pippolina.yml'
)

def get_url():
    #url dinamico
    PIPEMAN_USE_HTTPS = os.environ["PIPEMAN_USE_HTTPS"]
    PIPEMAN_HOST_NAME = os.environ["PIPEMAN_HOST_NAME"]
    PIPEMAN_PORT = os.environ["PIPEMAN_PORT"]
    url = ""
    if PIPEMAN_USE_HTTPS == True:
        url = "https://" + PIPEMAN_HOST_NAME + ":" + PIPEMAN_PORT + "/api-v1/repositories/"
    else:
        url = "http://" + PIPEMAN_HOST_NAME + ":" + PIPEMAN_PORT + "/api-v1/repositories/"
    
    return url

def update_parents(CI_PROJECT_ID):
    args = parser.parse_args()
    filepath = ''
    if args.file == None:
        #        #controllo che sia presente nella cartella .ni-> altrimenti errore
        exist = os.path.isfile("./.ni/pippolina.yml")
        if exist == True:
            filepath = './.ni/pippolina.yml'
        else:        
            exist = os.path.isfile("./.ni/pippolina.yaml")
            if exist == True:
                filepath = "./.ni/pippolina.yaml"
            else:
                print("Error: no such file or directory")
                exit(1)
    else:
        #controllo che sia presente il file nel percorso passato
        exist = os.path.isfile(args.file)
        if exist == False:
            print("Error: no such file or directory")
            exit("errore")
            
        else:
            filepath = args.file

    with open(filepath) as f:
        dependencies = yaml.load(f, Loader=yaml.FullLoader)
        url = get_url()

        # set_log_in("admin", "password")
        USERNAME = os.environ["USERNAME"]
        PASSWORD = os.environ["PASSWORD"]
        response = get_access_token(USERNAME, PASSWORD)
        access_token = json.loads(response.text)["access_token"]

        headers={'Authorization': f'Bearer {access_token}'}

        request = requests.patch(url + str(CI_PROJECT_ID)+"/",headers=headers, data = {"parents": dependencies["dependencies"]})
        if request.status_code == 401:
            response = refresh_token(response)
            access_token = json.loads(response.text)["access_token"]
            headers={'Authorization': f'Bearer {access_token}'}

            request = requests.patch(url + str(CI_PROJECT_ID)+"/",headers=headers, data = {"parents": dependencies["dependencies"]})
            if request.status_code == 403:
                response = get_access_token(USERNAME, PASSWORD)
                access_token = json.loads(response.text)["access_token"]
                headers={'Authorization': f'Bearer {access_token}'}
                request = requests.patch(url + str(CI_PROJECT_ID)+"/",headers=headers, data = {"parents": dependencies["dependencies"]})
            if response.status_code >399:
                print("Error. There is a problem with the authetication.")
                exit(1)
        if request.status_code == 404:
            print("Error file not found")
            request = requests.post(
                url,
                headers={"Content-Type":"application/json"},
                data = {"parents": dependencies["dependencies"], "gitlab_pid": 1}
            )
            if request.status_code > 399:
                print("Error. " + request.text)
                exit(1)
        elif request.status_code > 399:
            print("Error")
            exit(1)
            

    exit(0)


def get_access_token(username, password): #quando si fa un accesso si richiama la funzione che cambierà le variabili globali dei vari campi
    CLIENT_ID = os.environ["CLIENT_ID"]
    CLIENT_SECRET = os.environ["CLIENT_SECRET"]
    payload = {
        'grant_type': 'password',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'username': username,
        'password': password,
    }
    
    r = requests.post(
        "http://localhost:8000/o/token/", 
        headers={"Content-Type":"application/x-www-form-urlencoded"},
        data=payload)
    # os.environ["ACCESS_TOKEN"] = json.loads(r.text)["access_token"]
    # os.environ["REFRESH_TOKEN"] = json.loads(r.text)["refresh_token"]
    return r



def refresh_token(response):
    CLIENT_ID = os.environ["CLIENT_ID"]
    CLIENT_SECRET = os.environ["CLIENT_SECRET"]
    refresh_token = json.loads(response.text)["refresh_token"]

    auth = (CLIENT_ID, CLIENT_SECRET)

    params = {
    "grant_type":"refresh_token",
    "refresh_token":refresh_token
    }

    url = "http://localhost:8000/o/token/"

    return requests.post(url, auth=auth, data=params)

# def set_log_in(username, password):
#     os.environ["USERNAME"] = username
#     os.environ["PASSWORD"] = password

import argparse
import json
from os import PathLike
import os
import requests
import yaml

from pippolina.request import get_access_token, refresh_token

def main():
    
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
                    headers={"Content-Type":"application/json",'Authorization': f'Bearer {access_token}'},
                    data = json.dumps({"parents": dependencies["dependencies"], "gitlab_pid": CI_PROJECT_ID})
                )
                if request.status_code > 399:
                    print("Error. " + request.text)
                    exit(1)
            elif request.status_code > 399:
                print("Error. " + request.text)
                exit(1)
                
        exit(0)

        
    CI_PROJECT_ID = os.environ["CI_PROJECT_ID"]
    update_parents(CI_PROJECT_ID)

    
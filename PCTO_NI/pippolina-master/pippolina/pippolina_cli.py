import argparse
import json
import os
import requests
import yaml

from pippolina.request import get_access_token, refresh_token


def main():  # noqa: C901

    parser = argparse.ArgumentParser()

    parser.add_argument("-f", "--file", help="The path of pippolina.yml")

    def get_url():
        # url dinamico
        PIPEMAN_USE_HTTPS = os.getenv("PIPEMAN_USE_HTTPS", "")
        PIPEMAN_HOST_NAME = os.getenv("PIPEMAN_HOST_NAME", "")
        PIPEMAN_PORT = os.getenv("PIPEMAN_PORT", "")
        url = ""
        if PIPEMAN_USE_HTTPS == "True":
            url = (
                "https://"
                + PIPEMAN_HOST_NAME
                + ":"
                + PIPEMAN_PORT
                + "/api-v1/repositories/"
            )
        elif PIPEMAN_USE_HTTPS == "False":
            url = (
                "http://"
                + PIPEMAN_HOST_NAME
                + ":"
                + PIPEMAN_PORT
                + "/api-v1/repositories/"
            )
        elif bool(PIPEMAN_USE_HTTPS) is False:
            pass

        return url

    def update_parents(CI_PROJECT_ID):
        args = parser.parse_args()
        filepath = ""
        if args.file is None:
            #        #controllo che sia presente nella cartella .ni-> altrimenti errore
            exist = os.path.isfile("./.ni/pippolina.yml")
            if exist is True:
                filepath = "./.ni/pippolina.yml"
            else:
                exist = os.path.isfile("./.ni/pippolina.yaml")
                if exist is True:
                    filepath = "./.ni/pippolina.yaml"
                else:
                    print("Error: no such file or directory")
                    exit(1)
        else:
            # controllo che sia presente il file nel percorso passato
            exist = os.path.isfile(args.file)
            if exist is False:
                print("Error: no such file or directory")
                exit(1)

            else:
                filepath = args.file
        with open(filepath) as f:
            dependencies = yaml.load(f, Loader=yaml.FullLoader)
            url = get_url()
            try:
                dependencies["dependencies"]
            except Exception:
                if dependencies is not None:
                    print(
                        "Error. There is not the keyword 'dependencies'."
                        + " It may have be written wrong."
                    )
                else:
                    print("Error. File pippolina.yml is empty.")
                exit(1)

            USERNAME = os.getenv("PIPEMAN_USERNAME", "")
            PASSWORD = os.getenv("PIPEMAN_PASSWORD", "")
            response = get_access_token(USERNAME, PASSWORD)
            try:
                access_token = json.loads(response.text)["access_token"]
            except Exception:
                response = refresh_token(response)
                access_token = json.loads(response.text)["access_token"]

            headers = {"Authorization": f"Bearer {access_token}"}

            request = requests.patch(
                url + str(CI_PROJECT_ID) + "/",
                headers=headers,
                data={"parents": dependencies["dependencies"]},
                verify="/etc/ssl/certs/ca-certificates.crt",
            )
            if request.status_code == 401:
                response = refresh_token(response)
                access_token = json.loads(response.text)["access_token"]
                headers = {"Authorization": f"Bearer {access_token}"}

                request = requests.patch(
                    url + str(CI_PROJECT_ID) + "/",
                    headers=headers,
                    data={"parents": dependencies["dependencies"]},
                    verify="/etc/ssl/certs/ca-certificates.crt",
                )
                if request.status_code == 403:
                    response = get_access_token(USERNAME, PASSWORD)
                    access_token = json.loads(response.text)["access_token"]
                    headers = {"Authorization": f"Bearer {access_token}"}
                    request = requests.patch(
                        url + str(CI_PROJECT_ID) + "/",
                        headers=headers,
                        data={"parents": dependencies["dependencies"]},
                        verify="/etc/ssl/certs/ca-certificates.crt",
                    )
                if response.status_code > 399:
                    print("Error. There is a problem with the authetication.")
                    exit(1)
            if request.status_code == 404:
                # print("Error file not found")
                request = requests.post(
                    url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {access_token}",
                    },
                    data=json.dumps(
                        {
                            "parents": dependencies["dependencies"],
                            "gitlab_pid": CI_PROJECT_ID,
                        }
                    ),
                    verify="/etc/ssl/certs/ca-certificates.crt",
                )
                if request.status_code > 399:
                    print("Error. " + request.text)
                    exit(1)
            elif request.status_code > 399:
                print("Error. " + request.text)
                exit(1)

        exit(0)

    CI_PROJECT_ID = os.getenv("CI_PROJECT_ID", "")
    update_parents(CI_PROJECT_ID)

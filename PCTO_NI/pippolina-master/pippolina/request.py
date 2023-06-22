import json
import os
import requests


def get_access_token(username, password):
    CLIENT_ID = os.getenv("PIPEMAN_CLIENT_ID", "")
    CLIENT_SECRET = os.getenv("PIPEMAN_CLIENT_SECRET", "")

    payload = {
        "grant_type": "password",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "username": username,
        "password": password,
    }

    r = requests.post(
        url=get_url_token(),
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data=payload,
        verify="/etc/ssl/certs/ca-certificates.crt",
    )
    return r


def refresh_token(response):
    CLIENT_ID = os.getenv("PIPEMAN_CLIENT_ID", "")
    CLIENT_SECRET = os.getenv("PIPEMAN_CLIENT_SECRET", "")
    try:
        refresh_token = json.loads(response.text)["refresh_token"]
    except Exception:
        print(response.text)
        exit(1)
    auth = (CLIENT_ID, CLIENT_SECRET)

    params = {"grant_type": "refresh_token", "refresh_token": refresh_token}

    url = get_url_token()

    return requests.post(
        url, auth=auth, data=params, verify="/etc/ssl/certs/ca-certificates.crt"
    )


def get_url_token():
    # url dinamico
    PIPEMAN_USE_HTTPS = os.getenv("PIPEMAN_USE_HTTPS", "")
    PIPEMAN_HOST_NAME = os.getenv("PIPEMAN_HOST_NAME", "")
    PIPEMAN_PORT = os.getenv("PIPEMAN_PORT", "")
    url = ""
    if PIPEMAN_USE_HTTPS == "True":
        url = "https://" + PIPEMAN_HOST_NAME + ":" + PIPEMAN_PORT + "/o/token/"
    elif PIPEMAN_USE_HTTPS == "False":
        url = "http://" + PIPEMAN_HOST_NAME + ":" + PIPEMAN_PORT + "/o/token/"
    elif bool(PIPEMAN_USE_HTTPS) is False:
        exit(1)
    return url

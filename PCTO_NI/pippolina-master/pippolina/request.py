import argparse
import base64
import json
from os import PathLike
import os
import requests
import yaml

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

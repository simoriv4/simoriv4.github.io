import argparse
from os import PathLike
import os
import requests
import yaml
from request import get_access_token, update_parents

# parser = argparse.ArgumentParser()

# parser.add_argument(
#     '-f',
#     '--file',
#     help='The path of pippolina.yml'
# )

def main():
    update_parents(3)
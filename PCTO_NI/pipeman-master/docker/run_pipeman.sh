# /bin/bash

echo "Starting pipeman server..."

cd /pipeman
cp ./docker/nginx.conf /nginx_conf/default.conf
python3 manage.py migrate
echo yes | python3 manage.py collectstatic
python3 -m gunicorn --reload --workers=4 --timeout 1800 --bind 0.0.0.0:8000 project.wsgi

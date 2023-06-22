FROM registry.sandbox/nibuntu/services-22.04:latest

LABEL version=${VERSION}
LABEL repository_name=${REPO_NAME}
LABEL repository_url=${REPO_URL}

USER root

RUN apt-get update \
    && apt-get install -y \
    python3-pip \
    mysql-client \
    libmysqlclient-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /pipeman && \
    chown ${USER}:${USER} /pipeman && \
    cd /pipeman && \
    rm -rf ./*


COPY --chown=${USER}:${USER} . /pipeman/

USER ${USER}

RUN cd /pipeman && \
    pip3 install wheel && \
    pip3 install gunicorn && \
    pip3 install -r requirements.txt && \
    cp docker/.env project/.env && \
    chmod +x /pipeman/docker/run_pipeman.sh

WORKDIR /pipeman

VOLUME ["/pipeman/assets"]

EXPOSE  8000

CMD [ "/pipeman/docker/run_pipeman.sh" ]

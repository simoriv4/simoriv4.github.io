FROM registry.lanni/nibuntu/base-22.04:latest

USER root

RUN apt-get update && \
    apt-get install -y python3 \
    python3-pip \
    wget && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


COPY . /pippolina

RUN cd /pippolina && \
    pip3 install -r requirements.txt && \
    pip install -e .

RUN wget http://installers.sandbox/rootca.crt && \
    cp rootca.crt /usr/local/share/ca-certificates && \
    update-ca-certificates

CMD [ "bash" ]

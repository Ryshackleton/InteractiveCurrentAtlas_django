# From here: https://docs.docker.com/v1.5/compose/django/
# This sets up a docker image with ONLY python installed (e.g. not a full linux server)
# then runs the django app server from that image
FROM python:2.7
ENV PYTHONUNBUFFERED 1
RUN mkdir /icsSource
WORKDIR /icsSource
ADD requirements.txt /icsSource/
RUN pip install -r requirements.txt
ADD . /icsSource/

FROM python:2.7
ENV PYTHONUNBUFFERED 1
RUN mkdir /icsSource
WORKDIR /icsSource
ADD requirements.txt /icsSource/
RUN pip install -r requirements.txt
ADD . /icsSource/

FROM mcr.microsoft.com/powershell:6.2.3-alpine-3.8

ENV SCOOP_HOME /scoop/apps/scoop/current
ENV SCOOP_DEBUG 1
ENV PATH $PATH:$SCOOP_HOME/bin

RUN apk add --no-cache git p7zip \
    && mkdir -p $SCOOP_HOME \
    && git clone https://github.com/lukesampson/scoop.git $SCOOP_HOME

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
FROM alpine

RUN apk update && \
    apk upgrade && \
    apk add git && \
    apk add go && \
    apk add jq && \
    apk add nodejs npm && \
    apk add make && \
    git clone https://github.com/cli/cli.git gh-cli && \
    cd gh-cli && \
    make && \
    mv ./bin/gh /usr/local/bin/

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
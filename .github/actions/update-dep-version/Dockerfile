FROM alpine

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git go jq nodejs npm make && \
    git clone --depth=1 https://github.com/cli/cli.git gh-cli && \
    cd gh-cli && \
    make && \
    mv ./bin/gh /usr/local/bin/

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

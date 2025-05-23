FROM ccr.ccs.tencentyun.com/webankpartners/alpine-base:v1.0

ENV BASE_HOME=/app/taskman

RUN mkdir -p $BASE_HOME $BASE_HOME/conf $BASE_HOME/logs $BASE_HOME/public

ADD build/start.sh $BASE_HOME/
ADD build/stop.sh $BASE_HOME/
ADD build/default.json $BASE_HOME/conf/
ADD taskman-server/taskman-server $BASE_HOME/
ADD taskman-server/public/index.html $BASE_HOME/public/
ADD taskman-server/conf/i18n $BASE_HOME/conf/i18n/
ADD taskman-server/conf/menu-api-map.json $BASE_HOME/conf/

WORKDIR $BASE_HOME
ENTRYPOINT ["/bin/sh", "start.sh"]
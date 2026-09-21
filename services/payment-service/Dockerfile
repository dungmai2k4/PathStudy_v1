FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

RUN chown -R appuser:appgroup /app
USER appuser

ENV JAVA_OPTS="-XX:+UseSerialGC -Xms96m -Xmx256m -XX:MaxMetaspaceSize=128m"
EXPOSE 8087

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]

FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

RUN chown -R appuser:appgroup /app
USER appuser

ENV JAVA_OPTS="-XX:+UseSerialGC -Xms64m -Xmx192m -XX:MaxMetaspaceSize=96m"
EXPOSE 8761

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]

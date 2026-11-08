FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /build

COPY fastcgi-lib.jar .
RUN mvn -q install:install-file \
      -Dfile=fastcgi-lib.jar \
      -DgroupId=com.fastcgi -DartifactId=fastcgi-lib \
      -Dversion=1.0 -Dpackaging=jar

COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /build/target/server.jar /app/server.jar

ENV FCGI_PORT=24001
EXPOSE 24001

CMD ["java", "-DFCGI_PORT=24001", "-jar", "server.jar"]
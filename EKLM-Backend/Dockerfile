FROM maven:3.8.6-eclipse-temurin-17 AS build
RUN mkdir /project
COPY . /project
WORKDIR /project
RUN mvn clean package -DskipTests


FROM openjdk:17-jdk-alpine

# Create new group 'spring' and new user 'spring'
RUN addgroup -S spring && adduser -S spring -G spring

# Create directory /app
RUN mkdir /app

# Change working dir
WORKDIR /app

#ARG JAR_FILE=target/*.jar
#COPY ${JAR_FILE} app.jar

# Copy compiled jar from build container into current container:
COPY --from=build /project/target/*.jar /app/spring-boot-server.jar

# Copy application properties
COPY application.properties application.properties

RUN chown -R spring:spring /app

# Switch to user 'spring'
USER spring:spring


# Define the entrypoint:
ENTRYPOINT ["java","-jar","/app/spring-boot-server.jar"]

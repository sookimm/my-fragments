# Dockerfile for Fragments Microservice

# Use node version 22.1.0
FROM node:22.1.0

LABEL maintainer="Sooyeon Kim <skim499@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY ./src ./src

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD npm start


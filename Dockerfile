# Dockerfile for Fragments Microservice

# First stage: Build the application
FROM node:22.1.0 AS build

LABEL maintainer="Sooyeon Kim <skim499@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Use /app as our working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Second stage: Create the runtime image
FROM node:22.1.0

# We default to use port 8080 in our service
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app .

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]

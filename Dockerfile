FROM node:15.1-alpine
RUN apk add --no-cache python make g++

# Make the 'app' folder the current working directory.
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy both 'package.json' and 'package-lock.json' (if available)
COPY package.json ./
COPY package-lock.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . ./

# Create a build
RUN npm run build
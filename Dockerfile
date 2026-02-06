# Use Node.js base image
FROM node:16-slim

# Set working directory
WORKDIR /app

# 1. Provide an ARG so we can tell Docker which service to build
ARG SERVICE_NAME

# 2. Copy the package.json from the specific service folder
COPY ${SERVICE_NAME}/package*.json ./

# 3. Install dependencies
RUN npm install

# 4. Copy the specific service code
COPY ${SERVICE_NAME}/ .

# Expose a common port (you can change this per service if needed)
EXPOSE 5000

# Start the service
CMD ["npm", "start"]
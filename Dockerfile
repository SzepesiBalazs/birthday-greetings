# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies (including Jest)
RUN npm install

# Copy the rest of the project
COPY . .

# Default command
CMD ["npm", "test"]

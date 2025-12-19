# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads/pets uploads/profiles

# Expose port
EXPOSE 5000

# Set environment to production by default
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]

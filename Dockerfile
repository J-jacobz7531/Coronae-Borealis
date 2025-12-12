FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app with explicit webpack flag
RUN npm run build -- --webpack

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
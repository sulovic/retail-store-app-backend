# Use the official Node.js image as the base image
# Choose a specific version for better stability
FROM node:20-alpine

# Install necessary libraries (including OpenSSL)
RUN apk add --no-cache openssl

# Install PM2 globally
RUN npm install -g pm2

# Set the working directory inside the container
WORKDIR /usr/src/app

# Accept build arguments and set them as environment variables
ARG DATABASE_RETAILSTORE_URL
ENV DATABASE_RETAILSTORE_URL=$DATABASE_RETAILSTORE_URL

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run the build step
RUN npm run build

# Expose the application port (replace 3000 with your app's port)
EXPOSE 5999

# Define the command to start the app
CMD ["pm2-runtime", "./dist/server.js", "--name", "retail-store-app-backend"]
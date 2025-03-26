# Use the official Node.js image as the base image
# Choose a specific version for better stability
FROM node:20-alpine

# Install necessary libraries (including OpenSSL)
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install && npm install nodemon --save-dev

# Copy the rest of the application code to the container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run the build step
RUN npm run build

# Expose the application port (replace 3000 with your app's port)
EXPOSE 5999

# Define the command to start the app
CMD ["npm", "start"]
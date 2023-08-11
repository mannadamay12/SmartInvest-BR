# Use the official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install
RUN npm i cors body-parser mongoose qrcode
# Copy the rest of the application code to the container
COPY . .

# Expose port 4242 for the Express.js server
EXPOSE 4242

# Start the Express.js server
CMD ["node", "server.js"]

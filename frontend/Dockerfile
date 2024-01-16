# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory to /frontend
WORKDIR /frontend

# Copy the current directory contents into the container at /frontend
COPY . /frontend

# Install any needed packages specified in package.json
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run on startup
CMD ["npm", "start"]

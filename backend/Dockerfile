# Use the official Python image with version 3.11 as the base image
FROM python:3.11

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /backend

# Copy the requirements file to the container
COPY requirements.txt /backend/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django application code to the container
COPY . /backend/

# Expose the port the app runs on
EXPOSE 8000

# Command to run your application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

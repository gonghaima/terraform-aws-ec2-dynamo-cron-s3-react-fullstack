#!/bin/bash

# Variables
S3_BUCKET="my-app-deployment-bucket-123e4567-e89b-12d3-a456-426614174000"
ZIP_FILE="Backend.zip"
DEST_DIR="/home/ec2-user"

# Update and install dependencies
sudo yum update -y
sudo yum install -y git unzip

# Install Node.js and npm (Node.js 20)
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Download the backend code from S3
aws s3 cp s3://$S3_BUCKET/$ZIP_FILE /home/ec2-user/
if [ $? -ne 0 ]; then
  echo "Failed to download the zip file from S3!"
  exit 1
fi

# Unzip the backend code
unzip -o /home/ec2-user/$ZIP_FILE -d /home/ec2-user/
if [ $? -ne 0 ]; then
  echo "Failed to unzip the backend code!"
  exit 1
fi

# Set correct permissions
sudo chown -R ec2-user:ec2-user $DEST_DIR
sudo chmod -R 755 $DEST_DIR

# Change directory to the project folder
cd $DEST_DIR

# Install npm dependencies
npm install
if [ $? -ne 0 ]; then
  echo "Failed to install npm dependencies!"
  exit 1
fi

# Install type declarations for express
npm install --save-dev @types/express
if [ $? -ne 0 ]; then
  echo "Failed to install type declarations for express!"
  exit 1
fi

# Start the application using nodemon
npm run nodemon-start
if [ $? -ne 0 ]; then
  echo "Failed to start the application using nodemon!"
  exit 1
fi
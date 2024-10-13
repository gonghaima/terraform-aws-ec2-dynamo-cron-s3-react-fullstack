@echo off
setlocal

:: Variables
set S3_BUCKET=my-app-deployment-bucket-123e4567-e89b-12d3-a456-426614174000
set ZIP_FILE=Backend.zip
set KEY_PATH=C:\Users\Steven\Downloads\Dario\Cloud-a2\my-ec2-key.pem
set INSTANCE_IP=13.210.73.97

:: Debugging output
echo S3_BUCKET=%S3_BUCKET%
echo ZIP_FILE=%ZIP_FILE%
echo KEY_PATH=%KEY_PATH%
echo INSTANCE_IP=%INSTANCE_IP%

:: Ensure the Backend directory exists
if not exist Backend (
  echo Backend directory not found!
  exit /b 1
)

:: Zip the backend code
cd Backend
powershell -Command "Compress-Archive -Path * -DestinationPath ..\%ZIP_FILE% -Force"
if %errorlevel% neq 0 (
  echo Failed to zip the backend code!
  exit /b 1
)
cd ..

:: Debugging output
echo Zipped the backend code successfully.

:: Upload the backend code and deployment script to S3
aws s3 cp %ZIP_FILE% s3://%S3_BUCKET%
if %errorlevel% neq 0 (
  echo Failed to upload the zip file to S3!
  exit /b 1
)
aws s3 cp Backend\deploy.sh s3://%S3_BUCKET%
if %errorlevel% neq 0 (
  echo Failed to upload the deploy script to S3!
  exit /b 1
)

:: Debugging output
echo Uploaded the backend code and deploy script to S3 successfully.

:: Attempt to SSH into the EC2 instance and trigger the deployment
echo Attempting to SSH into the EC2 instance...
ssh -i %KEY_PATH% ec2-user@%INSTANCE_IP% "aws s3 cp s3://%S3_BUCKET%/deploy.sh /home/ec2-user/deploy.sh && chmod +x /home/ec2-user/deploy.sh && /home/ec2-user/deploy.sh"
if %errorlevel% neq 0 (
  echo Failed to SSH into the EC2 instance and trigger the deployment!
  exit /b 1
)

:: Debugging output
echo Deployment triggered successfully.

endlocal
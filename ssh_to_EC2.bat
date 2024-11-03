@echo off
setlocal

:: Variables
set S3_BUCKET=my-app-deployment-bucket-123e4567-e89b-12d3-a456-426614174000
set ZIP_FILE=Backend.zip
set KEY_PATH=C:\Users\Steven\Downloads\Dario\Cloud-a2\my-ec2-key.pem
@REM set INSTANCE_IP=13.210.73.97
set INSTANCE_IP=3.106.129.127
set HOSTNAME=ec2-3-106-129-127.ap-southeast-2.compute.amazonaws.com

:: Debugging output
echo S3_BUCKET=%S3_BUCKET%
echo ZIP_FILE=%ZIP_FILE%
echo KEY_PATH=%KEY_PATH%
echo INSTANCE_IP=%INSTANCE_IP%
echo HOSTNAME=%HOSTNAME%

@REM aws s3 cp Backend\deploy.sh s3://%S3_BUCKET%

:: Remove old host key
echo Removing old host key...
ssh-keygen -R %HOSTNAME%
ssh-keygen -R %INSTANCE_IP%

:: Attempt to SSH into the EC2 instance and trigger the deployment
echo Attempting to SSH into the EC2 instance...
ssh -i %KEY_PATH% ec2-user@%HOSTNAME%
if %errorlevel% neq 0 (
  echo Failed to SSH into the EC2 instance and trigger the deployment!
  exit /b 1
)

:: Debugging output
echo SSH triggered successfully.

endlocal
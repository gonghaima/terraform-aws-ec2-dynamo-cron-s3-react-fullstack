## install terraform
https://developer.hashicorp.com/terraform/install

download / unzip / add path
verify by
terraform --version

## Install AWS CLI
https://aws.amazon.com/cli/

verify
aws --version

Configure AWS CLI with your AWS credentials
aws configure
    - generate key/secret from top right corner, click on your username or profile picture, create one

## Provision resources
##### Create main.tf
- find out AMI ID and update
  - Go to the AWS Management Console.
  - Navigate to the EC2 Dashboard.
  - Click on "Launch Instance".
  - In the "Choose an Amazon Machine Image (AMI)" section, find an appropriate AMI (e.g., Amazon Linux 2).
- generate an unique s3 bucket name, update main.tf
- check ensure deploy.sh has the same s3 name
  
##### run "terraform init"
##### run "trraform plan"

## Backend
#### setup a basic node/express/typescript app
#### verify

## Backend deploy
update deploy.sh
 - KEY_PATH
 - INSTANCE_IP
create .pem file
```s
Open the Amazon EC2 Console: Go to the Amazon EC2 Console.

Navigate to Key Pairs: In the left-hand navigation pane, under "Network & Security," click on "Key Pairs."

Create a New Key Pair:

Click on the "Create key pair" button.
Enter a name for your key pair (e.g., my-ec2-key).
Choose the file format (PEM for Linux/Mac, PPK for Windows).
Click on the "Create key pair" button.
Download the Key Pair: The key pair file (e.g., my-ec2-key.pem) will be automatically downloaded to your computer. Save this file in a secure location.
```

check aws EC2, 
select key pair, 
select security group - web_sg
launch the instance with the keyfile specified

in powershell, at rootlevel, run   ./deploy_to_s3.bat

ssh into EC2,
ssh -i C:/Users/Steven/Downloads/Dario/Cloud-a2/my-ec2-key.pem ec2-user@13.210.73.97

run aws config , export all keys

aws s3 cp s3://my-app-deployment-bucket-123e4567-e89b-12d3-a456-426614174000/deploy.sh /home/ec2-user/deploy.sh
aws s3 cp s3://my-app-deployment-bucket-123e4567-e89b-12d3-a456-426614174000/Backend.zip /home/ec2-user/Backend.zip

chmod +x /home/ec2-user/deploy.sh

sudo chown -R ec2-user:ec2-user /home/ec2-user
sudo chmod -R 755 /home/ec2-user

/home/ec2-user/deploy.sh

logs file locatoin    cd ~/.pm2/logs
rm backend-app-out.log backend-app-error.log

#### Add inbound rules
Go to the AWS Management Console.
Navigate to EC2 > Instances.
Select your instance and click on the "Security" tab.
Click on the security group associated with your instance.
Ensure there is an inbound rule allowing traffic on port 3000 (or the port your application is running on) from your IP address or from anywhere (0.0.0.0/0) for testing purposes.

#### Verify
 curl http://13.210.73.97:3000/login/1

## Frontend

#### Setup
```cmd
npm create vite@latest Frontend --template react
cd Frontend
npm install
```

#### update terraform - add frontend part

check diff in commit history
update and apply

#### deploy
npm i
npm run build
aws s3 sync Frontend/dist/ s3://frontend-app-bucket-123e4567-e89b-12d3-a456-426614174090/


## Trouble shooting
if api call fails, check
- IP changed for the instance
- SSH into the server, check if the nodemon is running.














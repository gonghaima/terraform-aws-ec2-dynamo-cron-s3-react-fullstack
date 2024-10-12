## install terraform
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
  
##### run "terraform init"
##### run "trraform plan"



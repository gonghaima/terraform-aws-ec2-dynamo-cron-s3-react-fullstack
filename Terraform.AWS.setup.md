# Terraform Setup with AWS on Windows

## Prerequisites

1. **Install Terraform**
   - Download Terraform from the [official website](https://www.terraform.io/downloads.html).
   - Add the `terraform.exe` to your system's `PATH` to make it accessible from the command line.

2. **Install AWS CLI**
   - Download and install the AWS CLI from the [official website](https://aws.amazon.com/cli/).
   - Verify installation:
     ```bash
     aws --version
     ```

3. **Create AWS Access Keys**
   - Sign in to your [AWS Management Console](https://aws.amazon.com/).
   - Navigate to **IAM > Users** and select your user.
   - Under the **Security Credentials** tab, click **Create access key**.
   - Store the `Access Key ID` and `Secret Access Key` securely.

4. **Configure AWS CLI**
   ```bash
   aws configure

## Setup Terraform
1. **Create a new directory for your Terraform project:**
   
     ```bash
     mkdir terraform-aws-project
    cd terraform-aws-project
     ```
2. **Create a main.tf file with the following content:**
   
    ```bash
        provider "aws" {
            region = "ap-southeast-2"  # Replace with your preferred region
        }

        resource "aws_instance" "example" {
            ami = "ami-0c55b159cbfafe1f0"  # Replace with your desired AMI ID
            instance_type = "t2.micro"

            tags = {
                Name = "TerraformExampleInstance"
            }
        }
    ```
## Initialize Terraform
**To initialize Terraform, run the following command in your project directory:**
```bash
     terraform init
```
This command downloads the necessary provider plugins (in this case, AWS) and sets up your local workspace.

## Apply the Terraform Configuration
**Once your configuration is ready, apply it to provision the AWS resources.**
```bash
terraform plan
terraform apply
```
The terraform plan command lets you review the actions Terraform will take without actually making any changes. If everything looks good, terraform apply provisions the resources.

## Destroying Resources
```bash
terraform destroy
```
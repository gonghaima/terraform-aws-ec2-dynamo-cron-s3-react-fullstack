provider "aws" {
  region = "ap-southeast-2"
}

resource "aws_dynamodb_table" "login" {
  name           = "login-table"
  hash_key       = "id"
  billing_mode   = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "login-table"
  }
}

resource "aws_dynamodb_table" "music" {
  name           = "music-table"
  hash_key       = "id"
  billing_mode   = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "music-table"
  }
}

resource "aws_iam_role" "ec2_role" {
  name = "ec2_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "ec2-role"
  }
}

resource "aws_iam_role_policy" "ec2_policy" {
  name = "ec2_policy"
  role = aws_iam_role.ec2_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:*",
          "s3:GetObject"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_instance" "web" {
  ami           = "ami-0cf70e1d861e1dfb8" # Amazon Linux 2 AMI
  instance_type = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  security_groups = [aws_security_group.web_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              echo "Running deployment script"
              aws s3 cp s3://my-app-deployment-bucket-123e4567-e89b-12d3-a456-426614174000/deploy.sh /home/ec2-user/deploy.sh
              chmod +x /home/ec2-user/deploy.sh
              /home/ec2-user/deploy.sh
              EOF

  tags = {
    Name = "web-server"
  }
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2_profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_security_group" "web_sg" {
  name        = "web_sg"
  description = "Allow SSH and HTTP"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-sg"
  }
}

resource "aws_s3_bucket" "deployment_bucket" {
  bucket = "my-app-deployment-bucket-123e4567-e89b-12d3-a456-426614174000"

  tags = {
    Name = "deployment-bucket"
  }
}

output "instance_public_ip" {
  description = "The public IP of the web server instance"
  value       = aws_instance.web.public_ip
}
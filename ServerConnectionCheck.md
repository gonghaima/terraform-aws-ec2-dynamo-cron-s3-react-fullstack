If nodemon is running on your EC2 instance but you cannot connect to it via the public IP address, there are a few common issues to check:

Security Group Configuration: Ensure that the security group associated with your EC2 instance allows inbound traffic on the port your application is running on (e.g., port 3000).

Application Binding: Ensure that your application is binding to the correct network interface. It should bind to 0.0.0.0 to be accessible from outside the EC2 instance.

Firewall Settings: Ensure that there are no firewall rules on the EC2 instance itself blocking the traffic.

Step-by-Step Solution
Check Security Group Configuration: Ensure that your security group allows inbound traffic on port 3000 (or the port your application is running on).

Go to the AWS Management Console.
Navigate to EC2 > Instances.
Select your instance and click on the "Security" tab.
Click on the security group associated with your instance.
Ensure there is an inbound rule allowing traffic on port 3000 (or the port your application is running on) from your IP address or from anywhere (0.0.0.0/0) for testing purposes.
Ensure Application is Binding to 0.0.0.0: Ensure that your application is binding to 0.0.0.0 to accept connections from any IP address.

src/index.ts:
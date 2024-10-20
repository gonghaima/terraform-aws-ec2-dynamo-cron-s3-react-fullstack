import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { User } from '../models/loginModel';

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = "login-table";

export const getUser = async (id: string): Promise<User | undefined> => {
    const params = {
        TableName: tableName,
        Key: { id },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        return data.Item as User;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not retrieve user");
    }
};

export const createUser = async (user: User): Promise<User> => {
    const params = {
        TableName: tableName,
        Item: user,
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        return user;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not create user");
    }
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    const params = {
        TableName: tableName,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email,
        },
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        if (data.Items && data.Items.length > 0) {
            const user = data.Items[0] as User;
            if (user.password === password) {
                return user;
            }
        }
        return null;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not authenticate user");
    }
};
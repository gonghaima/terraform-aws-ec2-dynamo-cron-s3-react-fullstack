import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/userModel';
import { Music } from "../models/musicModel";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const loginTable = "login-table";
const musicTable = "music-table";

export const getUser = async (id: string): Promise<User | undefined> => {
    const params = {
        TableName: loginTable,
        Key: { id },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        const user = data.Item as User;

        if (user && user.subscriptions && user.subscriptions.length > 0) {
            const musicParams = {
                RequestItems: {
                    [musicTable]: {
                        Keys: user.subscriptions.map(musicId => ({ id: musicId })),
                    },
                },
            };

            const musicData = await ddbDocClient.send(new BatchGetCommand(musicParams));
            console.log("Music data", musicData);
            user.subscriptionsData = musicData?.Responses?.[musicTable] ? musicData.Responses[musicTable] as Music[] : [];
        }

        console.log(user.subscriptionsData)

        return user;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not retrieve user");
    }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    // Check if the email already exists
    const checkEmailParams = {
        TableName: loginTable,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": user.email,
        },
    };

    try {
        const emailCheckData = await ddbDocClient.send(new ScanCommand(checkEmailParams));
        if (emailCheckData.Items && emailCheckData.Items.length > 0) {
            throw new Error("The email already exists");
        }
    } catch (err) {
        console.error("Error checking email", err);
        throw new Error("Could not check email");
    }

    // Proceed with creating the user
    const id = uuidv4();
    const newUser = { ...user, id, subscriptions: [] };

    const params = {
        TableName: loginTable,
        Item: newUser,
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        return newUser;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not create user");
    }
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    const params = {
        TableName: loginTable,
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

export const addSubscription = async (userId: string, musicId: string): Promise<void> => {
    const user = await getUser(userId);
    if (!user) {
        throw new Error("User not found");
    }

    if (user.subscriptions && user.subscriptions.includes(musicId)) {
        // Subscription already exists, no need to add
        return;
    }

    const params = {
        TableName: loginTable,
        Key: { id: userId },
        UpdateExpression: "SET subscriptions = list_append(if_not_exists(subscriptions, :empty_list), :musicId)",
        ExpressionAttributeValues: {
            ":musicId": [musicId],
            ":empty_list": [],
        },
    };

    try {
        await ddbDocClient.send(new UpdateCommand(params));
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not add subscription");
    }
};

export const removeSubscription = async (userId: string, musicId: string): Promise<void> => {
    const user = await getUser(userId);
    if (!user || !user.subscriptions) {
        throw new Error("User or subscriptions not found");
    }

    const updatedSubscriptions = user.subscriptions.filter(id => id !== musicId);

    const params = {
        TableName: loginTable,
        Key: { id: userId },
        UpdateExpression: "SET subscriptions = :updatedSubscriptions",
        ExpressionAttributeValues: {
            ":updatedSubscriptions": updatedSubscriptions,
        },
    };

    try {
        await ddbDocClient.send(new UpdateCommand(params));
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not remove subscription");
    }
};
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Music } from '../models/musicModel';

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = "music-table";

export const getMusic = async (id: string): Promise<Music | undefined> => {
    const params = {
        TableName: tableName,
        Key: { id },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        return data.Item as Music;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not retrieve music");
    }
};

export const createMusic = async (music: Music): Promise<Music> => {
    const params = {
        TableName: tableName,
        Item: music,
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        return music;
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not create music");
    }
};
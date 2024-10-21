import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Music } from '../models/musicModel';

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const musicTable = "music-table";

export const getMusic = async (id: string): Promise<Music | undefined> => {
    const params = {
        TableName: musicTable,
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
        TableName: musicTable,
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

export const queryMusic = async (title?: string, artist?: string, year?: string): Promise<Music[]> => {
    let filterExpression = '';
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

    if (title) {
        filterExpression += '#title = :title';
        expressionAttributeValues[':title'] = title;
        expressionAttributeNames['#title'] = 'title';
    }

    if (artist) {
        if (filterExpression) filterExpression += ' AND ';
        filterExpression += '#artist = :artist';
        expressionAttributeValues[':artist'] = artist;
        expressionAttributeNames['#artist'] = 'artist';
    }

    if (year) {
        if (filterExpression) filterExpression += ' AND ';
        filterExpression += '#year = :year';
        expressionAttributeValues[':year'] = year;
        expressionAttributeNames['#year'] = 'year';
    }

    const params = {
        TableName: musicTable,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        return data.Items as Music[];
    } catch (err) {
        console.error("Error", err);
        throw new Error("Could not query music");
    }
};
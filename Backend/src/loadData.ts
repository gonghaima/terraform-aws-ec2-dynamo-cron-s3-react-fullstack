import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = "music-table";
const BATCH_SIZE = 25;

const loadData = async () => {
    const filePath = path.join(__dirname, '../data/a2.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log("File Content:", fileContent); // Debugging statement
    const jsonData = JSON.parse(fileContent);
    console.log("Parsed JSON Data:", jsonData); // Debugging statement

    const items = jsonData.songs;
    console.log("Parsed Items:", items); // Debugging statement

    if (!Array.isArray(items)) {
        throw new Error("JSON content is not an array");
    }

    const putRequests = items.map((item: any) => {
        const id = uuidv4();
        const title = item.title || "Unknown Title";
        const artist = item.artist || "Unknown Artist";
        const year = item.year || "Unknown Year";
        const web_url = item.web_url || "Unknown URL";
        const img_url = item.img_url || "Unknown Image URL";

        return {
            PutRequest: {
                Item: {
                    id,
                    title,
                    artist,
                    year,
                    web_url,
                    img_url
                }
            }
        };
    });

    // Function to chunk array into smaller arrays of specified size
    const chunkArray = (array: any[], size: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const chunks = chunkArray(putRequests, BATCH_SIZE);

    for (const chunk of chunks) {
        const params = {
            RequestItems: {
                [tableName]: chunk
            }
        };

        try {
            const data = await ddbDocClient.send(new BatchWriteCommand(params));
            console.log("Batch loaded successfully:", data);
        } catch (err) {
            console.error("Error loading batch:", err);
        }
    }
};

loadData();
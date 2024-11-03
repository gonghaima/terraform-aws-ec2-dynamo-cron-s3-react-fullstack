import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { processImages } from './uploadImage'; // Import the processImages function

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = "music-table";
const BATCH_SIZE = 25;

const scanTable = async () => {
    const params = {
        TableName: tableName
    };

    const data = await ddbDocClient.send(new ScanCommand(params));
    return data.Items || [];
};

const updateDynamoDB = async () => {
    const keyValueMap = await processImages(); // Use the result from processImages
    const items = await scanTable();

    const updateRequests = items.map((item: any) => {
        const originalUrl = item.img_url;
        const newUrl = keyValueMap[originalUrl];

        if (newUrl) {
            return {
                PutRequest: {
                    Item: {
                        ...item,
                        img_url: newUrl
                    }
                }
            };
        }
        return null;
    }).filter(request => request !== null);

    // Function to chunk array into smaller arrays of specified size
    const chunkArray = (array: any[], size: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const chunks = chunkArray(updateRequests, BATCH_SIZE);

    for (const chunk of chunks) {
        const params = {
            RequestItems: {
                [tableName]: chunk
            }
        };

        try {
            const data = await ddbDocClient.send(new BatchWriteCommand(params));
            console.log("Batch updated successfully:", data);
        } catch (err) {
            console.error("Error updating batch:", err);
        }
    }
};

updateDynamoDB();
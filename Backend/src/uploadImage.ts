import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3({
    region: 'ap-southeast-2',
});

const bucketName = 'frontend-app-bucket-123e4567-e89b-12d3-a456-426614174090';

const getUniqueImageUrls = async () => {
    const filePath = path.join(__dirname, '../data/a2.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    const items = jsonData.songs;

    if (!Array.isArray(items)) {
        throw new Error("JSON content is not an array");
    }

    const imgUrls = items.map((item: any) => item.img_url || "Unknown Image URL");
    const uniqueImgUrls = Array.from(new Set(imgUrls));

    return uniqueImgUrls;
};

const downloadImage = async (url: string): Promise<Buffer> => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
};

const uploadToS3 = async (buffer: Buffer, key: string): Promise<string> => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg' // Adjust the content type as needed
    };

    await s3.upload(params).promise();
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
};

const checkIfExistsInS3 = async (key: string): Promise<boolean> => {
    const params = {
        Bucket: bucketName,
        Key: key
    };

    try {
        await s3.headObject(params).promise();
        return true;
    } catch (error) {
        if ((error as any).code === 'NotFound') {
            return false;
        }
        throw error;
    }
};

export const processImages = async () => {
    const uniqueImgUrls = await getUniqueImageUrls();
    const urlMap: { [key: string]: string } = {};

    for (const url of uniqueImgUrls) {
        try {
            const key = `images/${uuidv4()}.jpg`; // Adjust the key format as needed

            if (await checkIfExistsInS3(key)) {
                const s3Url = `https://${bucketName}.s3.amazonaws.com/${key}`;
                urlMap[url] = s3Url;
                console.log(`Image already exists in S3: ${s3Url}`);
            } else {
                const imageBuffer = await downloadImage(url);
                const s3Url = await uploadToS3(imageBuffer, key);
                urlMap[url] = s3Url;
                console.log(`Image uploaded to S3: ${s3Url}`);
            }
        } catch (error) {
            console.error(`Failed to process image ${url}:`, error);
        }
    }

    console.log("URL Map:", urlMap);
    return urlMap;
};

// Uncomment the following line if you want to run this script directly
// processImages();

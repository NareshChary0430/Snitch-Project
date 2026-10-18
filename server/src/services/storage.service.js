import ImageKit from '@imagekit/nodejs';
import config from '../config/config.js';

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});


export async function uploadFile({buffer,fileName}){
    const response = await client.upload({
        file: await toFile(buffer), // or file: fs.createReadStream("filePath")
        fileName: fileName,
        folder: "snitch-project" // optional
    });
    return response;
}


import express from 'express';
import AWS from 'aws-sdk';
import formidable from 'formidable';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

dotenv.config({ path: `${__dirname}/../.env` });
const app = express();

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_ACCESS_SECRET;
const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;
const port = process.env.PORT || 5000;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
});

const parseFormData = async (req) => {
  const form = new formidable.IncomingForm();
  const data = new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ err, fields, files });
    });
  });
  return data;
};

const uploadFile = async (req, res) => {
  // Read content from the file
  const data = await parseFormData(req);

  const fileStream = fs.createReadStream(data.files.image.filepath);

  fileStream.on('error', (err) => console.log('file error', err));

  // Setting up S3 upload parameters
  const params = {
    Bucket: bucket,
    Key: data.files.image.originalFilename, // File name you want to save as in S3
    Body: fileStream,
  };

  // Uploading files to the bucket
  s3.upload(params, async (err, data) => {
    if (err) {
      res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      res.status(200).json({
        error: false.valueOf,
        data: data,
      });
    }
  });
};

app.get('/', (req, res) => {
  res.status(200).send('hello world!');
});

app.post('/', uploadFile);

app.listen(port, () => console.log(`Example app listening on port ${port}`));

import AWS from 'aws-sdk';
import formidable from 'formidable';
import fs from 'fs';

const { AWS_ACCESS_KEY, AWS_ACCESS_SECRET, AWS_BUCKET_NAME, AWS_S3_REGION } = process.env;

const accessKeyId = AWS_ACCESS_KEY;
const secretAccessKey = AWS_ACCESS_SECRET;
const bucket = AWS_BUCKET_NAME;
const region = AWS_S3_REGION;

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

const uploadImage = async (req, res) => {
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

  console.log(AWS_ACCESS_KEY, AWS_ACCESS_SECRET, AWS_BUCKET_NAME, AWS_S3_REGION);

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

export { uploadImage };

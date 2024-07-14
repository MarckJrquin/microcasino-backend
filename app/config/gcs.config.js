
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Configura tu clave de servicio JSON
const storage = new Storage({
    keyFilename: path.join(__dirname, process.env.GOOGLE_CLOUD_KEYFILE),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

module.exports = {
    bucket,
    storage
};
require("dotenv").config();

const credentials = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};

const bucketCredentials = {
  signatureVersion: process.env.SIGNATURE_VERSION,
  apiVersion: process.env.API_VERSION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

const jwtSecretKey = process.env.JWT_SECRET_KEY;

exports.credentials = credentials;
exports.jwtSecretKey = jwtSecretKey;
exports.bucketCredentials = bucketCredentials;

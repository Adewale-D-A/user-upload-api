require("dotenv").config();

const credentials = {
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
};

const bucketCredentials = {
  signatureVersion: process.env.signatureVersion,
  apiVersion: process.env.apiVersion,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};

const jwtSecretKey = process.env.jwtSecretKey;

exports.credentials = credentials;
exports.jwtSecretKey = jwtSecretKey;
exports.bucketCredentials = bucketCredentials;

const credentials = {
  accessKeyId: "AKIA3FHTGZ4UBQMKVMOG",
  secretAccessKey: "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",
  region: "us-east-1",
};

const bucketCredentials = {
  signatureVersion: "v4",
  apiVersion: "2006-03-01",
  accessKeyId: "AKIA3FHTGZ4UBQMKVMOG",
  secretAccessKey: "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",
};

const jwtSecretKey = "AKIA3FHTGZ4UBQMKVMOG";

exports.credentials = credentials;
exports.jwtSecretKey = jwtSecretKey;
exports.bucketCredentials = bucketCredentials;

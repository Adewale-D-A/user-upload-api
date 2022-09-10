const AWS = require("aws-sdk");
const { bucketCredentials } = require("../config");

const s3 = new AWS.S3(bucketCredentials);

//presigned url for get object
const presignedGETurl = (bucket_name, filename, expire) => {
  const signedURL = s3.getSignedUrl("getObject", {
    Bucket: bucket_name,
    Key: filename, //filename
    Expires: expire, //time to expire in seconds
  });
  return signedURL;
};

//get presigned url for PUT method
const presignedPUTurl = (bucket_name, filename, expire) => {
  const signedURL = s3.getSignedUrl("putObject", {
    Bucket: bucket_name,
    Key: filename, //filename
    Expires: expire, //time to expire in seconds
  });
  return signedURL;
};

//delete a file from bucket
const deleteObject = (bucket_name, filename) => {
  s3.deleteObject(
    {
      Bucket: bucket_name,
      Key: filename, //filename
    },
    (err, data) => {
      if (err) {
        console.log("coming from error", err);
      }
      if (data) {
        console.log("coming from data", data);
      }
    }
  );
};

exports.presignedGETurl = presignedGETurl;
exports.presignedPUTurl = presignedPUTurl;
exports.deleteObject = deleteObject;

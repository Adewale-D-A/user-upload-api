const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

const { credentials, jwtSecretKey } = require("../config");

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

const { presignedGETurl } = require("../BucketFunctions/S3BucketMethods");

router.get("/getAllItems", (req, res) => {
  const requestToken = req.cookies.token;

  if (!requestToken) {
    res.status(400).send({
      success: false,
      message: "please log in, your access credentials has expired",
    });
  }
  if (requestToken) {
    const verify = jwt.verify(requestToken, jwtSecretKey);
    const tableNameSpace = verify.dynamoDBuserTable;
    const userId = verify.id;

    doClient.scan(
      {
        TableName: tableNameSpace,
        //query with specifications uncomment the code below
        // Limit: 2,
        // FilterExpression: "firstname = :this_name",
        // ExpressionAttributeValues: { ":this_name": "John" },
      },
      (err, data) => {
        if (err) {
          // console.log(err);
          res.status(400).send({
            success: false,
            message: "could not retrieve items",
          });
        }
        if (data) {
          let stringifyDataSet = JSON.stringify(data.Items);
          var result = JSON.parse(stringifyDataSet, (key, value) => {
            if (key === "image") {
              const imageUrl = presignedGETurl(
                "node-server-bucket",
                `userUploads/${userId}/${value}`,
                1000 * 60
              );
              return imageUrl;
            } else {
              return value;
            }
          });
          res.status(200).send({
            success: true,
            message: "All items successfully retrieved",
            data: result,
          });
        }
      }
    );
  }
});

module.exports = router;

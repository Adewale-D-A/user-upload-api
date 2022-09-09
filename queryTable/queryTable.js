const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

router.get("/queryItems", (req, res) => {
  doClient.query(
    {
      TableName: "bigquerys",
      KeyConditionExpression: "email = :hkey",
      ExpressionAttributeValues: {
        ":hkey": "351cd6b4-b940-4e8f-84e1-95cdc8885556",
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "item could not be retrieved",
        });
      }
      if (data) {
        console.log(data);
        res.status(200).send({
          success: true,
          message: "item successfully retrieved",
          data: data,
        });
      }
    }
  );
});

module.exports = router;

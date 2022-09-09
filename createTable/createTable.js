const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");
const dynamodb = new AWS.DynamoDB(credentials);

router.post("/createTable", (req, res) => {
  dynamodb.createTable(
    {
      AttributeDefinitions: [
        {
          AttributeName: "Artist",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "Artist",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      TableName: "TableName",
    },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "could not create table",
        });
      }
      if (result) {
        res.status(201).send({
          success: true,
          message: "Table Created successfully",
        });
      }
    }
  );
});

module.exports = router;

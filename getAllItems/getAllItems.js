const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

router.get("/getAllItems", (req, res) => {
  doClient.scan(
    {
      TableName: "bigquerys",
      //query with specifications uncomment the code below
      // Limit: 2,
      // FilterExpression: "firstname = :this_name",
      // ExpressionAttributeValues: { ":this_name": "John" },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "could not retrieve items",
        });
      }
      if (data) {
        console.log(data);
        res.status(200).send({
          success: true,
          message: "All items successfully retrieved",
          data: data,
        });
      }
    }
  );
});

module.exports = router;

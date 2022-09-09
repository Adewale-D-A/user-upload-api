const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

router.patch("/updateItem", (req, res) => {
  doClient.update(
    {
      TableName: "bigquerys",
      Key: {
        email: "d60383c0-80e3-458e-a7bf-822419d77a67",
      },
      UpdateExpression: "set #a = :x, #b = :y",
      ConditionExpression: "email = :MAX",
      ExpressionAttributeNames: { "#a": "age", "#b": "firstname" },
      ExpressionAttributeValues: {
        ":x": "34",
        ":y": "Tracy",
        ":MAX": "d60383c0-80e3-458e-a7bf-822419d77a67",
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "could not update item",
        });
      }
      if (data) {
        console.log(data);
        res.status(200).send({
          success: true,
          message: "item updated successfully",
          data: data,
        });
      }
    }
  );
});

module.exports = router;

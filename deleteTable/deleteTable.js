const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");
const dynamodb = new AWS.DynamoDB(credentials);

router.delete("/deleteTable", (req, res) => {
  dynamodb.deleteTable(
    {
      TableName: "Database",
    },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "could not delete table",
        });
      }
      if (result) {
        res.status(201).send({
          success: true,
          message: "table delted successfully",
        });
      }
    }
  );
});

module.exports = router;

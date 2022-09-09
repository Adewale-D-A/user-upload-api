const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

router.delete("/deleteItem", (req, res) => {
  doClient.delete(
    {
      TableName: "bigquerys",
      Key: {
        email: "351cd6b4-b940-4e8f-84e1-95cdc8885556",
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "could not delete item",
        });
      }
      if (data) {
        console.log(data);
        res.status(200).send({
          success: true,
          message: "item deleted successfully",
          data: data,
        });
      }
    }
  );
});

module.exports = router;

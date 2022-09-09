const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

router.get("/getItem", (req, res) => {
  doClient.get(
    {
      TableName: "bigquerys",
      Key: {
        email: "d60383c0-80e3-458e-a7bf-822419d77a67",
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "could not get item",
        });
      }
      if (data) {
        console.log(data);
        res.status(200).send({
          success: true,
          message: "item gotten from table",
          data: data,
        });
      }
    }
  );
});

module.exports = router;

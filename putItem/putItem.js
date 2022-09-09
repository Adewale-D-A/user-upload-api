const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

const uniqueId = uuidv4();

router.put("/putItem", (req, res) => {
  const inputPayload = req.body;
  const tableNameSpace = "bigquerys";
  const payload = {
    email: uniqueId,
    ...inputPayload,
  };
  doClient.put(
    {
      TableName: tableNameSpace,
      Item: payload,
    },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "could not input new record into DB",
        });
      }
      if (result) {
        res.status(200).send({
          success: true,
          message: "item succesfully inputed into DynamoDB",
          uniqueId,
        });
      }
    }
  );
});

module.exports = router;

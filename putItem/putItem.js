const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

const { credentials, jwtSecretKey } = require("../config");
const doClient = new AWS.DynamoDB.DocumentClient(credentials);

const uniqueId = uuidv4();

router.put("/putItem", (req, res) => {
  const { itemDescription, imageName, requestToken } = req.body;

  // const requestToken = req.cookies.token;
  const verify = jwt.verify(requestToken, jwtSecretKey);
  const tableNameSpace = verify.dynamoDBuserTable;
  const dateTime = new Date().toISOString();

  const payload = {
    id: uniqueId,
    description: itemDescription,
    image: imageName,
    dateCreated: dateTime,
    dateUpdated: dateTime,
  };

  if (itemDescription && imageName) {
    doClient.put(
      {
        TableName: tableNameSpace,
        Item: payload,
      },
      (err, result) => {
        if (err) {
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
  } else {
    res.status(400).send({
      success: false,
      message: "invalid request body",
      data: {
        itemDescription: "sample description",
        imageName: "image to upload",
      },
    });
  }
});

module.exports = router;

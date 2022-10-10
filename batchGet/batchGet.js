const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");
const doClient = new AWS.DynamoDB.DocumentClient(credentials);

router.get("/getAll", (req, res) => {
  const params = {
    RequestItems: {
      ade1: {
        Keys: [
          {
            id: "5b432ea3-5403-4209-a547-fdc9988c991d",
          },
          {
            id: "322d7b58-3cfc-47f8-bf0c-19fbdf26755a",
          },
        ],
      },
      adewale: {
        Keys: [
          {
            id: "5747e779-6cb7-44ed-aa57-178175e243f1",
          },
        ],
      },
    },
  };

  doClient.batchGet(params, (err, data) => {
    if (err) {
      console.log("error");
      res.status(400).send({
        success: false,
        message: "table could not be read",
        data: err,
      });
    }
    if (data) {
      res.status(200).send({
        success: true,
        message: "table items retrieved",
        data: data,
      });
    }
  });
});

module.exports = router;

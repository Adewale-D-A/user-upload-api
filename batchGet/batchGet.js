const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const { credentials } = require("../config");
const doClient = new AWS.DynamoDB.DocumentClient(credentials);

router.get("/getAll", (req, res) => {
  const params = {
    RequestItems: {
      "Table-1": {
        Keys: [
          {
            HashKey: "haskey",
            NumberRangeKey: 1,
          },
        ],
      },
      "Table-2": {
        Keys: [{ foo: "bar" }],
      },
    },
  };

  doClient.batchGet(params, (err, data) => {
    if (err) {
      console.log("error");
    }
    res.status(200).send({
      success: true,
      data: data,
    });
  });
});

module.exports = router;

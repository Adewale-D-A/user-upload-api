const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

const { credentials } = require("./config");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const uniqueId = uuidv4();

const doClient = new AWS.DynamoDB.DocumentClient(credentials);

const dynamodb = new AWS.DynamoDB(credentials);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my dynamoDB Backend");
});

app.post("/createTable", (req, res) => {
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
          uniqueId,
        });
      }
    }
  );
});

app.delete("/deleteTable", (req, res) => {
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

app.put("/putItem", (req, res) => {
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

app.get("/getItem", (req, res) => {
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

app.get("/getAllItems", (req, res) => {
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

app.get("/queryItems", (req, res) => {
  doClient.query(
    {
      TableName: "bigquerys",
      KeyConditionExpression: "email = :hkey",
      ExpressionAttributeValues: {
        ":hkey": "351cd6b4-b940-4e8f-84e1-95cdc8885556",
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "item could not be retrieved",
        });
      }
      if (data) {
        console.log(data);
        res.status(200).send({
          success: true,
          message: "item successfully retrieved",
          data: data,
        });
      }
    }
  );
});

app.delete("/deleteItem", (req, res) => {
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

app.patch("/updateItem", (req, res) => {
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

app.listen(4000, () => {
  console.log("server is listening on port 4000...");
});

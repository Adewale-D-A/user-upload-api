const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(cookieParser());
app.use(
  cors({
    origin: ["*", process.env.LOCALHOST],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const delTable = require("./deleteTable/deleteTable");
const delItem = require("./deleteItem/deleteItem");
const getAll = require("./getAllItems/getAllItems");
const get = require("./getItem/getItem");
const put = require("./putItem/putItem");
const query = require("./queryTable/queryTable");
const update = require("./updateItem/updateItem");
const batchGet = require("./batchGet/batchGet");

//ACTIVE ENDPOINTS
//getAllItems endpoint for a single user
app.use("/getAll", getAll);
//put item into table endpoint
app.use("/put", put);

//get all items from all users
app.use("/getAllUser", batchGet);
//delete table endpoint
app.use("/deleteTable", delTable);
//delete item in a table endpoint
app.use("/deleteItem", delItem);
//get a single Item endpoint from a single user
app.use("/get", get);
//query item endpoint
app.use("/query", query);
//update item endpoint
app.use("/update", update);

app.get("/", (req, res) => {
  res.status(200).send("User Upload API");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`upload server is listening on port ${port}...`);
});

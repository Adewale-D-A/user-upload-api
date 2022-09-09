const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const create = require("./createTable/createTable");
const delTable = require("./deleteTable/deleteTable");
const delItem = require("./deleteItem/deleteItem");
const getAll = require("./getAllItems/getAllItems");
const get = require("./getItem/getItem");
const put = require("./putItem/putItem");
const query = require("./queryTable/queryTable");
const update = require("./updateItem/updateItem");

app.use(
  cors({
    origin: ["*", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//create table endpoint
app.use("/create", create);
//delete table endpoint
app.use("/deleteTable", delTable);
//delete item in a table endpoint
app.use("/deleteItem", delItem);
//getAllItems endpoint
app.use("/getAll", getAll);
//get a single Item endpoint
app.use("/get", get);
//put item into table endpoint
app.use("/put", put);
//query item endpoint
app.use("/query", query);
//update item endpoint
app.use("/update", update);

app.get("/", (req, res) => {
  const token = req.cookies.token;
  console.log(token);
  res.status(200).send("Welcome to my dynamoDB Backend");
});

app.listen(4000, () => {
  console.log("server is listening on port 4000...");
});

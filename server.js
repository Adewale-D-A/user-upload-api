const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const fs = require("fs");

const create = require("./createTable/createTable");
const delTable = require("./deleteTable/deleteTable");
const delItem = require("./deleteItem/deleteItem");
const getAll = require("./getAllItems/getAllItems");
const get = require("./getItem/getItem");
const put = require("./putItem/putItem");
const query = require("./queryTable/queryTable");
const update = require("./updateItem/updateItem");

const app = express();

//import s3putObject Function
const { presignedPUTurl } = require("./BucketFunctions/S3BucketMethods");

//set storage folder and upload name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imageUpload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(
  cors({
    origin: ["*", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

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

app.post("/", upload.single("avatar"), (req, res) => {
  // const token = req.cookies.token;
  // console.log(token);
  // console.log(req.file); //is the `avatar` file

  console.log(req.body);

  const presignedUrl = presignedPUTurl(
    "node-server-bucket",
    req.file.filename,
    1000 * 60
  );

  fs.readFile(`./imageUpload/${req.file.filename}`, (err, result) => {
    if (err) {
      res.status(400).send({
        success: false,
        message: "image could not be read",
      });
    }
    if (result) {
      axios
        .put(presignedUrl, result)
        .then((response) => {
          console.log(response);
          res.status(200).send({
            success: true,
            message: "image uploaded successfuly",
            data: {
              imagePath: req.file.filename,
            },
          });
        })
        .catch((error) => {
          res.status(400).send({
            success: false,
            message: "image could not be uploaded",
          });
        });
    }
  });
});

app.listen(4000, () => {
  console.log("server is listening on port 4000...");
});

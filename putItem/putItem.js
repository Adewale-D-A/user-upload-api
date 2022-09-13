const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const fs = require("fs");

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

//import s3putObject Function
const {
  presignedPUTurl,
  presignedGETurl,
} = require("../BucketFunctions/S3BucketMethods");

const { credentials, jwtSecretKey } = require("../config");
const doClient = new AWS.DynamoDB.DocumentClient(credentials);

const uniqueId = uuidv4();

router.put("/putItem", upload.single("imageUpload"), (req, res) => {
  const { itemDescription } = req.body;
  const requestToken = req.cookies.token;

  if (!requestToken) {
    fs.unlink(`./imageUpload/${req.file.filename}`, (err) => {
      if (err) {
        res.status(400).send({
          success: false,
          message: "please log in, your access credentials has expired",
        });
      }
      res.status(400).send({
        success: false,
        message: "please log in, your access credentials has expired",
      });
    });
  }
  if (requestToken) {
    const verify = jwt.verify(requestToken, jwtSecretKey);
    const tableNameSpace = verify.dynamoDBuserTable;
    const userId = verify.id;
    const dateTime = new Date().toISOString();

    if (itemDescription && req.file.filename) {
      const presignedUrl = presignedPUTurl(
        "node-server-bucket",
        `userUploads/${userId}/${req.file.filename}`,
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
              const payload = {
                id: uniqueId,
                description: itemDescription,
                image: req.file.filename,
                dateCreated: dateTime,
                dateUpdated: dateTime,
              };
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
                    const url = presignedGETurl(
                      "node-server-bucket",
                      `userUploads/${userId}/${req.file.filename}`,
                      1000 * 60
                    );
                    fs.unlink(`./imageUpload/${req.file.filename}`, (err) => {
                      if (err) {
                        res.status(200).send({
                          success: true,
                          message:
                            "record upload into dynamoDB is successfully ",
                          data: {
                            message: "could not unlink file from file system ",
                            postDescription: itemDescription,
                            url: url,
                            date: dateTime,
                          },
                        });
                      }
                      res.status(200).send({
                        success: true,
                        message: "record upload into dynamoDB is successfully ",
                        data: {
                          message: "file unlink was successful ",
                          postDescription: itemDescription,
                          url: url,
                          date: dateTime,
                        },
                      });
                    });
                  }
                }
              );
            })
            .catch((error) => {
              res.status(400).send({
                success: false,
                message: "image could not be uploaded so s3",
              });
            });
        }
      });
    } else {
      res.status(400).send({
        success: false,
        message: "invalid request body, please upload through formData",
        data: {
          itemDescription: "post description is required",
          imageUpload: "'imageUpload:' --> for the image name is required",
        },
      });
    }
  }
});

module.exports = router;

const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
var Jimp = require("jimp");

//set storage folder and upload name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./mediaUpload");
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

router.put("/putItem", upload.single("mediaUpload"), (req, res) => {
  const { itemDescription } = req.body;
  const requestToken = req.cookies.token;

  if (!requestToken) {
    fs.unlink(`./mediaUpload/${req.file.filename}`, (err) => {
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
      Jimp.read(`./mediaUpload/${req.file.filename}`, (err, thumbnail) => {
        if (err) {
          res.status(400).send({
            success: false,
            message: "failed to create a thumbnail",
          });
        }
        if (thumbnail) {
          thumbnail
            .resize(Jimp.AUTO, 256) // resize
            .quality(20) // set JPEG quality
            .write(`./mediaUpload/thumbnail${req.file.filename}`); // save

          const presignedUrl = presignedPUTurl(
            "node-server-bucket",
            `userUploads/${userId}/${req.file.filename}`,
            1000 * 60
          );
          const ThumbnailpresignedUrl = presignedPUTurl(
            "node-server-bucket",
            `userUploads/${userId}/thumbnail${req.file.filename}`,
            1000 * 60
          );
          fs.readFile(`./mediaUpload/${req.file.filename}`, (err, result) => {
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
                  fs.readFile(
                    `./mediaUpload/thumbnail${req.file.filename}`,
                    (err, thumbnail) => {
                      if (err) {
                        res.status(400).send({
                          success: false,
                          message: "image could not be read",
                        });
                      }
                      if (thumbnail) {
                        axios
                          .put(ThumbnailpresignedUrl, thumbnail)
                          .then((response) => {
                            const payload = {
                              id: uuidv4(),
                              description: itemDescription,
                              mediaUpload: req.file.filename,
                              mediaThumbnail: `thumbnail${req.file.filename}`,
                              filetype: req.file.mimetype,
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
                                    message:
                                      "could not input new record into DB",
                                  });
                                }
                                if (result) {
                                  const url = presignedGETurl(
                                    "node-server-bucket",
                                    `userUploads/${userId}/${req.file.filename}`,
                                    1000 * 60
                                  );

                                  const thumbnailUrl = presignedGETurl(
                                    "node-server-bucket",
                                    `userUploads/${userId}/thumbnail${req.file.filename}`,
                                    1000 * 60
                                  );
                                  fs.unlink(
                                    `./mediaUpload/${req.file.filename}`,
                                    (err) => {
                                      if (err) {
                                        res.status(200).send({
                                          success: true,
                                          message:
                                            "record upload into dynamoDB is successfully ",
                                          data: {
                                            message:
                                              "could not unlink file from file system ",
                                            postDescription: itemDescription,
                                            url: url,
                                            thumbnailUrl: thumbnailUrl,
                                            filetype: req.file.mimetype,
                                            date: dateTime,
                                          },
                                        });
                                      }
                                      fs.unlink(
                                        `./mediaUpload/thumbnail${req.file.filename}`,
                                        (err) => {
                                          if (err) {
                                            res.status(200).send({
                                              success: true,
                                              message:
                                                "record upload into dynamoDB is successfully ",
                                              data: {
                                                message:
                                                  "could not unlink thumbnail file from file system ",
                                                postDescription:
                                                  itemDescription,
                                                url: url,
                                                thumbnailUrl: thumbnailUrl,
                                                filetype: req.file.mimetype,
                                                date: dateTime,
                                              },
                                            });
                                          }
                                          res.status(200).send({
                                            success: true,
                                            message:
                                              "record upload into dynamoDB is successfully ",
                                            data: {
                                              message:
                                                "file unlink was successful ",
                                              postDescription: itemDescription,
                                              url: url,
                                              filetype: req.file.mimetype,
                                              date: dateTime,
                                            },
                                          });
                                        }
                                      );
                                    }
                                  );
                                }
                              }
                            );
                          })
                          .catch((err) => {
                            res.status(400).send({
                              success: false,
                              message: "could not upload thumbnail to s3",
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
        }
      });
    } else {
      res.status(400).send({
        success: false,
        message: "invalid request body, please upload through formData",
        data: {
          itemDescription: "post description is required",
          mediaUpload: "media file is required",
        },
      });
    }
  }
});

module.exports = router;

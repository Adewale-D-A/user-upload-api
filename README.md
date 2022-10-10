# Express JS User Upload Backend Server using AWS Dynamo DB and Elastic Beanstalk<a href="http://user-upload-api.us-east-1.elasticbeanstalk.com/" target="_blank">(server endpoint)</a>

## Methods for CRUD operations inside table

> \*\*\_doClient = new AWS.DynamoDB.DocumentClient({
> {
> accessKeyId: "\*\*\*\*\*\*",
> secretAccessKey: "\*\*\*\*\*\*\*\*\*\*",
> region: "us-east-\*",
> }
> })\_\*\* methods reference

<a href="https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html" target="_blank">visit Dynamodb DocumentClient documentation</a>

## Methods for creating table, deleting table and manipulating the table properties

> dynamodb = new AWS.DynamoDB({
> accessKeyId: "\*\*\*\*\*\*",
> secretAccessKey: "\*\*\*\*\*\*\*\*\*",
> region: "us-east-\*",
> }
> })\_\*\* methods reference

> <a href="https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteTable-property" target="_blank"> check DynamoDB documentation </a>

> './platform' directory contains nginx configuration on AWS Elastic Beanstalk to allow a maximum of 50MB file upload on a single endpoint call.

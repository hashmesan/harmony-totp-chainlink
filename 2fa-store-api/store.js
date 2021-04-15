var AWS = require("aws-sdk");
var uuid = require('node-uuid');
var crypto = require('crypto');

AWS.config.update({
  region: "us-east-1",
//   endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
const table_request = "TOTP-request";
const table_final = "TOTP";

function insert_request(secret, callback) {
    var receipt =  crypto.createHash('md5').update(uuid.v1()).digest("hex");
    var params = {
        TableName:table_request,
        Item:{
            "secret": secret,
            "receipt": receipt,
        }
    };

    console.log("receipt=", receipt);
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            callback(err, receipt);
        }
    });
}

function insert_totp(wallet, secret, callback) {
    var params = {
        TableName:table_final,
        Item:{
            "wallet": wallet,
            "secret": secret,
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            callback(err, wallet);
        }
    });
}

function insert_totp_by_receipt(receipt, wallet, callback) {
    docClient.get({
        TableName: table_request,
        Key: {
            "receipt" : receipt
        }
    }, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
            callback("not found", null)
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2))
            insert_totp(wallet, data["Item"]["secret"], callback)
        }
    });
}

function get_secret_by_address(address, callback) {
    docClient.get({
        TableName: table_final,
        Key: {
            "wallet" : address
        }
    }, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
            callback("not found", null)
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2))
            callback(null, data["Item"]["secret"]);
        }
    });
}

module.exports = {
    insert_request, 
    insert_totp_by_receipt,
    get_secret_by_address
}

// insert_request("secret", (err,data) => {
//     console.log(err, data)
// })
// var test = "6b5477b0-989c-11eb-bf4b-056cbe56dda8";

// insert_totp_by_receipt(test, "mywallet", (err, data) => {
//     console.log(err, data)
// })
const { Requester, Validator } = require('@chainlink/external-adapter')
const store = require("./store")
const totp = require("totp-generator");
const sha256 = require("js-sha256").sha256;
var crypto = require('crypto');
/*
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "create", "secret": "secret" }' "http://localhost:8080/"

curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "finalize", "data": {"receipt": "receipt", "wallet": "wallet"}}' "http://localhost:8080/"

curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "verify", "code": "86ce6bfa7e3d561dba3e326be88c10d3", "wallet": "0xfaf237ae7a01215a7607b5cc017736aa8b1baa9f"}' "http://localhost:8080/"

curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "create", "secret": "secret" }' https://xgokv6tzka.execute-api.us-east-1.amazonaws.com/default/2fa-store

*/
const createRequest = (input, callback) => {
    console.log(input)
    const operation = input.operation
    if (operation == "create") {
        // validate 
        if (input.secret) {
            store.insert_request(input.secret, (err, receipt) =>{
                if (err == null) 
                    callback(200, Requester.success(input.id, {data: {receipt}, status: 200}))
                else 
                    callback(500, Requester.errored(input.id, err))
            })
        }
    }
    else if (operation == "finalize") {
        if (input.receipt && input.wallet) {
            store.insert_totp_by_receipt(input.receipt, input.wallet, (err, receipt) =>{
                if (err == null) 
                    callback(200, Requester.success(input.id, {data: {receipt: input.receipt, 
                                                                        wallet: input.wallet},
                                                                         status: 200}))
                else 
                    callback(500, Requester.errored(input.id, err))
            })
        }
    } 
    else if (operation == "verify") {
        if (input.code && input.wallet) {
            store.get_secret_by_address(input.wallet, (err, secret) => {
                if (err != null) {
                    callback(400, Requester.errored(input.id, "Cant find secret"))
                } else {
                    const newToken = totp(secret, { period: 120 });
                    console.log(newToken);
                    var newTokenMd5 = crypto.createHash('md5').update(newToken).digest("hex");
        
                    if (newTokenMd5 == input.code) {
                        callback(200, Requester.success(input.id, { data: {result: "pass"},
                             status: 200}))
                    } else {
                        callback(400, Requester.errored(input.id, "Token mismatch"))
                    }        
                }
            });
        } else {
            callback(400, Requester.errored(input.id, "Bad inputs"))
        }
    }else {
        callback(500, Requester.errored(job.id, "Bad operation"))
    }
  }
  
  module.exports.createRequest = createRequest
  
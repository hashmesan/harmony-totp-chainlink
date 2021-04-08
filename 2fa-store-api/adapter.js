const { Requester, Validator } = require('@chainlink/external-adapter')
const store = require("./store")

/*
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "create", "data": {"secret": "secret"}}' "http://localhost:8080/"

curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "finalize", "data": {"receipt": "receipt", "wallet": "wallet"}}' "http://localhost:8080/"
*/
const createRequest = (input, callback) => {
    console.log(input)
    const operation = input.operation
    if (operation == "create") {
        // validate 
        if (input.data.secret) {
            store.insert_request(input.data.secret, (err, receipt) =>{
                if (err == null) 
                    callback(200, Requester.success(input.id, {data: {receipt}, status: 200}))
                else 
                    callback(500, Requester.errored(input.id, err))
            })
        }
    }
    else if (operation == "finalize") {
        if (input.data.receipt && input.data.wallet) {
            store.insert_totp_by_receipt(input.data.receipt, input.data.wallet, (err, receipt) =>{
                if (err == null) 
                    callback(200, Requester.success(input.id, {data: {receipt: input.data.receipt, 
                                                                        wallet: input.data.wallet},
                                                                         status: 200}))
                else 
                    callback(500, Requester.errored(input.id, err))
            })
        }
    } else {
        callback(500, Requester.errored(job.id, "Bad operation"))
    }
  }
  
  module.exports.createRequest = createRequest
  
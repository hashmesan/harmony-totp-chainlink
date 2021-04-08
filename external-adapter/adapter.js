const { Requester, Validator } = require('@chainlink/external-adapter')
const STORE_URL = "https://xgokv6tzka.execute-api.us-east-1.amazonaws.com/default/2fa-store"
/*
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "finalize", "data": {"receipt": "eda58ef0-98a8-11eb-9127-bd0147f1cc98", "wallet": "wallet"}}' "http://localhost:8080/"
*/
const createFinalizeRequest = (input, callback) => {  
  const jobRunID = input.id
  const receipt = input.data.receipt
  const wallet = input.data.wallet

  Requester.request({url: STORE_URL, method: 'post', data: {id: jobRunID, operation: "finalize", data: {wallet, receipt}}})
    .then(response => {
      callback(200, Requester.success(jobRunID, response.data))
    }).catch(error => callback(500, Requester.errored(jobRunID, error)))
  
}

/*
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "create","data": {"secret": "secret"}}' "http://localhost:8080/"
*/

const create2FA = (input, callback) => {  
  //const validator = new Validator(callback, input, {})
  
  const jobRunID = input.id
  const secret = input.data.secret

  Requester.request({url: STORE_URL, method: 'post', data: {id: jobRunID, operation: "create", data: {secret}}})
    .then(response => {
      callback(200, Requester.success(jobRunID, response.data))
    }).catch(error => callback(500, Requester.errored(jobRunID, error)))
}


const createRequest = (input, callback) => {
  console.log(input)
  const operation = input.operation
  switch(operation) {
    case "create": create2FA(input, callback); break;
    case "finalize": createFinalizeRequest(input, callback); break;
    default: callback(400, "Invalid operation");
  }
}

module.exports.createRequest = createRequest

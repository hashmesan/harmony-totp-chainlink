const { Requester, Validator } = require('@chainlink/external-adapter')

const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

const customParams = {
  operation: ['operation'],
  wallet: ['wallet'],
  hashedpin: ['hashedpin'],
  endpoint: false
}

const createRequest = (input, callback) => {
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const operation = validator.validated.data.oepration.toLowerCase()
  const wallet = validator.validated.data.wallet.toLowerCase()
  const hashedpin = validator.validated.data.hashedpin

  const params = {
    wallet,
    hashedpin
  }

  if (operation == "create") {
    
  }

  const config = {
    url,
    params
  }

  if (process.env.API_KEY) {
    config.headers = {
      authorization: `Apikey ${process.env.API_KEY}`
    }
  }

  Requester.request(config, customError)
    .then(response => {
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

module.exports.createRequest = createRequest

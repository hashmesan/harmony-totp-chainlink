# Harmony 2FA-Chainklink Wallet

## Wallet Creation

1. User generates 2FA locally
2. User exchanges keys with the server to encrypt the 2FA secret.
3. User sends the 2FA secret, receives a receipt
4. User calls to wallet factory to generate the wallet with the receipt
5. Wallet finalizes the wallet the 2FA-server via Chainlink
6. Chainlink postback to wallet smart contract, wallet is created.

## Wallet Operation
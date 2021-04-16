# Harmony 2FA-Chainklink Wallet

## DEMO

Check out demo at [https://hashmesan.github.io/harmony-totp/webclient/dist](https://hashmesan.github.io/harmony-totp/webclient/dist). 
Compatible with Ethereum networks & Harmony on Metamask.

## Wallet Creation

1. User generates 2FA locally
2. User exchanges keys with the server to encrypt the 2FA secret.
3. User sends the 2FA secret, receives a receipt
4. User calls to wallet factory to generate the wallet with the receipt
5. Wallet finalizes the wallet the 2FA-server via Chainlink
6. Chainlink postback to wallet smart contract, wallet is created.

## Wallet Operation

CREATE DATABASE chainlink_kovan;
CREATE USER kovan WITH PASSWORD 'kovan';
grant all privileges on database chainlink_kovan to kovan;

keystore: Chainlink Super Crazy Keystore 123
API password: Quanta123
Kovan account: https://kovan.etherscan.io/tx/0xdfe36a49117c55c64ea772381bb7a03cfb9c022e917779e753e6bf11279d53b9
Oracle Address: https://kovan.etherscan.io/address/0x59e037c59349ede07fa07e0123a27c132375b5a7
Fund our account with LINK: https://kovan.chain.link
Node Account address: 0xfDAeBD3d4DDCaf1E4931386A1c866C61537dc172

0x17C4bBCAff5D0bF2707872FA52774E0703A540EE


Starting Chainlink Node
```
CREATE DATABASE chainlink_rinkeby;
CREATE USER rinkeby WITH PASSWORD 'rinkeby';
grant all privileges on database chainlink_rinkeby to rinkeby;

cd ~/.chainlink-rinkeby && docker run -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:0.9.4 local n
```

RINKEBY oracle: 0xA4789B64a906983F5C9e40fFbe0E569b913862A1
rinkeeby account: 0xA5Cd7900c477DC6890827419c159Fc740d485404

https://hackernoon.com/what-is-a-transaction-relayer-and-how-does-it-work-bd1q3ywa


https://xgokv6tzka.execute-api.us-east-1.amazonaws.com/default/2fa-store

receipt
a8d6d420-98a1-11eb-910d-99fee9375636
a8d6d420-98a1-11eb-910d-99fee937

Argent Wallet Factory: https://etherscan.io/address/0x40c84310ef15b0c0e5c69d25138e0e16e8000fe9

Relayer: https://etherscan.io/address/0xa1a1224e9071470ab12a8df7626d4fe7789a039d


## Architecture Considerations

1. Chainlink support on Harmony. What is the feasibility of this? Chainlink can already be deployed on multiple blockchains, anyone can run nodes. Is Harmony compatible with ethereum RPC protocol?

2. Use of relayer & metatransaction to validate transactions, submit, and get refunded fees later. ( New account, Wallet operations)

3. Modular architecture to optimize for fees, minimize run-time code duplication, upgradability, separating LINK fees from smart wallet.

4. Decoupling of wallet & chainlink to prevent node operator knowing which wallet they are unlocking. Idea, move code checking logic in smart contract, and have node send the current hashed code out? Another idea, pallier homorgraphic enryption for verifying code.

5. Chainlink does not work on unit testing.  We need a testing architecture to ensure rapid validation, unit testing. Mocking of chainlink in  unit testing, and development automated testing.

6. Skew the TOTP time calculation based on the blockchain & chainlink delays

7. Use a strong key exchange protocol like Diffie Hellman for secret exchange

8. Decentralized architecture key-exchange, and matching the node that can reply? Should we encrypt secrets on chain so we don't lose them, and have node decrypt? V2?  Re-encryptor algorithm?

9. Lost or replace key procedures (with guardians?)

10. Relayer in front of the create secret call.

----------------------------------

Use case:  simple case
1. Generate OTP secret & wallet on browser.
2. Scans the OTP secret on phone google authenticator
3. Phone generates code
4. Enters code on browser & browser validates code + grab the merkel proof (other codes), submits blockchain.

Use case: Export wallet to phone
1. Generate OTP secret & wallet on browser.
2. Scans the OTP secret on phone google authenticator
3. Open "Harmony" smart wallet app, scans in OTP secret / pregenerate the keys
4. Enters code on phone & phone validates code + grab the merkel proof (other codes), submits blockchain.


## Setup WebClient

```
yarn (at the base level)
cd webclient
yarn
yarn dev
```

Visit http://localhost:8082


Webclient hardcoded to rinkeby.

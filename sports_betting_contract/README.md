# Sports Betting Contract

A Smart Contract built using Rust on the NEAR Protocol for the purpose of making decentralized Peer-to-Peer wagers.

## Features

- Built for the NEAR Protocol.
- Stores all wagers made and active wagers on the blockchain.
- Uses the contracts address as an escrow account to ensure that funds are safe during the wager process.
- Users can create any bet with associated odds (in US format ex. 150 or -150).
- Instead of going through a bookie or casino, anyone can back a placed bet.
- User can cancel their bet if it has not been backed and funds will be refunded to their account (minus gas fees).
- 2 participants per wager.

## How to use

Utilize the Bet3 User Iterface in this repository or use cli commands after downloading the NEAR-CLI.

## Callable Functions

### Change Functions

- new()
- place_bet() {"wager_odds": i128, "memo": String}
- accept_bet() {"wager_id": String}
- set_winner() {"wager_id": String, "winner": u8}
- cancel_wager() {"wager_id": &String}

### View Functions

- get_wager() {"wager_id": string}
- get_wager_status() {"wager_id": string}
- get_active_wagers()

## Future Features

- Better system for implementing wager ids
- Have contract creator be able to cancel wager
- Contract Owner Cancel Wagers

## Languages and Dependencies Used

- Rust
- near_sdk

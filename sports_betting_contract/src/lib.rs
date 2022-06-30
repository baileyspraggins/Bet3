use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};

const ONE_NEAR: u128 = 1_000_000_000_000_000_000_000_000;

// Describes the status of the bet.
// Win or Lose describe the result of the user who initialized the bet
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum BetStatus {
    Win,
    Lose,
    Initialized,
    Pending,
    InProgress,
}

impl Default for BetStatus {
    fn default() -> Self {
        BetStatus::Initialized
    }
}

#[derive(Default, BorshSerialize, BorshDeserialize, Debug)]
pub struct UserData {
    account: AccountId,
    deposited_amount: u128,
    potential_winnings: u128,
}

// Participant hash map has the account id and the amount wagering
// 1st participant is the bet initializer
// 2nd participant is the bet taker
#[near_bindgen]
#[derive(Default, BorshSerialize, BorshDeserialize, Debug)]
pub struct Bet {
    bet_odds: i128,
    bet_amount: u128,
    bet_result: BetStatus,
    participants: Vec<UserData>,
}

#[near_bindgen]
impl Bet {
    #[init]
    pub fn new_contract() -> Self {
        Self {
            bet_odds: 150,
            bet_amount: 0,
            bet_result: BetStatus::Initialized,
            participants: Vec::new(),
        }
    }

    #[payable]
    pub fn place_bet(&mut self) {
        if self.participants.len() > 0 {
            panic!("This bet has already been created. You can back the bet");
        }

        let user: UserData = UserData {
            account: env::signer_account_id(),
            deposited_amount: env::attached_deposit(),
            potential_winnings: self.get_potential_winnings(),
        };

        self.bet_amount = user.deposited_amount;
        self.participants.push(user);
    }

    #[payable]
    pub fn accept_bet(&mut self) {
        if self.participants.len() < 1 {
            panic!("This wager has yet to be initialized");
        } else if self.participants.len() > 1 {
            panic!("This wager has already been backed");
        } else {
            let backer: UserData = UserData {
                account: env::signer_account_id(),
                deposited_amount: env::attached_deposit(),
                potential_winnings: self.get_potential_winnings(),
            };

            self.participants.push(backer);
        }
    }

    pub fn set_winner(&mut self, winner: u8) {
        let winner_id: AccountId;
        let winner_reward: u128;

        match winner {
            1 => {
                self.bet_result = BetStatus::Win;
                winner_id = self.participants[0].account.clone();
                winner_reward = self.participants[0].potential_winnings;
                // Pay the winner with the respective bet amount.
                Bet::pay_winner(winner_id, winner_reward);
            }
            2 => {
                self.bet_result = BetStatus::Lose;
                winner_id = self.participants[1].account.clone();
                winner_reward = self.participants[1].potential_winnings;
                // Pay the winner with the respective bet amount.
                Bet::pay_winner(winner_id, winner_reward);
            }
            _ => panic!("Please enter an integer of 1 or 2"),
        }
    }

    fn pay_winner(winner: AccountId, amount: u128) {
        Promise::new(winner).transfer(amount);
    }

    fn get_potential_winnings(&self) -> u128 {
        let amount;

        if self.bet_odds < 0 {
            let signed_odds: u128 = (self.bet_odds + (self.bet_odds * -2)) as u128;
            amount = ((100 * self.bet_amount) / signed_odds as u128) * ONE_NEAR;
        } else {
            amount = ((self.bet_amount * self.bet_odds as u128) / 100) * ONE_NEAR;
        }

        amount
    }
}

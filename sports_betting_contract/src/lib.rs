use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedSet};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise};
use rand::distributions::Alphanumeric;
use rand::Rng;

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
#[derive(Default, BorshSerialize, BorshDeserialize, Debug)]
pub struct Bet {
    bet_odds: i128,
    bet_amount: u128,
    bet_result: BetStatus,
    participants: Vec<UserData>,
}

impl Bet {
    fn get_potential_winnings(&self) -> u128 {
        let amount;

        if self.bet_odds < 0 {
            let signed_odds: u128 = (self.bet_odds + (self.bet_odds * -2)) as u128;
            amount = (100 * self.bet_amount) / signed_odds as u128;
        } else {
            amount = (self.bet_amount * self.bet_odds as u128) / 100;
        }

        amount
    }
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
pub struct BettingContract {
    owner_id: AccountId,
    wagers: LookupMap<String, Bet>,
    active_wagers: UnorderedSet<String>,
}

#[near_bindgen]
impl BettingContract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
            wagers: LookupMap::new(b"c"),
            active_wagers: UnorderedSet::new(b"a"),
        }
    }

    #[payable]
    pub fn place_bet(&mut self, wager_odds: i128) {
        fn generate_id() -> String {
            let id: String = rand::thread_rng()
                .sample_iter(&Alphanumeric)
                .take(16)
                .map(char::from)
                .collect();

            id
        }

        let mut user: UserData = UserData {
            account: env::signer_account_id(),
            deposited_amount: env::attached_deposit(),
            potential_winnings: 0,
        };

        let wager: Bet = Bet {
            bet_odds: wager_odds,
            bet_amount: user.deposited_amount,
            bet_result: BetStatus::Pending,
            participants: Vec::new(),
        };

        user.potential_winnings = wager.get_potential_winnings();

        let wager_id = generate_id();

        let existing_wager = self.wagers.insert(&wager_id, &wager);

        assert!(
            existing_wager.is_none(),
            "Wager with this id already exists"
        );

        self.active_wagers.insert(&wager_id);

        println!(
            "{} placed a bet and deposited {} NEAR to win {}",
            wager.participants[0].account,
            (wager.participants[0].deposited_amount / ONE_NEAR),
            wager.participants[0].potential_winnings
        );

        println!("Wager Id is {}", &wager_id);
    }

    #[payable]
    pub fn accept_bet(&mut self, wager_id: String) {
        let mut selected_wager = self.get_wager(wager_id);

        if selected_wager.participants.len() < 1 {
            panic!("This wager has yet to be initialized");
        } else if selected_wager.participants.len() > 1 {
            panic!("This wager has already been backed");
        } else {
            let backer: UserData = UserData {
                account: env::signer_account_id(),
                deposited_amount: env::attached_deposit(),
                potential_winnings: selected_wager.get_potential_winnings(),
            };

            if backer.deposited_amount
                < (selected_wager.participants[0].potential_winnings
                    - selected_wager.participants[0].deposited_amount)
            {
                panic!("Please deposit more NEAR");
            }

            selected_wager.participants.push(backer);
            selected_wager.bet_result = BetStatus::InProgress;

            println!(
                "{} deposited {} NEAR to win {}",
                selected_wager.participants[1].account,
                (selected_wager.participants[1].deposited_amount / ONE_NEAR),
                selected_wager.participants[1].potential_winnings
            );
        }
    }

    pub fn set_winner(&mut self, wager_id: String, winner: u8) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner_id,
            "Only the owner of this contract can set the winner of the bet it"
        );

        let mut selected_wager = self.get_wager(wager_id);
        let winner_id: AccountId;
        let winner_reward: u128;

        match winner {
            1 => {
                selected_wager.bet_result = BetStatus::Win;
                winner_id = selected_wager.participants[0].account.clone();
                winner_reward = selected_wager.participants[0].potential_winnings
                    + selected_wager.participants[0].deposited_amount;
            }
            2 => {
                selected_wager.bet_result = BetStatus::Lose;
                winner_id = selected_wager.participants[1].account.clone();
                winner_reward = selected_wager.participants[1].potential_winnings
                    + selected_wager.participants[1].deposited_amount;
            }
            _ => panic!("Please enter an integer of 1 or 2"),
        }

        BettingContract::pay_winner(&winner_id, winner_reward);
    }

    fn pay_winner(winner: &AccountId, amount: u128) {
        Promise::new(winner.to_string()).transfer(amount);
        println!(
            "{} received won the bet and has received {} NEAR",
            winner,
            (amount / ONE_NEAR)
        )
    }

    // View Functions
    pub fn get_wager(&self, wager_id: String) -> Bet {
        let wager: Bet;

        if self.wagers.contains_key(&wager_id) {
            wager = self.wagers.get(&wager_id).unwrap();
        } else {
            panic!("Please enter a correct wager id");
        }

        wager
    }

    pub fn get_wager_status(&self, wager_id: String) -> BetStatus {
        let selected_wager = self.get_wager(wager_id);

        selected_wager.bet_result
    }
}

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};

const ONE_NEAR: u128 = 1_000_000_000_000_000_000_000_000;

// Describes the status of the bet.
// Win or Lose describe the result of the user who initialized the bet
#[derive(BorshDeserialize, BorshSerialize, Debug)]
enum BetStatus {
    Win,
    Lose,
    Pending,
    InProgress,
}

// team one is always the team selected to win by the user who initializes the bet.
#[near_bindgen]
#[derive(Default, BorshSerialize, BorshDeserialize, Debug)]
struct Bet {
    teamOneOdds: i32,
    teamTwoOdds: i32,
    betAmount: u128,
    betResult: BetStatus,
    participants: [String; 2],
}

#[near_bindgen]
impl Bet {
    #[init]
    pub fn setNewContract(args: &[String]) -> Self {
        let user: AccountId = env::predecessor_account_id();

        Self {
            teamOneOdds: &args[0],
            teamTwoOdds: &args[1],
            betAmount: (&args[2] as u128) * ONE_NEAR,
            betResult: BetStatus::Pending,
            participants: [],
        };

        Self.fund_contract(Self.betAmount);
        Self.participants.push(user);

        Self
    }

    pub fn setWinner(&self, winner: u8) {
        let winner_id: AccountId;

        match winner {
            1 => {
                self.betResult = BetStatus::Win;
                winner_id = self.participants[0];
            }
            2 => {
                self.betResult = BetStatus::Lose;
                winner_id = self.participants[1];
            }
            _ => panic!("Please enter an integer of 1 or 2"),
        }

        // Pay the winner with the respective bet amount.
        //self.pay_winner(winner_id, )
    }

    pub fn acceptBet(&self) {
        let backers_account = env::predecessor_account_id();
        let mut amount: u128;

        if self.teamOneOdds < 0 {
            amount = ((100 * self.betAmount) / self.teamOneOdds) * ONE_NEAR;
        } else {
            amount = ((self.betAmount * self.teamOneOdds) / 100) * ONE_NEAR;
        }

        self.fund_contract(amount);
        self.participants.push(backers_account);
    }

    #[payable]
    fn fund_contract(amount: u128) {
        let contract_address = env::current_account_id();
        Promise::new(contract_address).transfer(amount);
    }

    #[payable]
    fn pay_winner(winner: AccountId, amount: u128) {
        Promise::new(winner).transfer(amount);
    }
}

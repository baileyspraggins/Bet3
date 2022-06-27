use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};
use std::fmt::Error;

fn main() {
    let args: Vec<String> = env::args().collect();
}

// Describes the status of the bet.
// Win or Lose describe the result of the user who initialized the bet
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
enum BetStatus {
    Win,
    Lose,
    Pending,
    InProgress,
}

// team one is always the team selected to win by the user who initializes the bet.
#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize, Debug)]
struct Bet {
    teamOneOdds: i32,
    teamTwoOdds: i32,
    betAmount: f64,
    betResult: BetStatus,
}

#[near_bindgen]
impl Bet {
    #[init]
    pub fn setNewContract(args: &[String]) -> Bet {
        let newBet = Bet {
            teamOneOdds: &args[0],
            teamTwoOdds: &args[1],
            betAmount: &args[2],
            betResult: BetStatus::Pending,
        };
        newBet
    }

    pub fn setWinner(winner: u8) -> BetWinner {
        let winner: u8 = &args[3] as u8;

        match winner {
            1 => return BetStatus::Win,
            2 => return BetWinner::Lose,
            _ => return println!("Please enter an integer of 1 or 2"),
        }
    }

    pub fn acceptBet() {}

    #[payable]
    fn fund_contract(&mut self) {}
}

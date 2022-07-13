use super::*;
use near_sdk::MockedBlockchain;
use near_sdk::{testing_env, VMContext};

fn get_context(predecessor_account_id: String, attached_deposit: u128) -> VMContext {
    VMContext {
        current_account_id: String::from("sportsbettingcontract.testnet"),
        signer_account_id: predecessor_account_id.clone(),
        signer_account_pk: vec![0, 1, 2],
        predecessor_account_id,
        input: vec![],
        block_index: 0,
        block_timestamp: 0,
        account_balance: 0,
        account_locked_balance: 0,
        storage_usage: 0,
        attached_deposit,
        prepaid_gas: 10u64.pow(18),
        random_seed: vec![0, 1, 2],
        is_view: false,
        output_data_receivers: vec![],
        epoch_height: 19,
    }
}

fn get_initialized_bet() -> BettingContract {
    BettingContract {
        owner_id: "sportsbettingcontract.testnet".to_string(),
        wagers: LookupMap::new(b"c"),
        active_wagers: UnorderedSet::new(b"a"),
    }
}

fn get_active_bet(odds: i128) -> BettingContract {
    let mut contract = BettingContract {
        owner_id: String::from("sportsbettingcontract.testnet"),
        wagers: LookupMap::new(b"c"),
        active_wagers: UnorderedSet::new(b"a"),
    };

    let mut bet = Bet {
        bet_id: String::from("849623091793"),
        bet_odds: odds,
        bet_amount: 5 * ONE_NEAR,
        bet_result: BetStatus::Pending,
        participants: Vec::new(),
        bet_memo: String::from("Test Wager"),
    };

    let mut user1 = UserData {
        account: "user1.testnet".to_string(),
        deposited_amount: 5 * ONE_NEAR,
        potential_winnings: 0,
    };

    user1.potential_winnings = bet.get_potential_winnings();

    bet.participants.push(user1);

    contract.active_wagers.insert(&bet.bet_id);
    contract.wagers.insert(&bet.bet_id, &bet);

    contract
}

// Tests
#[test]
fn place_bet_with_positive_odds() {
    let user_id: AccountId = String::from("user1.testnet");

    let context = get_context(user_id, 5 * ONE_NEAR);
    testing_env!(context);

    let mut contract = get_initialized_bet();

    contract.place_bet(150, "add Wager".to_string());

    let check_active_wagers = contract.active_wagers.len() > 0;

    let new_bet = contract
        .wagers
        .get(&contract.active_wagers.to_vec()[0])
        .unwrap();

    assert_eq!(
        true, check_active_wagers,
        "Expected an active wager length greater than 0"
    );

    assert_eq!(
        5 * ONE_NEAR,
        new_bet.bet_amount,
        "Expected a different bet amount"
    );

    assert_eq!(
        5 * ONE_NEAR,
        new_bet.participants[0].deposited_amount,
        "Expected a different deposit amount"
    );

    assert_eq!(
        75 * ONE_NEAR / 10,
        new_bet.participants[0].potential_winnings,
        "Expected value for potential winnings"
    );

    assert_eq!(
        BetStatus::Pending,
        new_bet.bet_result,
        "BetStutus should be pending"
    );
}

#[test]
fn place_bet_with_negative_odds() {
    let user_id: AccountId = String::from("user1.testnet");

    let context = get_context(user_id, 5 * ONE_NEAR);
    testing_env!(context);

    let mut contract = get_initialized_bet();

    contract.place_bet(-150, "add Wager".to_string());

    let check_active_wagers = contract.active_wagers.len() > 0;

    let new_bet = contract
        .wagers
        .get(&contract.active_wagers.to_vec()[0])
        .unwrap();

    assert_eq!(
        true, check_active_wagers,
        "Expected an active wager length greater than 0"
    );

    assert_eq!(
        5 * ONE_NEAR,
        new_bet.bet_amount,
        "Expected a different bet amount"
    );

    assert_eq!(
        5 * ONE_NEAR,
        new_bet.participants[0].deposited_amount,
        "Expected a different deposit amount"
    );

    assert_eq!(
        3333333333333333333333333, new_bet.participants[0].potential_winnings,
        "Expected value for potential winnings"
    );

    assert_eq!(
        BetStatus::Pending,
        new_bet.bet_result,
        "BetStutus should be pending"
    );
}

#[test]
#[should_panic(expected = "The creater of the contract cannot participate in the bet")]
fn contract_owner_place_bet() {
    let user_id: AccountId = String::from("sportsbettingcontract.testnet");

    let context = get_context(user_id, 5 * ONE_NEAR);
    testing_env!(context);

    let mut contract = get_initialized_bet();

    contract.place_bet(125, "new bet".to_string());
}

#[test]
fn accept_bet_with_positive_odds() {
    let user_id: AccountId = String::from("user2.testnet");

    let context = get_context(user_id, 20 * ONE_NEAR);
    testing_env!(context);

    let mut contract = get_active_bet(250);

    let id = &contract.active_wagers.to_vec()[0];

    contract.accept_bet(id.to_string());

    let check_active_wagers = contract.active_wagers.len() == 1;

    let bet = contract
        .wagers
        .get(&contract.active_wagers.to_vec()[0])
        .unwrap();

    println!("{:?}", bet.participants);

    assert_eq!(
        true, check_active_wagers,
        "Expected length of active wager should be 1"
    );

    assert_eq!(
        20 * ONE_NEAR,
        bet.participants[1].deposited_amount,
        "Expected a different deposit amount"
    );

    assert_eq!(
        bet.bet_amount, bet.participants[1].potential_winnings,
        "Expected value for potential winnings"
    );

    assert_ne!(
        bet.participants[0].account, bet.participants[1].account,
        "Expected bet participants to be different"
    );

    assert_eq!(
        BetStatus::InProgress,
        bet.bet_result,
        "BetStutus should be InProgress"
    );
}

#[test]
fn accept_bet_with_negative_odds() {
    let user_id: AccountId = String::from("user2.testnet");

    let context = get_context(user_id, 5 * ONE_NEAR);
    testing_env!(context);

    let mut contract = get_active_bet(-150);

    let id = &contract.active_wagers.to_vec()[0];

    contract.accept_bet(id.to_string());

    let check_active_wagers = contract.active_wagers.len() == 1;

    let bet = contract
        .wagers
        .get(&contract.active_wagers.to_vec()[0])
        .unwrap();

    assert_eq!(
        true, check_active_wagers,
        "Expected an active wager length greater than 1"
    );

    assert_eq!(
        5 * ONE_NEAR,
        bet.participants[1].deposited_amount,
        "Expected a different deposit amount"
    );

    assert_eq!(
        bet.bet_amount, bet.participants[1].potential_winnings,
        "Expected value for potential winnings"
    );

    assert_ne!(
        bet.participants[0].account, bet.participants[1].account,
        "Expected bet participants to be different"
    );

    assert_eq!(
        BetStatus::InProgress,
        bet.bet_result,
        "BetStutus should be pending"
    );
}

#[test]
#[should_panic(expected = "The creater of the contract cannot participate in the bet")]
fn contract_owner_accept_bet() {
    let user_id: AccountId = String::from("sportsbettingcontract.testnet");

    let context = get_context(user_id, 5 * ONE_NEAR);
    testing_env!(context);

    let mut contract = get_active_bet(-150);

    let id = &contract.active_wagers.to_vec()[0];

    contract.accept_bet(id.to_string());
}

#[test]
fn add_additional_wager() {
    let user_id: AccountId = String::from("user2.testnet");

    let context = get_context(user_id, 5 * ONE_NEAR);
    testing_env!(context);

    let mut contract = get_active_bet(150);

    contract.place_bet(125, "new bet".to_string());

    let total_active_wagers = contract.active_wagers.to_vec().len();

    assert_eq!(2, total_active_wagers, "Active wagers should equal 2");
}

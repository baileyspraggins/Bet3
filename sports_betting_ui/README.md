# Sports Betting Application Front-End

    User interface for interacting with the Bet3 Sports Betting Contract on the NEAR Protocol.

## Features

    - Runs on NEAR Protocol Testnet
    - Access to NEAR Protocol Wallets
        - Create, Import, Login
    - Place a bet on one of two teams in the current featured wager
    - View a list of open wagers
    - Back one of the open wagers
    - Cancel a pending bet
    - If you have deployed the contract you can set the winner

## Future Features

    - View a list of current active wagers associated with your accountId
    - Multiple games and sports to bet on
    - API implementation to get changing odds data
    - Winner is set by an API at the end of each game
    - Implementation on Mainnet
    - Market or Spot bets when placing the initial wager
    - Ability to interact with the contract deployed on other accounts
    - Ability to deploy the contract to your own account
    - Algorithm that matches bets if a two users select market bets for two different teams in a matchup at the same price

    - Improved UI/UX

## How to use

    1. To run the application open your terminal to the root of the sports_betting_ui folder
        and enter ```npm run start```. Navagate to http://localhost:3000 in your browser.

    2. Login/Create a NEAR Wallet using the login button.

    3. If you want to place a bet navigate to the current wager and click the place bet button that is to the right of the team you would like to bet on.

    4. If you want to back someone elses wager. There will be a list of pending wagers. Select the back bet button to wager against that user.

    5. If you depoyed this contract you can select and submit the winner which will pay out the winner of the wager.

## Languages and Frameworks Used

    - Javascript
    - HTML
    - CSS
    - React.JS
    - Bootstrap
    - Near API JS

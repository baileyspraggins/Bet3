import React from 'react';
import ReactDOM from 'react-dom';
import * as nearAPI from 'near-api-js';
import App from './App';

async function initSportsBetting() {
  const { connect } = nearAPI;

  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const config = {
    networkId: "testnet",
    keyStore, 
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const near = await connect(config);

  // Initialize wallet connection
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in user's account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount
    };
  }

  const contract = await new nearAPI.Contract(walletConnection.account(), "bet3.testnet", {
    viewMethods: ["get_wager","get_wager_status","get_active_wagers"],
    changeMethods: ["new", "place_bet", "accept_bet", "set_winner", "cancel_wager"],
    sender: walletConnection.account()
  });

  return {contract, walletConnection, currentUser};

}

initSportsBetting()
  .then(({contract, walletConnection, currentUser}) => {
    ReactDOM.render(
      <App
        // nearConfig={config}
        contract={contract}
        walletConnection={walletConnection}
        currentUser={currentUser}
      />,
      document.getElementById('root'));
  });
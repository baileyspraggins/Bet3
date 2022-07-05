import * as nearAPI from 'near-api-js';
import Header from './Components/Header';
import TestWager from './Components/TestWager';

//import './App.css';

function App({contract, walletConnection, currentUser }) {

  const signIn = () => {
    walletConnection.requestSignIn(
      "sportsbettingcontract.testnet",
      "NEAR Sports Betting",
      null,
      null // contract requesting access
    );
  };

  const signOut = () => {
    walletConnection.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  const getActiveWagers = async () => {
    const response = await contract.get_active_wagers();

    console.log(response);
    
  }

  return (
    <div className="app-contnet">
      <Header />
      <TestWager 
        contract={contract}
        walletConnection={walletConnection}
        currentUser={currentUser}
      />
      { currentUser
          ? <div>
              <h3>
                Account ID: {currentUser.accountId}
                <br />
              </h3>
              <h3>
                Account Balance: {nearAPI.utils.format.formatNearAmount(currentUser.balance)} NEAR
              </h3>
              <button onClick={signOut}>Log out</button>
            </div>
          : 
          <div>
            Sign In To Use The App:
            {" "}
            <button onClick={signIn}>Log in</button>
          </div>
        }
        <div className='activeWagers'>
          <button onClick={getActiveWagers}>Show Active Wagers</button>
        </div>
    </div>
  );
}

export default App;

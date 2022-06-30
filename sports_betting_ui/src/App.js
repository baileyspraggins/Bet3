import * as nearAPI from 'near-api-js';
import Header from './Components/Header';
import TestWager from './Components/TestWager';

//import './App.css';

function App({contract, walletConnection, currentUser }) {
  
  const signIn = () => {
    walletConnection.requestSignIn(
      "sportsbetting.testnet",
      "NEAR Sports Betting",
      null,
      null // contract requesting access
    );
    console.log("button clicked")
  };

  const signOut = () => {
    walletConnection.signOut();
    console.log("button clicked");
  };

  return (
    <div className="app-contnet">
      <Header />
      <TestWager />
      { currentUser
          ? <div>
              <h2>
                Account ID: {currentUser.accountId}
                <br />
              </h2>
              <h2>
                Account Balance: {nearAPI.utils.format.parseNearAmount(currentUser.balance)}
              </h2>
              <button onClick={signOut}>Log out</button>
            </div>
          : 
          <div>
            Sign In To Use The App: 
            {" "}
            <button onClick={signIn}>Log in</button>
          </div>
        }
    </div>
  );
}

export default App;

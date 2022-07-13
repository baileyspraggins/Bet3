import * as nearAPI from 'near-api-js';
import Header from './Components/Header';
import TestWager from './Components/TestWager';
import ActiveWagersTable from './Components/ActiveWagersTable';


function App({contract, walletConnection, currentUser }) {

  const signIn = () => {
    walletConnection.requestSignIn(
      "bet3.testnet",
      "NEAR Sports Betting | Bet3",
      null,
      null // contract requesting access
    );
  };

  const signOut = () => {
    walletConnection.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };
  
  return (
    <div className="app-contnet">
      <Header />
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
      <TestWager 
        contract={contract}
        walletConnection={walletConnection}
        currentUser={currentUser}
      />
      <ActiveWagersTable 
                  contract={contract}
                  walletConnection={walletConnection}
                  currentUser={currentUser} />
    </div>
  );
}

export default App;

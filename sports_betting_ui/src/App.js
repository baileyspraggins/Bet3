import * as nearAPI from 'near-api-js';
import Header from './Components/Header';
import TestWager from './Components/TestWager';
import ActiveWagersTable from './Components/ActiveWagersTable';
import './App.css';
import Navbar from './Components/Navbar';

function App({contract, walletConnection, currentUser }) {
  
  return (
    <div className="app-content">
      <div className='general-content'>
        <Header />
        <Navbar 
          walletConnection={walletConnection}
          currentUser={currentUser} />
      </div>
      <div className='data-content'>
        <TestWager 
          contract={contract}
          walletConnection={walletConnection}
          currentUser={currentUser} />
        <ActiveWagersTable 
                    contract={contract}
                    walletConnection={walletConnection}
                    currentUser={currentUser} />
      </div>
    </div>
  );
}

export default App;

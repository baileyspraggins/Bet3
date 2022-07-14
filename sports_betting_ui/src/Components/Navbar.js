import React from "react";
import { Row, Col } from "react-bootstrap";
import * as nearAPI from 'near-api-js';
import './Navbar.css';


const Navbar = ({walletConnection, currentUser}) => {

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
        <div className="nav-container">
            {currentUser
                ? <div>
                    <h3 id="account-id">{currentUser.accountId} - </h3>
                    <h3 id="account-balance">{nearAPI.utils.format.formatNearAmount(currentUser.balance, 2)} NEAR</h3>
                    <button className="account-buttons" onClick={signOut}>Log out</button>
                </div>
                :
                <div>
                    <button className="account-buttons" onClick={signIn}>Login</button>
                </div>
            }
        </div>
    )
}

export default Navbar;
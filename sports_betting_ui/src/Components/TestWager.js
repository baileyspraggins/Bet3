import { WalletConnection } from 'near-api-js';
import React from 'react';
import { Table } from 'react-bootstrap';
import './TestWager.css';

const TestWager = () => {

    const initBet = (bettingOdds) => {
        // Call the new_contract method with no args, and no attachedDeposit

        // Call the place_bet method with a i128 arg, and an attachedDeposit in NEAR.
        
    }


    return (
        <div className='container'>
            <h1>Smart Contract Betting</h1> 
            <Table border={3}>
                <thead>
                    <td>Date</td>
                    <td>Sport</td>
                    <td>Matchup</td>
                    <td></td>
                </thead>
                <tbody>
                    <td>
                        <p>06/26/22</p>
                        <p>7:00 pm</p>
                    </td>
                    <td>NHL Hockey</td>
                    <td>
                        <p>Tampa Bay Lightning +110</p>
                        <p>Colorado Avalanche -150</p>
                    </td>
                    <td>
                        <button onClick={initBet(110)}>Place Bet</button>
                        <br/>
                        <br />
                        <button onClick={initBet(-150)}>Place Bet</button>
                    </td>
                </tbody>
            </Table>
        </div>
    )
}

export default TestWager;
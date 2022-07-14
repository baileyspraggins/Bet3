import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import * as nearAPI from 'near-api-js';
import './ActiveWagerTable.css';

const ActiveWagersTable = ({contract, walletConnection, currentUser }) => {
    
    const ONE_NEAR = 1000000000000000000000000;

    const BET3_FEE = 250000000000000000000000;

    const [activeWagers, setActiveWagers] = useState([]);

    useEffect(() => {
        const promiseWagerData = contract.get_active_wagers()
        .then((response) => 
        {
            return response;
        });

    
    const displayWagerData = async () => {
        let data = await promiseWagerData;
        console.log(data);
        setActiveWagers(data);
    };
    displayWagerData();
    }, [])


    const AcceptWager = async (wagerId, depositAmount) => {
        await contract.accept_bet(
            {
                wager_id: String(wagerId),
            },
            "3000000000000", // Optional GAS Amount
            depositAmount
        );
    }

    const SetWinner = async (wagerId, winner) => {
        try {
            await contract.set_winner(
                {
                    wager_id: String(wagerId),
                    winner: winner
                },
                "3000000000000", // Optional GAS Amount
            );
            window.alert("Winner sucessfully set and paid out");
            window.location.reload();
        } catch (error) {
            window.alert(error);
        }
    }

    const CancelBet = async (wagerId) => {
        try {
            await contract.cancel_wager(
                {
                    wager_id: wagerId,
                },
                "3000000000000", // Optional GAS Amount     
            );
            window.alert("Wager successfully cancelled");
            window.location.reload();
        } catch (error) {
            window.alert(error);
        }

    }

    const PendingRendering = (wager) => {
        if (currentUser != null) {
            if (wager.participants[0].account === currentUser.accountId || currentUser.accountId === contract.contractId) {
                return (
                    <div>
                        <Button variant="warning" onClick={() => {CancelBet(wager.bet_id)}}>Cancel Bet</Button>
                    </div>
                )
            } else {
                const depositNum = wager.participants[0].potential_winnings  + BET3_FEE;
                const necessaryDeposit = toFixed(depositNum);
                return (
                    <div>
                        <Button onClick={() => {AcceptWager(wager.bet_id, necessaryDeposit)}}>Back Bet</Button>
                    </div>
                )
            }
        }
    }

    const InProgressRendering = (wager) => {
        if (currentUser != null) {
            if (currentUser.accountId === contract.contractId) {
                return (
                    <div>
                        <Button className="win-btn" variant="success" onClick={() => {SetWinner(wager.bet_id, 1)}}>Win</Button>{' '}
                        <Button className="loss-btn" variant="danger" onClick={() => {SetWinner(wager.bet_id, 2)}}>Lose</Button>
                    </div>
                )
            }
        }
    }

    function toFixed(x) {
        if (Math.abs(x) < 1.0) {
          var e = parseInt(x.toString().split('e-')[1]);
          if (e) {
              x *= Math.pow(10,e-1);
              x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
          }
        } else {
          var e = parseInt(x.toString().split('+')[1]);
          if (e > 20) {
              e -= 20;
              x /= Math.pow(10,e);
              x += (new Array(e+1)).join('0');
          }
        }
        return x;
      }

    return (
        <Table id="active-table">
            <thead id="active-header">
                <tr id="active-row">
                    <td>id</td>
                    <td>Team</td>
                    <td>User</td>
                    <td>Bet Amount</td>
                    <td>Odds</td>
                    <td>Status</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {activeWagers.map(wager => {
                    return (
                        <tr key={wager.bet_id}>
                            <td>
                                {
                                    <Button className="id-button" onClick={() => {window.alert(wager.bet_id)}}>View Id</Button>
                                }
                            </td>
                            <td>{wager.bet_memo}</td>
                            <td>{wager.participants[0].account}</td>
                            <td>{`${wager.bet_amount / ONE_NEAR} NEAR`}</td>
                            <td>{wager.bet_odds}</td>
                            <td>{wager.bet_result}</td>
                            <td>{wager.bet_result === "InProgress"
                            ? InProgressRendering(wager)
                            : PendingRendering(wager)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}


export default ActiveWagersTable;
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import * as nearAPI from 'near-api-js';
import './ActiveWagerTable.css';

const ActiveWagersTable = ({contract, walletConnection, currentUser }) => {
    
    const ONE_NEAR = 1000000000000000000000000;

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
        await contract.set_winner(
            {
                wager_id: String(wagerId),
                winner: winner
            },
            "10000", // Optional GAS Amount
            null
        );
    }

    const CancelBet = async (wagerId) => {
        await contract.cancel_wager(
            {
                wager_id: String(wagerId),

            },
            "10000", // Optional GAS Amount
            null
        );
    }

    const PendingRendering = (wagerParticipantId) => {
        if (wagerParticipantId === currentUser.accountId || currentUser.acountId === contract.contractId) {
            return (
                <div>
                    <Button onClick={() => {CancelBet(2)}}>Cancel Bet</Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button onClick={() => {AcceptWager("2", "1500000000000000000000000")}}>Back Bet</Button>
                </div>
            )
        }
    }

    const InProgressRendering = () => {
        if (currentUser.acountId === contract.contractId) {
            return (
                <div>
                    <Button onClick={() => {SetWinner(2, 2)}}>Select Winner</Button>
                </div>
            )
        }
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
                        <tr>
                            <td>2</td>
                            <td>Colorado Avalanche</td>
                            <td>{wager.participants[0].account}</td>
                            <td>{`${wager.bet_amount / ONE_NEAR} NEAR`}</td>
                            <td>{wager.bet_odds}</td>
                            <td>{wager.bet_result}</td>
                            <td>
                                {wager.bet_result === "InProgress"
                                    ? InProgressRendering(wager.participants[0].account)
                                    : PendingRendering
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}


export default ActiveWagersTable;
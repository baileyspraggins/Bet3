import {React, useState} from "react";
import { Modal, ModalHeader } from "react-bootstrap";

const MakeWagerModal = ({contract, show, handleClose, betData}) => {

    // const [wagerOdds, setWagerOdds] = useState(betData.odds);

    const betAmount = '';

    const initBet = async (bettingOdds, betAmount) => {
        // Call the place_bet method with a i128 arg, and an attachedDeposit in NEAR.
        await contract.place_bet(
            {
                wager_odds: bettingOdds,
            },
            "3000000000000", // Optional GAS Amount
            betAmount 
        );
    }

    const getPotentialwinnings = (odds, betAmount) => {
        let potentialWinnings = 0;

        if (odds < 0) {
            let signedOdds = odds + (odds * -2);
            potentialWinnings = (100 * betAmount) / signedOdds;
        } else {
            potentialWinnings = (betAmount * odds) / 100;
        }
        
        return potentialWinnings;
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered className="BetModal">
                <Modal.Header id="modalHeader" closeButton>
                </Modal.Header>
                <Modal.Body id="modalBody">
                    <h3>Confirm Bet</h3>
                    <h5>{betData.team | betData.odds}</h5>
                    <h6>{betData.date} - {betData.time}</h6>
                    <input id="betAmount">{betAmount}</input>
                    <label for="betAmouint">Bet Amount in NEAR: </label>
                    <h6>{betAmount} to win {() => {getPotentialwinnings(betData.odds, betAmount)}}</h6>
                    <button onClick={() => {initBet(betData.odds, betAmount)}}></button>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default MakeWagerModal;
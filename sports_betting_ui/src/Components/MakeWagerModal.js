import {React, useState} from "react";
import { Form, Modal, Row} from "react-bootstrap";
import './MakeWagerModal.css';

const MakeWagerModal = ({contract, show, handleClose, betData}) => {

    const [betAmount, setBetAmount] = useState(1);

    const ONE_NEAR = 1

    const initBet = async (bettingOdds, betAmount) => {
        // Call the place_bet method with a i128 arg, and an attachedDeposit in NEAR.
        await contract.place_bet(
            {
                wager_odds: bettingOdds,
            },
            "3000000000000", // Optional GAS Amount
            String(betAmount * ONE_NEAR)
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
        <Modal show={show} onHide={handleClose} centered className="betModal">
            <Modal.Header id="modal-header">
                <h2>{betData.team} | {betData.odds}</h2>
                <h4>{betData.date} - {betData.time}</h4>
            </Modal.Header>
            <Modal.Body id="modal-body">
                <Row>
                    <Form>
                        <Form.Group>
                            <Form.Label>Bet Amount in NEAR:</Form.Label>{' '}
                            <Form.Control type="number" placeholder="1" onChange={(e) => {setBetAmount(Number(e.target.value))}}/>
                        </Form.Group>
                    </Form>
                </Row>
                <Row>
                    <h3>Bet {betAmount} NEAR to win {getPotentialwinnings(betData.odds, betAmount)}</h3>
                </Row>
                <button>Confirm Bet</button>
            </Modal.Body>
        </Modal>
    )
}

export default MakeWagerModal;
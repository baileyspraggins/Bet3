import {React, useState} from "react";
import { Form, Modal, Row, Button} from "react-bootstrap";
import './MakeWagerModal.css';
import { utils } from "near-api-js";

const MakeWagerModal = ({contract, show, handleClose, betData}) => {

    const [betAmount, setBetAmount] = useState(1);
    const BET3_FEE_NEAR = .25;

    const initBet = async (bettingOdds, nearBetAmount, team) => {

        const finalDeposit = nearBetAmount + BET3_FEE_NEAR; 
        let betAmountInYecto = utils.format.parseNearAmount(String(finalDeposit));
        console.log(betAmountInYecto);
        // Call the place_bet method with a i128 arg, and an attachedDeposit in NEAR.
        try {
            await contract.place_bet(
                {
                    wager_odds: bettingOdds,
                    memo: team
                },
                "3000000000000", // Optional GAS Amount
                betAmountInYecto
            );
            window.alert("Wager Placed!");
        } catch (error) {
            window.alert(error);
        }
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
        <Modal className="betModal" show={show} onHide={handleClose} centered>
            <Modal.Header id="modal-header">
                <h2 className="header-level-1">{betData.team} | {betData.odds}</h2>
                <h4 className="header-level-2">{betData.date} - {betData.time}</h4>
            </Modal.Header>
            <Modal.Body id="modal-body">
                <img className="team-logo" src={betData.logo} />
                <Row>
                    <Form>
                        <Form.Group className="bet-entry-group">
                            <Form.Label className="bet-entry-label">Bet Amount in NEAR:</Form.Label>{' '}
                            <Form.Control className="bet-entry-control" type="number" placeholder="1" onChange={(e) => {setBetAmount(Number(e.target.value))}}/>
                        </Form.Group>
                    </Form>
                </Row>
                <Row>
                    <h3>Bet {betAmount} NEAR to win {getPotentialwinnings(betData.odds, betAmount)}</h3>
                </Row>
                <Button className="confirm-button" onClick={() => initBet(betData.odds, betAmount, betData.team)}>Confirm Bet</Button>
            </Modal.Body>
        </Modal>
    )
}

export default MakeWagerModal;
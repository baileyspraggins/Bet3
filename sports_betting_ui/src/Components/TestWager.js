import { WalletConnection } from 'near-api-js';
import {React, useState} from 'react';
import { Table } from 'react-bootstrap';
import './TestWager.css';
import * as nearAPI from 'near-api-js';
import MakeWagerModal from './MakeWagerModal';
import AvsLogo from '../Assets/team_logos/colorado_avalanche_logo.png';
import LightningLogo from '../Assets/team_logos/tampa_bay_lightning_logo.png';


const TestWager = ({contract, WalletConnection, currentUser}) => {

    const [selectedData, setSelectedData] = useState('');

    const [show, setShow] = useState(false);

    let betData;

    const handleClose = () => {
        setShow(false);
        betData("");
    };

    const handleShow = () => setShow(true);

    const mockBet = {
        teamOne: "Tampa Bay Lightning",
        teamOneOdds: 125,
        teamOneLogo: LightningLogo,
        teamTwo: "Colorado Avalanche",
        teamTwoOdds: -150,
        teamTwoLogo: AvsLogo,
        sport: "NHL Hockey",
        date: "06/26/22",
        time: "7:00 PM"
    };

    const getSelectedData = async (selectedNumber) => {
        if (selectedNumber === 1) {
           betData = {
            team: mockBet.teamOne,
            odds: mockBet.teamOneOdds,
            logo: mockBet.teamOneLogo,
            sport: mockBet.sport,
            date: mockBet.date,
            time: mockBet.time
           };
        } else {
            betData = {
                team: mockBet.teamTwo,
                odds: mockBet.teamTwoOdds,
                logo: mockBet.teamTwoLogo,
                sport: mockBet.sport,
                date: mockBet.date,
                time: mockBet.time
            };
        }

        setSelectedData(betData);
    }


    return (
        <div>
            <div className='container'>
                <h1>Smart Contract Betting</h1> 
                <Table bordered hover variant="light" id="wager-table">
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Sport</td>
                            <td>Matchup</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <p>{mockBet.date}</p>
                                <p>{mockBet.time}</p>
                            </td>
                            <td>{mockBet.sport}</td>
                            <td>
                                <p>{mockBet.teamOne} {mockBet.teamOneOdds}</p>
                                <p>{mockBet.teamTwo} {mockBet.teamTwoOdds}</p>
                            </td>
                            <td>
                                <button className="wager-button" onClick={() => { 
                                    getSelectedData(1)
                                    handleShow()
                                    console.log(selectedData)
                                    }}>Place Bet</button>
                                <br/>
                                <button className="wager-button" onClick={() => { 
                                    getSelectedData(2)
                                    handleShow()
                                    console.log(selectedData)
                                    }}>Place Bet</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div>
                <MakeWagerModal contract={contract} show={show} handleClose={handleClose} betData={selectedData} />
            </div>
        </div>
    )
}

export default TestWager;
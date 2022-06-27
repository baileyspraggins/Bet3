import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import HomeScreen from "../Routes/HomeScreen";

const AvailableWagers = () => {
    const api_key = 'e961d6faf9d3cd9c72b1e4bbacf9c9dc';

    const [oddsData, setOddsData] = useState([]);
    // Get a list of in season sports
    // axios.get('https://api.the-odds-api.com/v3/sports', {
    //     params: {
    //         api_key: api_key
    //     }
    // }).then(response => {
    //     console.log(
    //         `Successfully got ${response.data.data.length} sports.`,
    //     )

    //     console.log(response.data.data)

    // }).catch(error => {
    //     console.log('Error status', error.response.status)
    //     console.log(error.response.data)
    // })


    //Get odds for a given sport. Upcoming is all live and upcoming events
    let sport_key = 'baseball_mlb';

    const getSports = () => {
        axios.get('https://api.the-odds-api.com/v3/odds', {
        params: {
            api_key: api_key,
            sport: sport_key,
            region: 'us', // uk | us | eu | au
            mkt: 'h2h' // h2h | spreads | totals
        }
        }).then(response => {
            // odds_json['data'] contains a list of live and 
            //   upcoming events and odds for different bookmakers.
            // Events are ordered by start time (live events are first)
            console.log(
                `Successfully got ${response.data.data.length} events`,
                `Here's the first event:`
            )

            
            setOddsData(response.data.data);

            // Check your usage
            console.log()
            console.log('Remaining requests',response.headers['x-requests-remaining'])
            console.log('Used requests',response.headers['x-requests-used'])

        })
        .catch(error => {
            console.log('Error status', error.response.status)
            console.log(error.response.data)
        })
    }

    return(
        <div>
            <button onClick={getSports}>Get Sports Odds</button>
            {oddsData.map(game => <p>{game[0]}</p>)}
        </div>
    )
    }

export default AvailableWagers;
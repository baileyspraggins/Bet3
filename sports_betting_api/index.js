const axios = require('axios');

const api_key = process.env.api_key;

// Get a list of in season sports
axios.get('https://api.the-odds-api.com/v3/sports', {
    params: {
        api_key: api_key
    }
}).then(response => {
    console.log(
        `Successfully got ${response.data.data.length} sports.`,
        `Here's the first sport:`
    )

    console.log(response.data.data[0])
}).catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})


//Get odds for a given sport. Upcoming is all live and upcoming events
let sport_key = 'upcoming';

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
    console.log(JSON.stringify(response.data.data[0]))

    // Check your usage
    console.log()
    console.log('Remaining requests',response.headers['x-requests-remaining'])
    console.log('Used requests',response.headers['x-requests-used'])

})
.catch(error => {
    console.log('Error status', error.response.status)
    console.log(error.response.data)
})

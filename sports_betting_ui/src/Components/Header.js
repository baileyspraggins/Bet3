import React from 'react';
import Bet3 from '../Assets/Bet3_logo.png';
import './Header.css';

const Header = () => {
    return(
        <div className='header-container'>
            <img src={Bet3} alt="bet 3 logo"/>
        </div>
    )
}

export default Header;
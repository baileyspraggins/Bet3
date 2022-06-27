import React from 'react';
import logo from './logo.svg';
// import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomeScreen from './Routes/HomeScreen';
import Header from './Components/Header';
import NavBar from './Components/NavBar';
import Tester from './Components/Tester';
import './App.css';

function App() {
  return (
    <div className='app-content'>
      <Header />
      {/* <NavBar /> */}
      <Routes>
        {/* <Route path='/' element={<HomeScreen />} /> */}
        <Route path='/' element={<Tester />} />
      </Routes>
    </div>
  );
}

export default App;

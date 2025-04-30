import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Layout/Footer/Footer';
import Header from './components/Layout/Header/Header';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Homepage from './pages/Homepage/Homepage';
import Services from './pages/Services/Services';
import Workouts from './pages/Workouts/Workouts';

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/workouts" element={<Workouts />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App; 
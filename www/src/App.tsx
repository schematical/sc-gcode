import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GCodeHomePage from "./pages/GCodeHomePage";
function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route index element={<GCodeHomePage />} />
        </Routes>
      </BrowserRouter>

  );
}


export default App;

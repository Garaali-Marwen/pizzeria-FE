import './App.css';
import { Route, Routes } from 'react-router-dom';
import { BackOffice } from './Components/BackOffice/BackOffice';
import {FrontOffice} from "./Components/FrontOffice/FrontOffice";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<FrontOffice />} />
                <Route path="/backOffice/*" element={<BackOffice />} />
            </Routes>
        </div>
    );
}

export default App;

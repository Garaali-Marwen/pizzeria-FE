import * as React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import "../../assets/styles/PaymentSuccess.css"
export function PaymentSuccess() {
    return (
        <div className="container text-center mt-5">
            <VerifiedIcon style={{color: '#78d54b', fontSize: '100px'}}/>
            <h1 className="text">Order confirmed</h1>
            <div className="buttons">
                <button className="action-button-1">RETURN TO HOME</button>
                <button className="action-button-2">VIEW ORDER</button>
            </div>
        </div>
    );
};
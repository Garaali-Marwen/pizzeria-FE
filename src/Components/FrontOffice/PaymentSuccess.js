import * as React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import "../../assets/styles/PaymentSuccess.css"
import {Link} from "react-router-dom";

export function PaymentSuccess() {
    return (
        <div className="container text-center mt-5">
            <VerifiedIcon style={{color: '#78d54b', fontSize: '100px'}}/>
            <h1 className="text">Commande confirmée</h1>
            <div className="buttons">
                <button className="action-button-1">
                    <Link className="navbar-text text-decoration-none" to="/menu">
                        RETOUR AU MENU
                    </Link>
                </button>
                <button className="action-button-2">
                    <Link className="navbar-text text-decoration-none" to="/backOffice/client/orders">
                        VOIR LA COMMANDE
                    </Link>
                </button>
            </div>
        </div>
    );
};
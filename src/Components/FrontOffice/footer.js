import * as React from 'react';
import "../../assets/styles/footer.css"
import {useEffect, useState} from "react";
import ConfigService from "../../Services/ConfigService";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import deliveryIcon from "../../assets/Images/deliveryIcon.png";

export function Footer() {

    const [config, setConfig] = useState({
        contactPhone: "",
        deliveryPhone: "",
        contactEmail: ""
    })
    useEffect(() => {
        ConfigService.getConfig()
            .then(response => setConfig(response.data[0]))
            .catch(error => console.log(error))
    }, []);

    return (
        <div className="nav-footer footer">
            <div className="contact">
                <p style={{color: "#6cc305"}}>
                    Téléphone:<br/>
                    <b style={{color: "#e7e7e7"}}>{config.contactPhone}</b>
                </p>

                <p style={{color: "#6cc305"}}>
                    E-mail:<br/>
                    <b style={{color: "#e7e7e7"}}>{config.contactEmail}</b>
                </p>

                <div className="d-flex gap-3">
                    <DeliveryDiningIcon style={{color: "#6cc305", fontSize: "xxx-large"}}/>
                    <div>
                        <p>
                            Pour la livraison, appelez<br/>
                            <b style={{color: "#fa0002"}}>{config.deliveryPhone}</b>
                        </p>
                    </div>
                </div>

            </div>

            <div className="pages">
                <a href="https://www.facebook.com/">
                    <i className='bx bxl-facebook-square icon-footer' ></i>
                </a>
                <a href="https://www.instagram.com/">
                    <i className='bx bxl-instagram-alt icon-footer' ></i>
                </a>
            </div>
        </div>
    );
};
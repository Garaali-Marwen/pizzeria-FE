import * as React from 'react';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import {Button, CircularProgress, TextField} from "@mui/material";
import deliveryIcon from "../../assets/Images/deliveryIcon.png"
import UserService from "../../Services/UserService";
import {useEffect, useState} from "react";
import ConfigService from "../../Services/ConfigService";
import ContactService from "../../Services/ContactService";
import SnackbarMessage from "../SnackbarMessage";

export function Contact() {
    const [message, setMessage] = useState('')
    const [submit, setSubmit] = useState(true)

    const [contact, setContact] = useState({
        nom: "",
        email: "",
        tel: "",
        subject: "",
        message: ""
    })
    const [config, setConfig] = useState({
        contactPhone: "",
        deliveryPhone: "",
        contactEmail: ""
    })
    const handleSnackBarClose = () => {
        setMessage('')
    }
    useEffect(() => {
        ConfigService.getConfig()
            .then(response => setConfig(response.data[0]))
            .catch(error => console.log(error))
    }, []);

    const handleContactForm = (e) => {
        const {name, value} = e.target;
        setContact((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleFormContactSubmit = (e) => {
        e.preventDefault()
        setSubmit(false)
        ContactService.contact(contact)
            .then(response => {
                    setSubmit(true)
                    setMessage('Message envoyé avec succès')
                    setContact({
                        nom: "",
                        email: "",
                        tel: "",
                        subject: "",
                        message: ""
                    })
                }
            )
            .catch(error => console.log(error))
    }
    return (
        <div className="row w-100 p-5" style={{color: "#e7e7e7"}}>
            <div className="p-5 col-lg-4 flex-grow-1">
                <h2 style={{
                    fontSize: "xx-large",
                    fontWeight: "bold",
                    fontFamily: "Lucida Handwriting",
                    marginBottom: "50px"
                }}>Détails du
                    contact</h2>
                <p style={{color: "#6cc305"}}>
                    Téléphone:<br/>
                    <b style={{color: "#e7e7e7"}}>{config.contactPhone}</b>
                </p>
                <div style={{
                    borderBottom: "1px solid rgba(255,255,255,0.56)",
                    width: "100%",
                    marginBottom: "10px"
                }}></div>
                <p style={{color: "#6cc305"}}>
                    E-mail:<br/>
                    <b style={{color: "#e7e7e7"}}>{config.contactEmail}</b>
                </p>
                <div style={{
                    borderBottom: "1px solid rgba(255,255,255,0.56)",
                    width: "100%",
                    marginBottom: "10px"
                }}></div>
                <div className="d-flex gap-3">
                    <DeliveryDiningIcon style={{color: "#6cc305", fontSize: "xxx-large"}}/>
                    <div>
                        <p>
                            Pour la livraison, appelez<br/>
                            <b style={{color: "#fa0002"}}>{config.deliveryPhone}</b>
                        </p>
                    </div>
                </div>
                <div style={{
                    borderBottom: "1px solid rgba(255,255,255,0.56)",
                    width: "100%",
                    marginBottom: "10px"
                }}></div>
                <div className="d-flex gap-3">
                    <img src={deliveryIcon} style={{marginLeft: "5px", height: "35px", width: "35px"}}/>
                    <div>
                        <p>
                            Heures de livraison<br/>
                            <small>
                                Du lundi au vendredi : 09h30 – 22h30 <br/>
                                Samedi : 10h15 – 20h00<br/>
                                Dimanche : 12h00 – 19h00</small>
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 col-lg-8 col-sm-12 flex-grow-1">
                <h2 style={{
                    fontSize: "xx-large",
                    fontWeight: "bold",
                    fontFamily: "Lucida Handwriting",
                    marginBottom: "50px"
                }}>
                    Envoyez-nous un message</h2>
                <form onSubmit={handleFormContactSubmit} className="d-flex flex-column gap-4">
                    <div className="d-flex gap-4">
                        <TextField value={contact.nom} name="nom" onChange={handleContactForm} fullWidth
                                   style={{backgroundColor: "#e7e7e7", borderRadius: "5px"}} label="Nom"
                                   variant="standard"/>
                        <TextField value={contact.email} name="email" onChange={handleContactForm} fullWidth
                                   style={{backgroundColor: "#e7e7e7", borderRadius: "5px"}} label="E-mail"
                                   variant="standard"/>
                    </div>
                    <div className="d-flex gap-4">
                        <TextField value={contact.tel} name="tel" onChange={handleContactForm} fullWidth
                                   style={{backgroundColor: "#e7e7e7", borderRadius: "5px"}} label="Téléphone"
                                   variant="standard"/>
                        <TextField value={contact.subject} name="subject" onChange={handleContactForm} fullWidth
                                   style={{backgroundColor: "#e7e7e7", borderRadius: "5px"}} label="Sujet"
                                   variant="standard"/>
                    </div>

                    <textarea value={contact.message} name="message" onChange={handleContactForm} rows={4} placeholder={"Message"}
                              style={{borderRadius: "5px"}}/>

                    {(UserService.getRole() !== "EMPLOYEE" && UserService.getRole() !== "ADMIN") &&
                        <Button disabled={!submit} type={"submit"}
                                endIcon={!submit && <CircularProgress color="success"/>}
                                variant="contained" style={{backgroundColor: "#6cc305"}}>Envoyer</Button>
                    }
                </form>
            </div>
            <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>

        </div>
    );
};
import React, {useState} from 'react';
import {TextField} from "@mui/material";
import '../../assets/styles/SignUp.css'
import ClientService from "../../Services/ClientService";
import {useNavigate} from "react-router-dom";

export function SignUp() {
    const navigate = useNavigate();
    const [disableButton, setDisableButton] = useState(false)
    const [client, setClient] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: ''
    })
    const handleFormChange = (e) => {
        setClient({...client, [e.target.name]: e.target.value})
    }

    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const handlePasswordConfirmationChange = (e) => {
        setPasswordConfirmation(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setDisableButton(true)
        ClientService.addClient(client).then(
            response => {
                navigate('/signIn');
                setClient({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                })
                setPasswordConfirmation('')
            })
            .catch(
                error => console.log(error)
            )
    }

    return (
        <div className="body-page">
            <div className="background-image-container" />
            <div className="card mt-5 pt-4 d-flex">
                <form onSubmit={handleSubmit}>
                    <h1>Inscription</h1>
                    <div className="registration-g-f">
                        <i className='bx bxl-facebook-circle'></i>
                        <i className='bx bxl-google'></i>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <hr className="w-100"/>
                        <h1 className="fs-3">Ou</h1>
                        <hr className="w-100"/>
                    </div>
                    <div className="card-body">
                        <TextField value={client.email} name="email" onChange={handleFormChange} type="email" fullWidth
                                   label="E-mail" variant="outlined"/>
                        <TextField value={client.firstName} onChange={handleFormChange} name="firstName" fullWidth className="mt-4"
                                   label="Nom"
                                   variant="outlined"/>
                        <TextField value={client.lastName} onChange={handleFormChange} name="lastName" fullWidth className="mt-4"
                                   label="Prénom" variant="outlined"/>
                        <TextField value={client.phoneNumber} onChange={handleFormChange} type="tel" name="phoneNumber" fullWidth className="mt-4"
                                   label="Numéro de téléphone" variant="outlined"/>
                        <TextField value={client.password} onChange={handleFormChange} name="password" type="password" className="mt-4"
                                   fullWidth label="Mot de passe"
                                   variant="outlined"/>
                        <TextField onChange={handlePasswordConfirmationChange} value={passwordConfirmation} type="password" className="mt-4" fullWidth label="Confirmez le mot de passe"
                                   variant="outlined"/>
                    </div>

                    <div className="mb-4">
                        <button disabled={disableButton} className="submitButton" type="submit">S'inscrire</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
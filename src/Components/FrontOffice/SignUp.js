import React, {useState} from 'react';
import {TextField} from "@mui/material";
import '../../assets/styles/SignUp.css'
import ClientService from "../../Services/ClientService";

export function SignUp() {

    const [client, setClient] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
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
        ClientService.addClient(client).then(
            response => {
                setClient({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: ''
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
                    <h1>Registration</h1>
                    <div className="registration-g-f">
                        <i className='bx bxl-facebook-circle'></i>
                        <i className='bx bxl-google'></i>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <hr className="w-100"/>
                        <h1 className="fs-3">Or</h1>
                        <hr className="w-100"/>
                    </div>
                    <div className="card-body">
                        <TextField value={client.email} name="email" onChange={handleFormChange} type="email" fullWidth
                                   label="Email" variant="outlined"/>
                        <TextField value={client.firstName} onChange={handleFormChange} name="firstName" fullWidth className="mt-4"
                                   label="First name"
                                   variant="outlined"/>
                        <TextField value={client.lastName} onChange={handleFormChange} name="lastName" fullWidth className="mt-4"
                                   label="Last name" variant="outlined"/>
                        <TextField value={client.password} onChange={handleFormChange} name="password" type="password" className="mt-4"
                                   fullWidth label="Password"
                                   variant="outlined"/>
                        <TextField onChange={handlePasswordConfirmationChange} value={passwordConfirmation} type="password" className="mt-4" fullWidth label="Confirm password"
                                   variant="outlined"/>
                    </div>

                    <div className="mb-4">
                        <button className="submitButton" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
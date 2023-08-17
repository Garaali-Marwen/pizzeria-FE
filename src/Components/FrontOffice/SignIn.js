import React, {useState} from 'react';
import {TextField} from "@mui/material";
import UserService from "../../Services/UserService";
import SnackbarMessage from "../SnackbarMessage";
import jwt from 'jwt-decode'
import {useNavigate} from "react-router-dom";
import OrderItemService from "../../Services/OrderItemService";

export function SignIn({updateIsLoggedIn}) {

    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const handleFormChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        UserService.userLogin(user)
            .then((response) => {
                const decoded = jwt(response.data.token);
                UserService.setUserId(decoded.id);
                UserService.setRoles(decoded.role);
                UserService.setUserEmail(decoded.sub);
                UserService.setToken(response.data.token);
                switch (decoded.role) {
                    case 'CLIENT':
                        const cart = UserService.getCart();
                        if (cart.length > 0) {
                            const promises = cart.map((item) => {
                                item.client.id = decoded.id;
                                return OrderItemService.addOrderItem(item)
                                    .then((response) => UserService.deleteItemFromCart(item.id))
                                    .catch((error) => console.log(error));
                            });
                            Promise.all(promises)
                                .then(() => {
                                    navigate('/');
                                    updateIsLoggedIn();
                                })
                                .catch((error) => console.log(error));
                        } else {
                            navigate('/');
                            updateIsLoggedIn();
                        }
                        break;
                    case 'EMPLOYEE':
                    case 'ADMIN':
                        navigate('/backOffice/dashboard');
                        updateIsLoggedIn();
                        break;
                    default:
                        navigate('/');
                        updateIsLoggedIn();
                }
                setUser({
                    email: '',
                    password: '',
                });
            })
            .catch((error) => {
                setMessage(
                    'Invalid login credentials. Please check your email and password and try again.'
                );
            });
    };


    const [message, setMessage] = useState('')
    const handleSnackBarClose = () => {
        setMessage('')
    }


    return (
        <div className="body-page">
            <div className="background-image-container" />

            <div className="card mt-5 pt-4 d-flex">
                <form onSubmit={handleSubmit}>
                    <h1>LogIn</h1>
                    <div className="card-body">
                        <TextField focused value={user.email} name="email" onChange={handleFormChange} type="email"
                                   fullWidth
                                   label="Email" variant="outlined"/>
                        <TextField focused value={user.password} onChange={handleFormChange} name="password"
                                   type="password"
                                   className="mt-4"
                                   fullWidth label="Password"
                                   variant="outlined"/>
                    </div>
                    <div className="mb-4 p-4">
                        <button className="submitButton w-100" type="submit">LOGIN</button>
                    </div>
                </form>
                <div className="d-flex align-items-center justify-content-around">
                    <hr className="w-50"/>
                    <h1 className="fs-3 w-100">Or login using</h1>
                    <hr className="w-50"/>
                </div>
                <div className="registration-g-f mb-5">
                    <i className='bx bxl-facebook-circle'></i>
                    <i className='bx bxl-google'></i>
                </div>
                <SnackbarMessage message={message} severity="error" onClose={handleSnackBarClose}/>
            </div>
        </div>
    );
};
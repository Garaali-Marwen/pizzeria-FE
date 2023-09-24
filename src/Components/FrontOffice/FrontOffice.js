import React, {useEffect, useState} from 'react';
import Header from './Header';
import {Route, Routes} from 'react-router-dom';
import {Home} from './Home';
import {Menu} from './Menu';
import {SignIn} from "./SignIn";
import {SignUp} from "./SignUp";
import {Cart} from "./Cart";
import OrderItemService from "../../Services/OrderItemService";
import UserService from "../../Services/UserService";
import {PaymentSuccess} from "./PaymentSuccess";
import {OffersList} from "./Offers-list";
import {NotFound} from "../BackOffice/404NotFound";
import {Contact} from "./Contact";
import {Footer} from "./footer";

export function FrontOffice() {

    const [cartItemCount, setCartItemCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(UserService.isLoggedIn())


    useEffect(() => {
        updateCartItemCount()
    }, [])


    const updateIsLoggedIn = () => {
        setIsLoggedIn(prevState => !prevState)
    }
    const updateCartItemCount = () => {
        if (UserService.isLoggedIn()) {
            OrderItemService.getOrderItemsByClientId(UserService.getUserId())
                .then(response => setCartItemCount(response.data.length))
                .catch(error => console.log(error))
        } else if (UserService.getCart().length >= 0)
            setCartItemCount(UserService.getCart().length)
    };
    const userRole = UserService.getRole();
    const loggedIn = UserService.isLoggedIn();

    return (
        <>
            <Header cartItemCount={cartItemCount} updateCartItemCount={updateCartItemCount}
                    updateIsLoggedIn={updateIsLoggedIn} isLoggedIn={isLoggedIn}/>
            <Routes>
                <Route path="/" element={<Home updateCartItemCount={updateCartItemCount}/>}/>
                <Route path="/menu" element={<Menu updateCartItemCount={updateCartItemCount}/>}/>
                {!loggedIn &&
                    <>
                        <Route path="/signIn" element={<SignIn updateIsLoggedIn={updateIsLoggedIn}/>}/>
                        <Route path="/signUp" element={<SignUp/>}/>
                    </>
                }
                {userRole === "CLIENT" &&
                    <>
                        <Route path="/cart" element={<Cart updateCartItemCount={updateCartItemCount}/>}/>
                        <Route path="/payment/success" element={<PaymentSuccess/>}/>
                    </>
                }
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/offers" element={<OffersList/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>

            <Footer/>
        </>
    );
}

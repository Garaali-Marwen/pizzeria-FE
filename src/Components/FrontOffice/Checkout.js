import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "../../assets/styles/Checkout.css";
import UserService from "../../Services/UserService";

const stripePromise = loadStripe("pk_test_51NeT2MGlUjM6c4dzSHeZbPtVa6QiDNf4pVMcqeFlUu2RSLEkfDYMY4oawwJPo51lzhFK3ztxKyDfsXeUyHkVmBBY00a4NSFGa7");
export default function Checkout({order}) {
    const [clientSecret, setClientSecret] = useState("");
    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("http://localhost:8080/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" , "Authorization" : `Bearer ${UserService.getToken()}`},
            body: JSON.stringify(order),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
        }, []);

    const appearance = {
        theme: 'night',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="checkoutForm">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm price={order.price} />
                </Elements>
            )}
        </div>
    );
}
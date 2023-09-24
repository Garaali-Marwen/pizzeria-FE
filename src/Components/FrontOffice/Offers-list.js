import * as React from 'react';
import {useEffect, useState} from "react";
import OfferService from "../../Services/OfferService";
import {OfferCard} from "./Offer-card";

export function OffersList() {

    const [offers, setOffers] = useState([])

    useEffect(() => {
        OfferService.getAllAvailableOffers()
            .then(response => {
                console.log(response.data)
                setOffers(response.data)
            })
            .catch(error => console.log(error))
    }, []);


    return (
        <div>
            {offers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
            ))}
        </div>
    );
};
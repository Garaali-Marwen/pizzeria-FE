import * as React from 'react';
import "../../assets/styles/ItemsClientsStats.css"
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {useEffect, useState} from "react";
import ItemService from "../../Services/ItemService";
import ClientService from "../../Services/ClientService";

export function ItemsClientsStats() {
    const [itemsCount, setItemsCount] = useState(0)
    const [clientsCount, setClientsCount] = useState(0)
    useEffect(() => {
        ItemService.findAllItems()
            .then(response => setItemsCount(response.data.length))
            .catch(error => console.log(error))
        ClientService.getClientsNumber()
            .then(response => setClientsCount(response.data))
            .catch(error => console.log(error))
    }, []);
    return (
        <div className="contnr">
            <div className="contnt1">
                <div className="bubbleStats1"></div>
                <div className="bubbleStats2"></div>
                <PeopleAltIcon className="icone-cntnt"/>
                <div className="text-Stats">
                    <h5>{clientsCount}</h5>
                    <b>Clients</b>
                </div>
            </div>
            <div className="contnt2">
                <div className="bubbleStats11"></div>
                <div className="bubbleStats22"></div>
                <RestaurantIcon className="icone-cntnt"/>
                <div className="text-Stats">
                    <h5>{itemsCount}</h5>
                    <b>Articles</b>
                </div>
            </div>
        </div>
    );
};
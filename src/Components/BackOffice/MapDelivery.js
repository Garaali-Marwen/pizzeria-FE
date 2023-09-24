import * as React from 'react';
import {MapStreet} from "../FrontOffice/MapStreet";
import OrderService from "../../Services/OrderService";
import {useEffect, useState} from "react";

export function MapDelivery() {

    const [orders, setOrders] = useState([])
    useEffect(() => {
        async function getTodayOrders() {
            const todayOrders = await fetchTodayOrders();
            setOrders(todayOrders);
        }
        getTodayOrders();
    }, []);
    async function fetchTodayOrders() {
        try {
            const response = await OrderService.getAllTodayOrdersForMap();
            return response.data;
        } catch (error) {
            console.log(error)
            return [];
        }
    }
    return (
        <div className="vh-100 w-100">
            <MapStreet orders={orders}/>
        </div>
    );
};
import * as React from 'react';
import {BarChart} from "./BarChart";
import {useEffect, useState} from "react";
import TransactionService from "../../Services/TransactionService";
import OrderService from "../../Services/OrderService";

export function OrdersStats() {
    const [date, setDate] = useState("month")
    const [data, setData] = useState([])

    const handleDateChange = (date) => {
        setDate(date)
    }
    useEffect(() => {
        switch (date) {
            case "day": {
                OrderService.getOrdersForActualDay()
                    .then(response => {
                        console.log(response.data)
                        setData(response.data)
                    })
                    .catch(error => console.log(error))
            }
                break;
            case "week": {
                OrderService.getOrdersForActualWeek()
                    .then(response => setData(response.data))
                    .catch(error => console.log(error))
            }
                break;
            case "month": {
                OrderService.getOrdersForActualMonth()
                    .then(response => setData(response.data))
                    .catch(error => console.log(error))
            }
                break;
            default:
                break;
        }
    }, [date]);

    return (
        <div className="cardChartOrders">
            <div className="buttons-dateOrders">
                <button style={{backgroundColor: date === "day" ? "#949494" : "transparent"}}
                        onClick={() => handleDateChange("day")}>Jour
                </button>
                <button style={{backgroundColor: date === "week" ? "#949494" : "transparent"}}
                        onClick={() => handleDateChange("week")}>Semaine
                </button>
                <button style={{backgroundColor: date === "month" ? "#949494" : "transparent"}}
                        onClick={() => handleDateChange("month")}>Mois
                </button>
            </div>
            <div className="bubble1Orders"></div>
            <div className="bubble2Orders"></div>
            <i className='bx bxs-food-menu icone'></i>
            <div className="chart">
                <BarChart dataOrders={data}/>
            </div>
            <div className="text-incomeOrders">
                <h5>{data.reduce((accumulator, [date, value]) => {return accumulator + value;}, 0)}</h5>
                <b>Commandes</b>
            </div>
        </div>
    );
};
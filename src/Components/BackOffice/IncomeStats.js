import * as React from 'react';
import {BarChart} from "./BarChart";
import "../../assets/styles/DailyIncome.css"
import {useEffect, useState} from "react";
import TransactionService from "../../Services/TransactionService";
import "../../assets/styles/OrdersStats.css"
export function IncomeStats() {

    const [date, setDate] = useState("month")
    const [income, setIncome] = useState(0)
    const [data, setData] = useState([])

    const handleDateChange = (date) => {
        setDate(date)
    }

    useEffect(() => {
        switch (date) {
            case "day": {
                TransactionService.getIncomeForActualDay()
                    .then(response => setIncome(response.data))
                    .catch(error => console.log(error))
                TransactionService.getTransactionsForActualDay()
                    .then(response => setData(response.data))
                    .catch(error => console.log(error))
            }
                break;
            case "week": {
                TransactionService.getIncomeForActualWeek()
                    .then(response => setIncome(response.data))
                    .catch(error => console.log(error))
                TransactionService.getTransactionsForActualWeek()
                    .then(response => setData(response.data))
                    .catch(error => console.log(error))
            }
                break;
            case "month": {
                TransactionService.getIncomeForActualMonth()
                    .then(response => setIncome(response.data))
                    .catch(error => console.log(error))
                TransactionService.getTransactionsForActualMonth()
                    .then(response => setData(response.data))
                    .catch(error => console.log(error))
            }
                break;
            default:
                break;
        }
    }, [date]);


    return (
        <div className="cardChart">
            <div className="buttons-date">
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
            <div className="bubble1"></div>
            <div className="bubble2"></div>
            <i className='bx bxs-coin-stack icone'></i>
            <div className="chart">
                <BarChart dataIncome={data}/>
            </div>
            <div className="text-income">
                <h5>{income} €</h5>
                <b>Gains</b>
            </div>
        </div>
    );
};
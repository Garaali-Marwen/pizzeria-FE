import * as React from 'react';
import ReactApexChart from "react-apexcharts";
import {useEffect, useState} from "react";
import OrderService from "../../Services/OrderService";

export function StackedChart() {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({
        chart: {
            type: 'area',
            height: 350,
            stacked: true,
            events: {
                selection: function (chart, e) {
                    console.log(new Date(e.xaxis.min));
                },
            },
        },
        colors: ['#008FFB', '#00E396', '#ffa911'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.8,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (value) {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                }
            }
        }
    });

    const transformData = (data) => {
        const transformedSeries = [];

        for (const item of data) {
            const orderType = Object.keys(item)[0];
            const orderData = item[orderType];
            const seriesData = orderData.map(dataItem => ({
                x: new Date(dataItem[0]).getTime(),
                y: parseInt(dataItem[1])
            }));
            transformedSeries.push({
                name: orderType === "DELIVERY" ? "Livraison" : orderType === "TAKEAWAY" ? "A emporter" : "Sur place",
                data: seriesData
            });
        }

        return transformedSeries;
    };


    useEffect(() => {
        OrderService.getOrdersByOrderTypeAndDate()
            .then(response => {
                const formattedData = transformData(response.data);
                setSeries(formattedData);
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="area" height={350}/>
        </div>
    );
}
import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import {useEffect, useState} from "react";

export function BarChart({dataIncome, dataOrders}) {

    const [series, setSeries] = useState([
        {
            name: 'Gains',
            data: []
        }
    ]);

    useEffect(() => {
        if (dataIncome) {
            const processedData = dataIncome.map(transaction => {
                const dateTimestamp = new Date(transaction.date).getTime();
                const amount = transaction.order.price;
                return [dateTimestamp, amount];
            });

            setSeries([{name: 'Gains', data: processedData}]);
        }
    }, [dataIncome]);

    useEffect(() => {
        if (dataOrders) {
            const processedData = dataOrders.map(order => {
                const dateTimestamp = new Date(order[0]).getTime();
                const amount = order[1];
                return [dateTimestamp, amount];
            });

            setSeries([{name: 'Commandes', data: processedData}]);
        }
    }, [dataOrders]);

    const options = {
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: false,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom',
                show: false
            },
        },
        stroke: {
            show: true,
            curve: 'smooth',
            colors: ['#ece5e5'],
            width: 4,
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0
        },
        title: {
            text: '',
            align: 'left'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            },
            colors: ['#ffffff'],
        },
        grid: {
            show: false,
        },
        yaxis: {
            show: false,
            labels: {
                formatter: function (val) {
                    return val.toFixed(2);
                }
            },
            title: {
                text: ''
            }
        },
        xaxis: {
            axisBorder: {
                show: false,
            },
            labels: {
                show: false,
            },
            type: 'datetime',
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return (val).toFixed(2);
                }
            }
        }
    };

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="area" width={200}/>
        </div>
    );
};
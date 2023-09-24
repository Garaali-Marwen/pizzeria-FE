import * as React from 'react';
import ReactApexChart from "react-apexcharts";
import {useEffect, useState} from "react";
import CategoryService from "../../Services/CategoryService";

export function StackedColumnChart({year}) {

    const [series, setSeries] = useState([{
        name: "",
        data: ""
    }])
    useEffect(() => {
        CategoryService.getCategoryIncomeForYear(year)
            .then(response => {
                const newSeries = response.data.map(category => ({
                    name: category.name,
                    data: category.data
                }));
                setSeries(newSeries);
            })
            .catch(error => console.log(error))
    }, []);

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            type: 'category',
            categories: [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ],
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        }
    };

    return (
        <div id="chart">
            {series[0].data.length === 12 &&
                <ReactApexChart options={options} series={series} type="bar"/>
            }
        </div>
    );
};
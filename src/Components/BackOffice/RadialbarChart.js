import * as React from 'react';
import ReactApexChart from "react-apexcharts";
import {useEffect, useState} from "react";
import CategoryService from "../../Services/CategoryService";

export function RadialbarChart({category}) {
    const [series, setSeries] = useState([]);
    const [labels, setLabels] = useState([]);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        if (category)
            CategoryService.getOrdersCountByItemAndCategory(category)
                .then(response => {
                    const data = response.data.Data;
                    const sum = data.reduce((acc, currentValue) => acc + currentValue, 0);
                    const percentages = data.map(value => Math.round((value / sum) * 100));
                    setSeries(percentages);
                    setLabels(response.data.Labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)));
                    setTotal(sum);
                })
                .catch(error => console.log(error))
    }, [category]);

    const options = {
        chart: {
            height: 350,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w) {
                            return total;
                        },
                    },
                },
            },
        },
        labels: labels,
    };

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="radialBar" height={350}/>
        </div>
    );
};
import * as React from 'react';
import {useEffect, useState} from "react";
import {ItemCard} from "./Item-Card";
import PropTypes from "prop-types";
import {Box, Tab, Tabs} from "@mui/material";
import CategoryService from "../../Services/CategoryService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Stomp} from "@stomp/stompjs";
import SockJS from 'sockjs-client';

function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export function ItemsList({updateCartItemCount}) {

    const [stockUpdate, setStockUpdate] = useState(0)
    useEffect(() => {
        let stompClient = Stomp.over(() => new SockJS('http://localhost:8080/ws'));
        let subscription;
        stompClient.connect(
            {},
            () => {
                subscription = stompClient.subscribe('/stockUpdate', (message) => {
                    setStockUpdate(prevState => prevState + 1)
                });

            },
            (error) => {
                console.error('WebSocket connection error:', error);
            }
        );

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 770,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const [categories, setCategories] = useState([])
    useEffect(() => {
        CategoryService.getAllCategories().then(
            response => {
                setCategories(response.data)
            }
        ).catch(
            error => console.log(error)
        )
    }, [])
    const onUpdateCartItemCount = () => {
        setStockUpdate(prevState => prevState + 1)
        updateCartItemCount()
    }

    return (

        <div className="container mt-5">
            <Box sx={{textAlign: 'center'}}>
                <h1 className="price text-white" style={{fontWeight: "bold"}}>Nos Offres Spéciales</h1>
                <img src="https://img.icons8.com/?size=512&id=csCQmEEpNLB7&format=png"
                     style={{width: '60px', height: '60px'}} alt=""/>
                <div className="tab-container" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <Tabs
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "#6cc305",
                            }
                        }}
                        centered value={value} onChange={handleChange} aria-label="basic tabs example"
                        sx={{
                            "& .css-1wf8b0h-MuiTabs-flexContainer": {
                                display: 'flex',
                                flexWrap: 'wrap',
                            }
                        }}
                    >
                        {categories.filter(category => category.items.length > 0).map((category, index) => (
                            <Tab style={{ color: '#fdfdfe', fontWeight: 'bold' }} key={category.id}
                                 label={category.name} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                </div>

                {categories.filter(category => category.items.length > 0).map((category, index) => (
                    <CustomTabPanel key={category.id} value={value} index={index}>
                        <div style={{marginTop: '20px'}}>
                            <Slider {...settings} slidesToShow={Math.min(category.items.length, settings.slidesToShow)}>
                                {category.items.map(item => (
                                    <ItemCard key={item.id} item={item}
                                              onAddToCart={onUpdateCartItemCount} stockUpdate={stockUpdate}/>
                                ))}
                            </Slider>
                        </div>

                    </CustomTabPanel>
                ))}
            </Box>
        </div>
    );
};
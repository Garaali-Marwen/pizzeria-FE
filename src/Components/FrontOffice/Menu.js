import React, {useEffect, useRef, useState} from 'react';
import CategoryService from "../../Services/CategoryService";
import "../../assets/styles/Menu.css"
import {ItemCard} from "./Item-Card";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {useLocation} from "react-router-dom";
import {CircularProgress} from "@mui/material";

export function Menu({updateCartItemCount}) {

    const [categories, setCategories] = useState([])
    const [stockUpdate, setStockUpdate] = useState(0)
    const selectedCategoryName = new URLSearchParams(useLocation().search).get('category');
    const selectedCategoryRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading && selectedCategoryName && selectedCategoryRef.current) {
            setTimeout(() => {
                selectedCategoryRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 500);
        }
    }, [selectedCategoryName, loading]);


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

    useEffect(() => {
        CategoryService.getAllCategories()
            .then(response => {
                setCategories(response.data)
                setLoading(false);
            })
            .catch(error => console.log(error))
    }, [stockUpdate]);

    const onUpdateCartItemCount = () => {
        setStockUpdate(prevState => prevState + 1)
        updateCartItemCount()
    }

    return (
        <div>
            {loading ?
                <div style={{
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <CircularProgress style={{width: 200, height: 200}} color="success"/>
                </div>
                :
                categories.map((category) => {
                    if (category.items.length) {
                        return (
                            <div key={category.id} className="categoryBG"
                                 style={{
                                     backgroundImage: `url(${'data:image/png;base64,' + category.image.imageBytes})`
                                 }}
                                 ref={(ref) => {
                                     if (category.name === selectedCategoryName) {
                                         selectedCategoryRef.current = ref;
                                     }
                                 }}
                            >
                                <div className="categoryTitle">
                                    <p>{category.name}</p>
                                </div>
                                <div className="content">
                                    {category.items.map((item) => (
                                        <div key={item.id} className="item-card-container">
                                            <ItemCard onAddToCart={onUpdateCartItemCount} stockUpdate={stockUpdate}
                                                      item={item}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })
            }

        </div>
    );
};
import * as React from 'react';
import {useEffect, useState} from "react";
import OrderService from "../../Services/OrderService";
import UserService from "../../Services/UserService";
import {ClientOrderCard} from "./ClientOrderCard";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {FormControl, MenuItem, Select, TablePagination} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import Tooltip from "@mui/material/Tooltip";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import {Link} from "react-router-dom";

export function ClientOrders() {

    const [filter, setFilter] = useState("Aujourd'hui")
    useEffect(() => {
        let stompClient = Stomp.over(() => new SockJS('http://localhost:8080/ws'));
        let subscription;
        stompClient.connect(
            {},
            () => {
                subscription = stompClient.subscribe('/orderUpdate', (message) => {
                    changePage()
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

    const [orders, setOrders] = useState({
        content: [],
        totalPages: '',
        totalElements: '',
        pageSize: 10,
        lastPage: false,
        pageNumber: ''

    })
    useEffect(() => {
        changePage()
    }, [filter]);


    const methodMap = {
        "Tous": OrderService.getOrdersByClient_Id,
        "Aujourd'hui": OrderService.getOrdersOfTodayByClient_IdOrderByDateDesc,
        "En cours": OrderService.getOrdersByClient_IdAndState_PendingOrderByDateDesc,
        "Prete": OrderService.getOrdersByClient_IdAndState_ReadyOrderByDateDesc
    };
    const changePage = (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > orders.pageNumber && orders.lastPage) {
            return
        }
        if (pageNumber < orders.pageNumber && orders.pageNumber === 0) {
            return
        }
        const method = methodMap[filter];
        method(UserService.getUserId(), pageNumber, pageSize)
            .then(response => {
                window.scrollTo({top: 0, behavior: 'smooth'});
                setOrders({
                    content: response.data.content,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageSize: response.data.pageable.pageSize,
                    lastPage: response.data.last,
                    pageNumber: response.data.pageable.pageNumber
                })
            })
            .catch(error => {
                console.error(error)

            })
    }

    const handleChangePage = (event, newPage) => {
        changePage(newPage, orders.pageSize)
    };

    const handleChangeRowsPerPage = (event) => {
        changePage(0, parseInt(event.target.value, 10))
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
    }


    return (
        <div className="h-100">
            <div className="w-100">
                <div className="p-5">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <h1 className="card-title text-start">Mes Commandes</h1>

                        <div className="d-flex align-items-center gap-2">
                            <Tooltip title="Filtrer">
                                <FilterListIcon style={{fontSize: "40px"}}/>
                            </Tooltip>
                            <FormControl variant="standard" style={{width: "max-content"}}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={filter}
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value={"Tous"}>Tous</MenuItem>
                                    <MenuItem value={"Aujourd'hui"}>Aujourd'hui</MenuItem>
                                    <MenuItem value={"En cours"}>En cours</MenuItem>
                                    <MenuItem value={"Prete"}>Prête</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="border-top"></div>
                </div>

                {orders.content.length ?
                    <div className="mb-5 d-flex flex-column gap-4 align-items-center container">
                        {orders.content.map(order => (
                            <ClientOrderCard key={order.id} order={order}/>
                        ))}

                        <div className="pagination-Items">
                            <TablePagination
                                component="div"
                                count={orders.totalElements}
                                page={orders.pageNumber}
                                onPageChange={handleChangePage}
                                rowsPerPage={orders.pageSize}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                // rowsPerPageOptions={[10, 15, 25, 50]}
                            />
                        </div>
                    </div>
                    :
                    <div className=" mb-5 container d-flex flex-column align-items-center pt-5 text-center">
                        <ProductionQuantityLimitsIcon style={{fontSize: '300px', color: '#333230'}}/>
                        <h1 style={{
                            fontSize: 'xxx-large',
                            color: '#333230',
                            fontWeight: "bold",
                            textTransform: "capitalize"
                        }}>
                            Vous n'avez pas de commandes {filter}
                        </h1>
                        <button className="menu-button" style={{backgroundColor: "#333230"}}>
                            <Link className="navbar-text text-decoration-none" to="/menu">
                                RETOUR AU MENU
                            </Link>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};
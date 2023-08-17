import * as React from 'react';
import {useEffect, useState} from 'react';
import OrderService from '../../Services/OrderService';
import {Stomp} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import OrderCard from "./Order-Card";
import Pagination from '@mui/material/Pagination';
import {FormControl, InputBase, MenuItem, Select} from "@mui/material";
import {styled} from "@mui/material/styles";


const BootstrapInput = styled(InputBase)(({ theme }) => ({
        '& .MuiInputBase-input': {
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        fontSize: 16,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: 'none',
            boxShadow: 'none',
        },
    },
}));

export function OrdersList() {

    const [orderContent, setOrderContent] = useState({
        content: [],
        totalPages: '',
        totalElements: '',
        pageSize: 10,
        lastPage: false,
        pageNumber: ''

    })

    useEffect(() => {
        changePage()
    }, [])

    useEffect(() => {
        let stompClient = Stomp.over(() => new SockJS('http://localhost:8080/ws'));
        let subscription;
        stompClient.connect(
            {},
            () => {
                subscription = stompClient.subscribe('/newOrder', (message) => {
                    const newOrder = JSON.parse(message.body);
                    OrderService.getOrderById(newOrder)
                        .then(response => {
                            changePage()
                        })
                        .catch(error => console.log(error))
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

    const handleUpdateOrder = (orderUpdated) => {
        OrderService.updateOrder(orderUpdated)
            .then(response => {
                setOrderContent(prevState => {
                    return {
                        ...prevState,
                        content: prevState.content.map(order => {
                            if (order.id === orderUpdated.id) {
                                return orderUpdated;
                            } else {
                                return order;
                            }
                        })
                    }
                });
            })
            .catch(error => console.log(error))
    }
    const changePage = (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > orderContent.pageNumber && orderContent.lastPage) {
            return
        }
        if (pageNumber < orderContent.pageNumber && orderContent.pageNumber === 0) {
            return
        }
        OrderService.getAllTodayOrders(pageNumber, pageSize)
            .then(response => {
                window.scrollTo({top: 0, behavior: 'smooth'});
                setOrderContent({
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
    const getOrderNumber = (index) => {
        const {pageSize, pageNumber, totalElements} = orderContent;
        const startingNumber = totalElements - (pageSize * pageNumber);
        return startingNumber - index - 1;
    };

    return (
        <div className="container mt-5">
            <div className="p-3 w-100 h-100">
                {orderContent.content.length > 0 ?
                    <div className="container d-flex flex-column align-items-center gap-4">
                        {orderContent.content.map((order, index) => (
                            <OrderCard key={order.id} onUpdate={handleUpdateOrder} order={order}
                                       index={getOrderNumber(index)}/>
                        ))}
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center">
                                <p className="m-0">Rows per page: </p>
                                <FormControl sx={{ m: 1 }}>
                                    <Select
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        input={<BootstrapInput />}
                                        value={orderContent.pageSize}
                                        onChange={(e) => changePage(0, e.target.value)}
                                    >
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <Pagination page={parseInt(orderContent.pageNumber, 10) + 1} count={orderContent.totalPages} onChange={(e, value) => changePage(value - 1)}/>
                        </div>
                    </div>
                    :
                    <h1 className="w-100 text-center" style={{fontSize: '50px', fontWeight: "bold"}}>No orders
                        for today!</h1>
                }

            </div>
        </div>
    );
}

import * as React from 'react';
import {useEffect, useState} from 'react';
import {CartItem} from "./Cart-Item";
import '../../assets/styles/Cart.css'
import OrderItemService from "../../Services/OrderItemService";
import UserService from "../../Services/UserService";
import SnackbarMessage from "../SnackbarMessage";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import Checkout from "./Checkout";
import {FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Switch} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {FormGroup} from "reactstrap";
import {styled} from "@mui/material/styles";
import {MapStreet} from "./MapStreet";
import {Link} from "react-router-dom";


const MaterialUISwitch = styled(Switch)(({theme}) => ({
    width: 47,
    height: 23,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 2,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('https://img.icons8.com/?size=512&id=82832&format=png')`,
                backgroundSize: '13px 13px',
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#6cc305' : '#6cc305',
        width: 18,
        height: 18,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('https://img.icons8.com/?size=512&id=zgux9eomxqKF&format=png')`,
            backgroundSize: '13px 13px',
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const MaterialUISwitch2 = styled(Switch)(({theme}) => ({
    width: 47,
    height: 23,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 2,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('https://img.icons8.com/?size=512&id=oMM8U0oNciHI&format=png')`,
                backgroundSize: '13px 13px',
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#6cc305' : '#6cc305',
        width: 18,
        height: 18,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('https://img.icons8.com/?size=512&id=zgux9eomxqKF&format=png')`,
            backgroundSize: '13px 13px',
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));


export function Cart({updateCartItemCount}) {
    const [update, setUpdate] = useState(false)
    const [orderItems, setOrderItems] = useState([])
    const [unavailability, setUnavailability] = useState(false)
    const [payment, setPayment] = useState(false);
    const [stockUpdate, setStockUpdate] = useState(0)
    const [orderType, setOrderType] = useState("DINE_IN")
    const [comment, setComment] = useState("")
    const [sms, setSms] = useState(false)
    const [address, setAddress] = useState({latitude: "", longitude: ""})
    const [invalidAddress, setInvalidAddress] = useState(false)


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

    const handleAddressUpdate = (address) => {
        setInvalidAddress(false)
        setAddress(address)
    }
    const handleAddingNewOrder = () => {
        if (!unavailability) {
            if (UserService.isLoggedIn()) {
                if (orderType === "DELIVERY") {
                    if (address.latitude.length !== 0) {
                        setPayment(!payment)
                    } else {
                        setInvalidAddress(true)
                        return;
                    }
                } else
                    setPayment(!payment)
            } else {
                alert('Vous devez être connecté');
            }
        }
    }

    const handleDeleteOrderItem = (id) => {
        if (UserService.isLoggedIn()) {
            OrderItemService.deleteOrderItem(id)
                .then(response => {
                    setOrderItems(prevOrderItems => prevOrderItems.filter(item => item.id !== id));
                    setMessage('Item successfully deleted')
                    setUpdate(prevState => !prevState)
                })
                .catch(error => console.log(error));
        } else {
            setOrderItems(prevOrderItems => prevOrderItems.filter(item => item.id !== id));
            UserService.deleteItemFromCart(id)
            setMessage('Item successfully deleted')
            setUpdate(prevState => !prevState)
        }
    };

    const handleUpdateOrderItem = (orderItem) => {
        const ingredientMap = new Map();
        orderItem.ingredients.forEach(ingredient => {
            ingredientMap.set(ingredient.id, ingredient);
        });
        orderItem.ingredients = Array.from(ingredientMap.values());
        if (UserService.isLoggedIn()) {
            OrderItemService.updateOrderItem(orderItem)
                .then(response => {
                    setOrderItems((prevState) =>
                        prevState.map((order) =>
                            order.id === response.data.id ? response.data : order
                        )
                    );
                })
                .catch(error => console.log(error));
        } else {
            UserService.updateItemCart(totalPriceOrder(orderItem))
            setOrderItems(UserService.getCart())
        }
    };

    const totalPriceOrder = (order) => {
        let total = order.item.price
        if (order.item.sizes.length > 0 && order.size)
            for (let size of order.item.sizes)
                if (size.size === order.size)
                    total = size.price
        if (order.ingredients.length > 0)
            for (let additionalIng of order.ingredients)
                for (let itemIngredient of order.item.itemIngredients)
                    if (additionalIng.id === itemIngredient.ingredient.id)
                        total += itemIngredient.price
        order.price = order.quantity * total;
        return order;
    }

    const getOrderItemsByClientId = () => {
        OrderItemService.getOrderItemsByClientId(UserService.getUserId())
            .then(response => {
                setOrderItems(response.data)
                updateCartItemCount()
            })
            .catch(error => console.log(error))
    }

    const verifyItemAvailability = async (orderItem) => {
        try {
            let request = {orderItem, ingredients: [], orderItems: []};

            if (UserService.isLoggedIn()) {
                const userOrderItemsResponse = await OrderItemService.getOrderItemsByClientId(UserService.getUserId());
                if (userOrderItemsResponse.data.length) {
                    request.orderItems = userOrderItemsResponse.data.filter(item => item.id !== orderItem.id);
                }
            } else {
                const cartOrders = UserService.getCart();
                if (cartOrders.length > 0) {
                    request.orderItems = cartOrders.filter(item => item.id !== orderItem.id);
                }
            }

            const verifyResponse = await OrderItemService.verifyItemAvailability(request);
            return verifyResponse.data.quantity === 0

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const checkAvailability = async () => {
            const availabilityPromises = orderItems.map(orderItem => verifyItemAvailability(orderItem));
            const availabilities = await Promise.all(availabilityPromises);

            if (availabilities.some(availability => availability === true))
                setUnavailability(true)
            else setUnavailability(false)
        };

        checkAvailability();
    }, [orderItems, stockUpdate]);

    useEffect(() => {
        if (UserService.isLoggedIn()) {
            getOrderItemsByClientId()
        } else {
            setOrderItems(UserService.getCart)
            updateCartItemCount()
        }
        console.log("get orders")

    }, [update, stockUpdate])

    const [message, setMessage] = useState('')
    const handleSnackBarClose = () => {
        setMessage('')
    }

    const removeDuplicateIngredients = (orderItem) => {
        const ingredientMap = new Map();
        orderItem.ingredients.forEach(ingredient => {
            if (!ingredientMap.has(ingredient.id)) {
                ingredientMap.set(ingredient.id, ingredient);
            }
        });
        const updatedIngredients = Array.from(ingredientMap.values());
        return {...orderItem, ingredients: updatedIngredients};
    };

    return (
        <div className="container cart-body">
            {orderItems.length > 0 ?
                <>
                    <div className="cart-items">
                        {orderItems.map(orderItem => {
                            const orderItemWithoutDuplicates = removeDuplicateIngredients(orderItem);
                            return (
                                <CartItem key={orderItem.id} stockUpdate={stockUpdate}
                                          orderItem={orderItemWithoutDuplicates}
                                          onDelete={handleDeleteOrderItem} onUpdate={handleUpdateOrderItem}/>
                            );
                        })}
                    </div>
                    <div className="summary">
                        {payment ?
                            <>
                                <IconButton aria-label="Back"
                                            style={{position: 'absolute', left: '10px', color: '#ffffff'}}
                                            onClick={() => setPayment(!payment)}>
                                    <ArrowBackIosIcon/>
                                </IconButton>
                                <Checkout order={{
                                    client: {
                                        id: UserService.getUserId(),
                                    },
                                    price: orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.price, orderType === "DELIVERY" ? 5 : 0),
                                    orderItems: orderItems,
                                    orderType: orderType,
                                    comment: comment,
                                    smsNotification: sms,
                                    address: address
                                }}/>
                            </>
                            :
                            <>
                                <h3>Résumé</h3>
                                <hr/>
                                <div className="summary-items">
                                    {orderItems.map(orderItem => (
                                        <div className="d-flex w-100 justify-content-between" key={orderItem.id}
                                             style={{color: orderItem.quantity === 0 ? '#fd0001' : '#eeeeee'}}>
                                            <p>- {orderItem.item.name}</p>
                                            <div className="d-flex gap-1">
                                                <p style={{color: '#6cc205'}}>x</p>
                                                <p>{orderItem.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <FormControl>
                                                <FormLabel id="demo-radio-buttons-group-label">
                                                    <b style={{color: "#ededed"}}>- Type de commande </b>
                                                </FormLabel>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="female"
                                                    name="radio-buttons-group"
                                                    value={orderType}
                                                    onChange={(e) => setOrderType(e.target.value)}
                                                >
                                                 <div className="d-flex align-items-center justify-content-between">
                                                     <div style={{display: "flex", alignItems: "center"}}>
                                                         <FormControlLabel value="DINE_IN" control={<Radio style={{color: "#6cc305"}} />} label="Sur place" />
                                                         <FormControlLabel value="TAKEAWAY" control={<Radio style={{color: "#6cc305"}} />} label="A emporter" />
                                                         <FormControlLabel value="DELIVERY" control={<Radio style={{color: "#6cc305"}} />} label="Livraison (5 €)" />
                                                     </div>
                                                 </div>
                                                  </RadioGroup>
                                            </FormControl>
                                        </div>
                                    </div>

                                    {orderType === "DELIVERY" &&
                                        <div style={{
                                            position: "relative",
                                            border: invalidAddress ? "2px solid #fd0001" : "1px solid transparent",
                                            height: "200px",
                                        }}>
                                            <MapStreet onUpdateAddress={handleAddressUpdate}/>
                                            <div style={{
                                                color: "#fd0001",
                                                backgroundColor: "rgba(82,82,82,0.26)",
                                                width: "100%",
                                                textAlign: "center",
                                                position: "absolute",
                                                top: 0,
                                                display: invalidAddress ? "block" : "none"
                                            }}>
                                                <b>Vous devez choisir une adresse!</b>
                                            </div>
                                        </div>
                                    }

                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <FormGroup>
                                                <b>- Notification par SMS </b>
                                                <FormControlLabel
                                                    control={<MaterialUISwitch sx={{ml: 1}}
                                                                               checked={sms}
                                                                               onChange={() => setSms(!sms)}/>}
                                                    label=""
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>

                                    <textarea rows={3}
                                              style={{
                                                  backgroundColor: "rgba(33,30,30,0.24)",
                                                  width: "100%",
                                                  marginTop: "10px",
                                                  borderRadius: "10px",
                                                  border: "2px solid #211e1e",
                                                  padding: "5px",
                                                  color: "#ffffff",
                                              }}
                                              placeholder="Ajouter un commentaire"
                                              onChange={(e) => setComment(e.target.value)}/>
                                </div>

                                <div className="summary-Price">
                                    <h3>Prix Total
                                        : <b>{orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.price, orderType === "DELIVERY" ? 5 : 0)} €</b>
                                    </h3>
                                </div>

                                <button
                                    style={{cursor: unavailability ? 'not-allowed' : 'pointer'}}
                                    onClick={handleAddingNewOrder} className="summary-Button">
                                    Commander
                                </button>
                            </>
                        }
                    </div>
                </>
                :
                <div className="container d-flex flex-column align-items-center pt-5 text-center">
                    <ProductionQuantityLimitsIcon style={{fontSize: '300px', color: '#fdfdfe'}}/>
                    <h1 style={{fontSize: '50px', color: 'white', fontWeight: "bold"}}>Votre panier est actuellement vide</h1>
                    <button className="menu-button">
                        <Link className="navbar-text text-decoration-none" to="/menu">
                            RETOUR AU MENU
                        </Link>
                    </button>
                </div>
            }

            <SnackbarMessage message={message} severity="success" onClose={handleSnackBarClose}/>
        </div>
    )
        ;
}
;
import * as React from 'react';
import {useEffect, useState} from 'react';
import "../../assets/styles/Item-card.css"
import {Checkbox, IconButton, tooltipClasses} from "@mui/material";
import OrderItemService from "../../Services/OrderItemService";
import UserService from "../../Services/UserService";
import SnackbarMessage from "../SnackbarMessage";
import Tooltip from "@mui/material/Tooltip";
import {styled} from "@mui/material/styles";


const HtmlTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export function ItemCard({item, onAddToCart, stockUpdate}) {

    const [unavailableIngredients, setUnavailableIngredients] = useState([])
    const [availability, setAvailability] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [chosenSize, setChosenSize] = useState({})
    const [totalPrice, setTotalPrice] = useState(item.price)
    const [showAdditionalIngredients, setShowAdditionalIngredients] = useState(false)
    const [additionalIngredients, setAdditionalIngredient] = useState([])
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [orderItem, setOrderItem] = useState({
        item: item,
        ingredients: [],
        size: chosenSize,
        quantity: quantity
    })


    const handleQuantity = (operator) => {
        if (operator === '+' && availability) {
            {
                setQuantity(prev => prev + 1)
            }
        } else if (operator === '-' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };

    const handleChosenSize = (size) => {
        setChosenSize(size);
    };


    const handleTotalPrice = () => {
        let total = item.price
        if (Object.keys(chosenSize).length > 0) {
            total = chosenSize.price
        }
        if (additionalIngredients.length > 0) {
            total += additionalIngredients.reduce((accumulator, ingredient) => {
                return accumulator + ingredient.price;
            }, 0);
        }
        setTotalPrice(total * quantity)
    }

    const handleShowingAdditionalIngredients = () => {
        if (availability || showAdditionalIngredients)
            setShowAdditionalIngredients(!showAdditionalIngredients)
    }
    const handleAdditionalIngredients = (ingredient, price) => {
        ingredient.price = price
        setAdditionalIngredient((prevIngredients) => {
            const ingredientExists = prevIngredients.some((prevIngredient) => prevIngredient.id === ingredient.id);
            if (ingredientExists) {
                verifyItemAvailability({
                    item: item,
                    ingredients: prevIngredients.filter((prevIngredient) => prevIngredient.id !== ingredient.id),
                    quantity: quantity
                })
                return prevIngredients.filter((prevIngredient) => prevIngredient.id !== ingredient.id);
            } else {
                verifyItemAvailability({
                    item: item,
                    ingredients: [...prevIngredients, ingredient],
                    quantity: quantity
                })
                return [...prevIngredients, ingredient];
            }
        });
    }


    const handleOrderItem = () => {
        if (UserService.isLoggedIn()) {
            setOrderItem({
                item: item,
                ingredients: additionalIngredients,
                size: chosenSize.size,
                quantity: quantity,
                client: {
                    id: UserService.getUserId()
                },
                price: totalPrice
            })
        } else {
            setTimeout(() => {
                setOrderItem({
                    id: parseInt(Date.now() * Math.random()).toString(),
                    item: item,
                    ingredients: additionalIngredients,
                    size: chosenSize.size,
                    quantity: quantity,
                    client: {
                        id: ''
                    },
                    price: totalPrice
                });
            }, 1000);

        }
    }


    useEffect(() => {
        if (item.sizes.length > 0) {
            setChosenSize(item.sizes[0])
            setTotalPrice(item.sizes[0].price)
        }
    }, [])

    useEffect(() => {
        handleTotalPrice()
        handleOrderItem()
    }, [chosenSize, additionalIngredients, quantity, totalPrice]);

    useEffect(() => {
        verifyItemAvailability({
            item: item,
            ingredients: additionalIngredients,
            quantity: quantity
        })
    }, [quantity, stockUpdate]);


    const verifyItemAvailability = async (orderItem) => {
        try {
            let request = {orderItem, ingredients: unavailableIngredients, orderItems: []};

            if (UserService.isLoggedIn()) {
                const userOrderItemsResponse = await OrderItemService.getOrderItemsByClientId(UserService.getUserId());
                if (userOrderItemsResponse.data.length) {
                    request.orderItems = userOrderItemsResponse.data;
                }
            } else {
                const cartOrders = UserService.getCart();
                if (cartOrders.length > 0) {
                    request.orderItems = cartOrders;
                }
            }

            const verifyResponse = await OrderItemService.verifyItemAvailability(request);
            if (verifyResponse.data.quantity === 0) {
                setAvailability(false);
                setQuantity(1)
                if (verifyResponse.data.unavailableIngredients.length > 0) {
                    setAdditionalIngredient(prevIngredients => {
                        return prevIngredients.filter(ingredient => !verifyResponse.data.unavailableIngredients.includes(ingredient.id));
                    });
                }
            } else {
                setAvailability(true);
                setUnavailableIngredients(verifyResponse.data.unavailableIngredients);
                if (quantity !== verifyResponse.data.quantity)
                    setQuantity(verifyResponse.data.quantity);
            }

        } catch (error) {
            console.error(error);
        }
    };


    function areIngredientsEqual(orderItem1, orderItem2) {
        if (orderItem1.length !== orderItem2.length) {
            return false;
        }

        const sortedOrderItem1 = orderItem1.slice().sort();
        const sortedOrderItem2 = orderItem2.slice().sort();

        for (let i = 0; i < sortedOrderItem1.length; i++) {
            if (sortedOrderItem1[i] !== sortedOrderItem2[i]) {
                return false;
            }
        }

        return true;
    }


    async function addItemToCart() {
        const isConnected = UserService.isLoggedIn();
        if (availability) {
            try {
                const response = isConnected
                    ? await OrderItemService.getOrderItemsByClientId(UserService.getUserId())
                    : {data: UserService.getCart()};

                const matchingOrder = response.data.find(order => order.item.id === orderItem.item.id);

                if (matchingOrder && areIngredientsEqual(matchingOrder.ingredients.map(ing => ing.id), orderItem.ingredients.map(ing => ing.id))) {
                    matchingOrder.quantity += orderItem.quantity;
                    isConnected
                        ? await OrderItemService.updateOrderItem(matchingOrder)
                        : UserService.updateExistingItemCart(matchingOrder);
                } else {
                    isConnected
                        ? await OrderItemService.addOrderItem(orderItem)
                        : UserService.setCart(orderItem);
                }
                setQuantity(prevState => {
                    if (prevState === 1) {
                        verifyItemAvailability({
                            item: item,
                            ingredients: additionalIngredients,
                            quantity: quantity
                        })
                    }
                    return 1;
                })
                setAdditionalIngredient([])
                setShowAdditionalIngredients(false)
                onAddToCart();
                setSnackbarMessage('Item added successfully to the cart!');
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    }

    const handleSnackbarClose = () => {
        setSnackbarMessage('');
    };


    return (
        <div className="item-card">
            <div className="body">
                <div className="availability" style={{display: !availability ? 'block' : "none"}}>
                    <h5>Indisponible</h5>
                </div>
                {showAdditionalIngredients &&
                    <div className="ingredients">
                        <div className="ingredients-list">
                            {item.itemIngredients.map((itemIngredient) => (
                                itemIngredient.type === "SECONDARY" &&
                                <div className="single-ingredient" key={itemIngredient.id}>
                                    {itemIngredient.ingredient.name}
                                    <div className="d-flex align-items-center justify-content-between"
                                         style={{width: '130px'}}>
                                        <div className="d-flex align-items-center">
                                            <Checkbox
                                                style={{
                                                    color: (
                                                        (unavailableIngredients.indexOf(itemIngredient.ingredient.id) !== -1
                                                            &&
                                                            !additionalIngredients.some((ingredient) => ingredient.id === itemIngredient.ingredient.id))
                                                            ? "#ff0000"
                                                            : "#6cc305"
                                                    )
                                                }}
                                                onClick={() => handleAdditionalIngredients(itemIngredient.ingredient, itemIngredient.price)}
                                                checked={additionalIngredients.some((ingredient) => ingredient.id === itemIngredient.ingredient.id)}
                                                disabled={unavailableIngredients.indexOf(itemIngredient.ingredient.id) !== -1 && !additionalIngredients.some((ingredient) => ingredient.id === itemIngredient.ingredient.id)}
                                            />


                                            {itemIngredient.price} €
                                        </div>

                                        <HtmlTooltip
                                            title={
                                                <React.Fragment>
                                                    <b>Quantité indisponible !</b>
                                                </React.Fragment>
                                            }
                                        >
                                            <i
                                                className='bx bx-info-circle'
                                                style={{
                                                    display: unavailableIngredients.indexOf(itemIngredient.ingredient.id) !== -1 && !additionalIngredients.some((ingredient) => ingredient.id === itemIngredient.ingredient.id) ? "block" : "none",
                                                    color: '#fb6501',
                                                    fontSize: '20px',
                                                    marginLeft: '10px',
                                                    cursor: 'pointer'
                                                }}
                                            ></i>
                                        </HtmlTooltip>
                                    </div>
                                </div>
                            ))}

                        </div>

                        <button onClick={handleShowingAdditionalIngredients}>
                            Ingrédients supplémentaires
                            <i className='bx bx-minus'></i>
                        </button>
                    </div>
                }
                <div>
                    <div className="image-container">
                        <img className="item-image"
                             src={'data:image/png;base64,' + item.image.imageBytes}/>
                    </div>
                    <div className="item-card-content">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        {item.sizes.length > 0 &&
                            <div className="sizes">
                                {item.sizes.map((size) => (
                                    <button onClick={() => handleChosenSize(size)}
                                            className={size.id === chosenSize.id ? 'clicked-button' : 'non-clicked-button'}
                                            key={size.id}>
                                        {size.size}
                                    </button>
                                ))}
                            </div>
                        }

                        {item.itemIngredients.length > 0 &&
                            <div className="additional-ingredients">
                                <button style={{cursor: availability ? "pointer" : "not-allowed"}}
                                        onClick={handleShowingAdditionalIngredients}>
                                    Ingrédients supplémentaires
                                    <i className='bx bx-plus'></i>
                                </button>
                            </div>
                        }
                    </div>
                </div>

            </div>

            <div className="position-relative">
                <div className="quantity-button">
                    <IconButton style={{background: "none", color: '#ffffff'}} onClick={() => handleQuantity('-')}>
                        <i className='bx bx-minus'></i>
                    </IconButton>
                    <input readOnly onChange={(e) => handleQuantityChange(e)} type="number" value={quantity}/>
                    <IconButton style={{background: "none", color: '#ffffff'}} onClick={() => handleQuantity('+')}>
                        <i className='bx bx-plus'></i>
                    </IconButton>
                </div>
                <p className="price">Prix : <b style={{color: '#fd0001', fontSize: '20px'}}>{totalPrice} €</b>
                </p>
                {(UserService.getRole() !== "EMPLOYEE" && UserService.getRole() !== "ADMIN") &&
                    <button onClick={addItemToCart} className="add-to-cart"
                            style={{cursor: availability ? "pointer" : "not-allowed"}}>
                        Ajouter au panier
                        <i className='bx bxs-cart-add'></i>
                    </button>
                }
            </div>


            <SnackbarMessage
                message={snackbarMessage}
                severity="success"
                onClose={handleSnackbarClose}
            />
        </div>
    );
}
;
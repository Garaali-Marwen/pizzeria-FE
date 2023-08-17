import * as React from 'react';
import {useEffect, useState} from 'react';
import '../../assets/styles/Cart-Item.css'
import {
    Avatar,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, tooltipClasses
} from "@mui/material";
import Slide from '@mui/material/Slide';
import OrderItemService from "../../Services/OrderItemService";
import UserService from "../../Services/UserService";
import {styled} from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

export function CartItem({orderItem, onDelete, onUpdate, stockUpdate}) {

    const [order, setOrderItem] = useState(orderItem)
    const [quantity, setQuantity] = useState(orderItem.quantity)
    const [update, setUpdate] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [unavailableIngredients, setUnavailableIngredients] = useState([])
    const [availability, setAvailability] = useState(true)
    const [addAdditionalIngredients, setAddAdditionalIngredients] = useState(false)
    const [changeSize, setChangeSize] = useState(false)

    const verifyItemAvailability = async (orderItem) => {
        try {
            let request = {orderItem, ingredients: unavailableIngredients, orderItems: []};

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
            if (verifyResponse.data.quantity === 0) {
                setAvailability(false);
                setUnavailableIngredients(verifyResponse.data.unavailableIngredients);
            } else {
                setAvailability(true)
                setUnavailableIngredients(verifyResponse.data.unavailableIngredients);
                if (quantity !== verifyResponse.data.quantity)
                    setQuantity(verifyResponse.data.quantity)
                onUpdate({...orderItem, quantity: verifyResponse.data.quantity})
            }

        } catch (error) {
            console.error(error);
        }
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDelete = () => {
        onDelete(orderItem.id)
    }
    const handleClose = () => {
        setOpen(false);
    };
    const handleQuantity = (operator) => {
        if (operator === '+' && availability) {
            setQuantity(prev => {
                setUpdate(!update)
                return prev + 1
            })
        } else if (operator === '-' && quantity > 1) {
            setQuantity(prev => {
                setUpdate(!update)
                return prev - 1
            })
        }
    };
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            setQuantity(prev => {
                setUpdate(!update)
                return newQuantity
            });
        }
    };

    const handleAddingAdditionalIngredients = () => {
        setAddAdditionalIngredients(prev => !prev)
    }

    const handleChangingSize = () => {
        setChangeSize(prev => !prev)
    }

    const handleOrderItemSizeChanging = (size) => {
        setOrderItem(prevOrderItem => {
            const updatedOrderItem = {...prevOrderItem, size: size};
            setUpdate(!update)
            return updatedOrderItem;
        });
    };


    const handleItemIngredientsChanging = (ingredient) => {
        setOrderItem((prevOrderItem) => {
            const ingredientExists = prevOrderItem.ingredients.some((ing) => ing.id === ingredient.id);
            if (ingredientExists) {
                const updatedOrderItem = {
                    ...prevOrderItem,
                    ingredients: prevOrderItem.ingredients.filter((ing) => ing.id !== ingredient.id)
                }
                setUpdate(!update)
                return updatedOrderItem
            } else {
                const updatedOrderItem = {
                    ...prevOrderItem,
                    ingredients: [...prevOrderItem.ingredients, ingredient],
                }
                setUpdate(!update)
                return updatedOrderItem
            }
        });
    };

    useEffect(() => {
        verifyItemAvailability({...order, quantity: quantity})
    }, [update, stockUpdate]);

    useEffect(() => {
        setOrderItem(orderItem)
    }, [orderItem])

    return (
        <div className="item">
            <div className="availability" style={{display: !availability ? 'block' : "none"}}>
                <h5>Unavailable</h5>
            </div>
            <i onClick={handleClickOpen} style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                color: '#d91c1c',
                fontSize: '20px',
                cursor: 'pointer'
            }} className='bx bxs-minus-square bx-tada'></i>
            <img alt="" className="image" src={'data:image/png;base64,' + order.item.image.imageBytes}/>
            <div className="item-data">
                <div className="item-info">
                    <h5>{order.item.name}</h5>
                    <p>{order.item.description}</p>
                    {order.size &&
                        <p><b>Size : </b>{order.size}</p>
                    }
                </div>
                <div className="list-ingredients">
                    {order.ingredients.length > 0 &&
                        <>
                            <h5>Additional ingredients :</h5>
                            <div className="ingredient">
                                {order.ingredients.map(ingredient => (

                                    <div key={ingredient.id} className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <Avatar src={'data:image/png;base64,' + ingredient.image.imageBytes}/>
                                            <p className="m-0">{ingredient.name}</p>
                                        </div>
                                        <HtmlTooltip
                                            title={
                                                <React.Fragment>
                                                    <b>Unavailable quantity !</b>
                                                </React.Fragment>
                                            }
                                        >
                                            <i
                                                className='bx bx-info-circle'
                                                style={{
                                                    display:  unavailableIngredients.some(ing => ing === ingredient.id) ? "block" : "none",
                                                    color: '#fb6501',
                                                    fontSize: '20px',
                                                    marginLeft: '10px',
                                                    cursor: 'pointer'
                                                }}
                                            ></i>
                                        </HtmlTooltip>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                </div>

                <div style={{paddingLeft: '10px', paddingRight: '10px'}}>
                    {(order.item.itemIngredients.some((item) => item.type === 'SECONDARY')) &&
                        <div className="additional-ingredients mb-2 mt-0">
                            <button onClick={handleAddingAdditionalIngredients}>
                                Add ingredients
                                <i className='bx bx-plus'></i>
                            </button>
                        </div>
                    }

                    {order.size &&
                        <div className="additional-ingredients mb-2 mt-0">
                            <button onClick={handleChangingSize}>
                                Change size
                                <i className='bx bxs-edit'></i>
                            </button>
                        </div>
                    }
                </div>


                <div className="right-content">
                    <div className="d-flex align-items-center gap-3">
                        <div className="quantity-button m-0">
                            <b style={{marginRight: '10px'}}>Quantity : </b>
                            <i className='bx bx-minus' onClick={() => handleQuantity('-')}></i>
                            <input readOnly onChange={(e) => handleQuantityChange(e)} type="number"
                                   value={quantity}/>
                            <i className='bx bx-plus' onClick={() => handleQuantity('+')}></i>
                        </div>
                        <p className="item-price m-0">Price : <b
                            style={{color: '#fd0001', fontSize: '20px'}}>{order.price} €</b>
                        </p>
                    </div>
                </div>


                {/*Additional ingredients*/}

                {(addAdditionalIngredients || changeSize) &&
                    <div className="all-ingredients">
                        {addAdditionalIngredients ?
                            <>
                                <i style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: '#6cc305',
                                    fontSize: '40px',
                                    cursor: 'pointer',
                                    zIndex: 9999,
                                    padding: '1px',
                                    backgroundColor: '#eeeeee',
                                    borderRadius: '50%'
                                }}
                                   onClick={handleAddingAdditionalIngredients}
                                   className='bx bx-list-check bx-flashing'></i>
                                {order.item.itemIngredients.map((itemIngredient) => (
                                    itemIngredient.type === 'SECONDARY' &&
                                    (<div key={itemIngredient.id} className="d-flex align-items-center gap-3" style={{
                                        borderRadius: '50px',
                                        paddingRight: '10px',
                                        height: "max-content",
                                        backgroundColor: unavailableIngredients.some(ing => ing === itemIngredient.ingredient.id) ? 'rgba(255,0,0,0.33)' : 'rgba(0,0,0,0.32)'
                                    }}>
                                        <Avatar
                                            src={'data:image/png;base64,' + itemIngredient.ingredient.image.imageBytes}/>
                                        <p className="m-0">{itemIngredient.ingredient.name}</p>
                                        <div className="d-flex align-items-center">
                                            <Checkbox
                                                style={{
                                                    color: (
                                                        (unavailableIngredients.indexOf(itemIngredient.ingredient.id) !== -1
                                                            &&
                                                            !orderItem.ingredients.some((ingredient) => ingredient.id === itemIngredient.ingredient.id))
                                                            ? "#ff0000"
                                                            : "#6cc305"
                                                    )
                                                }}
                                                checked={order.ingredients.some((ingredient) => ingredient.id === itemIngredient.ingredient.id)}
                                                onClick={() => handleItemIngredientsChanging(itemIngredient.ingredient)}
                                                disabled={unavailableIngredients.indexOf(itemIngredient.ingredient.id) !== -1 && !orderItem.ingredients.some((ingredient) => ingredient.id === itemIngredient.ingredient.id)}
                                            />
                                            {itemIngredient.price} €
                                        </div>
                                    </div>)
                                ))}
                            </>
                            :
                            <div className="d-flex flex-column w-100 justify-content-center align-items-center">
                                <i style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: '#6cc305',
                                    fontSize: '40px',
                                    cursor: 'pointer',
                                    zIndex: 9999,
                                    padding: '1px',
                                    backgroundColor: '#eeeeee',
                                    borderRadius: '50%'
                                }}
                                   onClick={handleChangingSize}
                                   className='bx bx-list-check bx-flashing'></i>
                                <div>
                                    {order.item.sizes.map(size => (
                                        <div key={size.id}
                                             className="d-flex align-items-center justify-content-between gap-3">
                                            <h3 className="m-0">{size.size}</h3>
                                            <div className="d-flex align-items-center">
                                                <Checkbox
                                                    style={{color: "#6cc305"}}
                                                    checked={size.size === order.size}
                                                    onClick={() => handleOrderItemSizeChanging(size.size)}
                                                />
                                                {size.price} €
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        }

                    </div>

                }
            </div>


            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle
                    style={{backgroundColor: '#333230', color: '#f1f1f1'}}>{"Remove from cart"}</DialogTitle>
                <DialogContent style={{backgroundColor: '#333230'}}>
                    <DialogContentText id="alert-dialog-slide-description" style={{color: '#f1f1f1'}}>
                        Are you sure you want to remove this item from the cart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{
                    backgroundColor: '#333230',
                    color: '#f1f1f1',
                    display: 'flex',
                    justifyContent: "space-evenly"
                }}>
                    <Button style={{border: '1px solid #6cc305', color: '#f1f1f1'}} onClick={handleClose}>
                        <i style={{fontSize: '20px', marginRight: '10px'}} className='bx bx-heart'></i>
                        cancel
                    </Button>
                    <Button style={{backgroundColor: '#6cc305', color: '#f1f1f1'}} onClick={handleDelete}>
                        <i style={{fontSize: '20px', marginRight: '10px'}} className='bx bxs-trash-alt'></i>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
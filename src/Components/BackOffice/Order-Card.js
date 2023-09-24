import * as React from 'react';
import {Avatar, Button} from "@mui/material";
import "../../assets/styles/Order-card.css"
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import {useAccordionButton} from 'react-bootstrap/AccordionButton';
import {useContext} from "react";

const PINK = 'rgba(251,101,1,0.49)';
const BLUE = 'rgb(251,101,1)';

function ContextAwareToggle({eventKey, callback}) {
    const {activeEventKey} = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <i onClick={decoratedOnClick}
           style={{fontSize: '25px', cursor: "pointer", color: isCurrentEventKey ? PINK : BLUE}}
           className='bx bxs-info-circle'></i>
    );
}

export default function OrderCard({order, index, onUpdate}) {

    const orderDate = new Date(order.date);
    const hours = String(orderDate.getHours()).padStart(2, '0');
    const minutes = String(orderDate.getMinutes()).padStart(2, '0');
    const formattedDate = `${hours}:${minutes}`;

    const updateOrder = () => {
        const orderUpdated = order;
        orderUpdated.state = 'READY'
        onUpdate(orderUpdated)
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
        <div className="w-100 d-flex flex-column gap-2"
             style={{
                 backgroundColor: order.state === 'PENDING' ? 'rgba(58,58,58,0.06)' : 'rgba(108,195,5,0.22)',
                 maxWidth: "1000px"
             }}>
            <div className="d-flex align-items-center p-2 justify-content-between flex-wrap"
                 style={{backgroundColor: "rgba(185,185,185,0.23)"}}>
                <div className="client-name">
                    <Avatar src={order.client.image ? 'data:image/png;base64,' + order.client.image.imageBytes : null}>
                        {order.client.firstName ? order.client.firstName.charAt(0).toUpperCase() : ''}
                        {order.client.lastName ? order.client.lastName.charAt(0).toUpperCase() : ''}
                    </Avatar>
                    <h4 style={{textTransform: "capitalize"}}>{order.client.firstName} {order.client.lastName}</h4>
                </div>
                <b style={{color: "#777777"}} className="d-flex align-items-center gap-2">{formattedDate} <i
                    className='bx bxs-time-five'></i></b>
            </div>


            <div className="d-flex flex-column gap-1">
                {order.orderItems.map((orderItem, index) => {
                    const orderItemWithoutDuplicates = removeDuplicateIngredients(orderItem);
                    return (<Accordion key={orderItem.id}>
                            <div className="d-flex align-items-center justify-content-between p-2 flex-wrap"
                                 style={{backgroundColor: "rgba(124,124,124,0.23)"}}>
                                <div className="client-name">
                                    <Avatar
                                        src={orderItem.item.image ? 'data:image/png;base64,' + orderItem.item.image.imageBytes : null}/>
                                    <b style={{textTransform: "capitalize"}}>{orderItem.item.name} {orderItem.size && `(${orderItem.size})`}</b>
                                </div>
                                <b className="d-flex align-items-center gap-2">
                                    x {orderItem.quantity}
                                    {orderItem.ingredients.length > 0 &&
                                        <ContextAwareToggle eventKey={orderItem.id}/>
                                    }
                                </b>
                            </div>

                            <Accordion.Collapse eventKey={orderItem.id}>
                                <div className="additional-info" style={{backgroundColor: "rgba(162,162,162,0.23)"}}>
                                    <div className="d-flex flex-column gap-2">
                                        <b style={{color: "#4b4b4b"}}>Ingrédients supplémentaires: </b>
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            {orderItemWithoutDuplicates.ingredients.map(ingredient => (
                                                <div key={ingredient.id} className="ingredient-name">
                                                    <Avatar sx={{width: 24, height: 24}}
                                                            src={ingredient.image ? 'data:image/png;base64,' + ingredient.image.imageBytes : null}/>
                                                    <b style={{
                                                        textTransform: "capitalize",
                                                        marginRight: '10px'
                                                    }}>{ingredient.name}</b>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Collapse>
                            {index !== order.orderItems.length - 1 && (
                                <div className="border-top mt-1 bg-black"></div>
                            )}
                        </Accordion>
                    )
                })}
            </div>

            {order.comment.trim().length !== 0 &&
                <div className="p-2">
                    <b>Commentaire:</b>
                    <p className="m-0">{order.comment}</p>
                </div>
            }

            <div className="d-flex align-items-center p-2 justify-content-between flex-wrap"
                 style={{backgroundColor: "rgba(185,185,185,0.23)"}}>
                <b>Commande {index + 1}</b>
                <b className="d-flex align-items-center gap-2" style={{color: "#fb0002"}}>
                    Prix: {order.price} €
                    {order.orderType === 'DELIVERY' &&
                        <img height="30px" width="30px"
                             src="https://img.icons8.com/?size=512&id=rW5lfeg05LJV&format=png"/>
                    }
                </b>
                <div>
                    {order.state === 'PENDING' &&
                        <Button onClick={updateOrder} color="success" variant="contained"
                                endIcon={<i className='bx bxs-bell-ring'></i>}>
                            Prête
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
        ;
}
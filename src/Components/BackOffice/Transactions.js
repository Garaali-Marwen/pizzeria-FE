import * as React from 'react';
import {
    Avatar, Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import {Fragment, useContext, useEffect, useState} from "react";
import TransactionService from "../../Services/TransactionService";
import UserService from "../../Services/UserService";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import {useAccordionButton} from "react-bootstrap/AccordionButton";


function ContextAwareToggle({eventKey, callback}) {
    const {activeEventKey} = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <i onClick={decoratedOnClick}
           style={{
               fontSize: '25px',
               position: "absolute",
               top: '-30px',
               right: "10px",
               cursor: "pointer",
               color: isCurrentEventKey ? "#6e6e6e" : "#000000",
           }}
           className={isCurrentEventKey ? 'bx bx-caret-down bx-rotate-180' : 'bx bx-caret-down'}></i>
    );
}

export function Transactions() {

    const [transactions, setTransactions] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        lastPage: false,
        pageNumber: 0
    })
    const changePage = async (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > transactions.pageNumber && transactions.lastPage) {
            return;
        }
        if (pageNumber < transactions.pageNumber && transactions.pageNumber === 0) {
            return;
        }
        try {
            const serviceMethod = UserService.getRole() !== 'ADMIN' ?
                TransactionService.getTransactionsByClientId :
                TransactionService.getAllTransactions;
            let response;
            if (serviceMethod === TransactionService.getTransactionsByClientId) {
                response = await serviceMethod(UserService.getUserId(), pageNumber, pageSize);
            } else {
                response = await serviceMethod(pageNumber, pageSize);
            }
            setTransactions({
                content: response.data.content,
                totalPages: response.data.totalPages,
                totalElements: response.data.totalElements,
                pageSize: response.data.pageable.pageSize,
                lastPage: response.data.last,
                pageNumber: response.data.pageable.pageNumber
            });
        } catch (error) {
            console.log(error);
        }
    };


    const handleChangePage = (event, newPage) => {
        changePage(newPage, transactions.pageSize)
    };

    const handleChangeRowsPerPage = (event) => {
        changePage(0, parseInt(event.target.value, 10))
    };

    useEffect(() => {
        changePage()
    }, []);

    const formatDate = (dateString) => {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'};
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', options);
    };

    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Transactions</h1>
                    </div>
                    <div className="border-top mb-5"></div>
                </div>
                <TableContainer style={{marginBottom: '50px'}}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {UserService.getRole() === 'ADMIN' &&
                                    <TableCell align="left"><b>Client</b></TableCell>
                                }
                                <TableCell align="left"><b>Date</b></TableCell>
                                <TableCell align="left"><b>Amount</b></TableCell>
                                <TableCell align="right"><b>Order</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.content.map((transaction) => (
                                <Fragment key={transaction.id}>
                                    <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        {UserService.getRole() === 'ADMIN' &&
                                            <TableCell align="left"
                                                       style={{
                                                           textTransform: "capitalize",
                                                           border: "none"
                                                       }}>
                                                <div className="client-name">
                                                    <Avatar
                                                        src={transaction.client.image ? 'data:image/png;base64,' + transaction.client.image.imageBytes : null}>
                                                        {transaction.client.firstName ? transaction.client.firstName.charAt(0).toUpperCase() : ''}
                                                        {transaction.client.lastName ? transaction.client.lastName.charAt(0).toUpperCase() : ''}
                                                    </Avatar>
                                                    <b style={{textTransform: "capitalize"}}>{transaction.client.firstName} {transaction.client.lastName}</b>
                                                </div>
                                            </TableCell>
                                        }

                                        <TableCell align="left"
                                                   style={{
                                                       textTransform: "capitalize",
                                                       border: "none"
                                                   }}>{formatDate(transaction.date)}</TableCell>

                                        <TableCell align="left"
                                                   style={{
                                                       textTransform: "capitalize",
                                                       border: "none"
                                                   }}>{transaction.order.price} €</TableCell>

                                        <TableCell align="right"
                                                   style={{
                                                       textTransform: "capitalize",
                                                       border: "none"
                                                   }}/>
                                    </TableRow>
                                    <TableRow style={{position: "relative"}}
                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell colSpan={UserService.getRole() === 'ADMIN' ? 4 : 3}
                                                   style={{padding: 0}}>
                                            <Accordion>
                                                <ContextAwareToggle eventKey={transaction.id}/>
                                                <Accordion.Collapse eventKey={transaction.id}>
                                                    <div className="additional-info"
                                                         style={{backgroundColor: "rgba(42,42,42,0.09)"}}>
                                                        <div className="d-flex flex-column gap-2">
                                                            <b style={{color: "#4b4b4b"}}>Order Info: </b>
                                                            {transaction.order.orderItems.map((orderItem, index) => (
                                                                <div key={orderItem.id}
                                                                     className="position-relative">
                                                                    <div
                                                                        className="d-flex align-items-center w-100 gap-2 position-relative">
                                                                        <Avatar
                                                                            src={orderItem.item.image ? 'data:image/png;base64,' + orderItem.item.image.imageBytes : null}/>
                                                                        <b style={{minWidth: '100px'}}>{orderItem.item.name}</b>
                                                                        {orderItem.ingredients.length > 0 &&
                                                                            <>
                                                                                <Divider orientation="vertical" flexItem
                                                                                         style={{borderColor: "#4b4b4b"}}/>
                                                                                <div>
                                                                                    <b>Additional ingredients:</b>
                                                                                    <div
                                                                                        className="d-flex align-items-center w-100 gap-2">
                                                                                        {orderItem.ingredients.map(ingredient => (
                                                                                            <div key={ingredient.id}
                                                                                                 style={{
                                                                                                     backgroundColor: "rgba(89,89,89,0.26)",
                                                                                                     borderRadius: "50px",
                                                                                                     display: "flex",
                                                                                                     gap: "5",
                                                                                                     paddingRight: "10px"
                                                                                                 }}>
                                                                                                <Avatar
                                                                                                    sx={{
                                                                                                        width: 20,
                                                                                                        height: 20
                                                                                                    }}
                                                                                                    src={ingredient.image ? 'data:image/png;base64,' + ingredient.image.imageBytes : null}/>
                                                                                                <b>{ingredient.name}</b>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                    {index !== transaction.order.orderItems.length - 1 &&
                                                                        <Divider
                                                                            orientation="horizontal"
                                                                            flexItem
                                                                            style={{
                                                                                borderColor: "#4b4b4b",
                                                                                width: '100%',
                                                                                marginTop: "10px"
                                                                            }}/>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="pagination-Items">
                        <TablePagination
                            component="div"
                            count={transactions.totalElements}
                            page={transactions.pageNumber}
                            onPageChange={handleChangePage}
                            rowsPerPage={transactions.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </TableContainer>
            </div>
        </div>
    )
        ;
};
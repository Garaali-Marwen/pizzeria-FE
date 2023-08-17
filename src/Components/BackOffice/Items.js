import * as React from 'react';
import {useEffect, useState} from "react";
import ItemService from "../../Services/ItemService";
import {
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {ItemCard} from "../FrontOffice/Item-Card";
import {ItemForm} from "./Item-Form";
import CategoryService from "../../Services/CategoryService";
import SnackbarMessage from "../SnackbarMessage";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import {Element, scroller} from "react-scroll";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import OrderService from "../../Services/OrderService";

export function Items() {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [chosenItem, setChosenItem] = useState(null)
    const handleOpenItem = (item) => {
        setChosenItem(<ItemCard style={{margin: 0}} item={item}/>)
        toggle()
    }

    const [item, setItem] = useState(null)
    const handleEditItem = (item) => {
        setItem(item)
        scroller.scrollTo("itemForm", {
            duration: 500,
            smooth: true,
        });
    }

    const handleItemUpdated = () => {
        setMessage('Item updated Successfully')
        setItem(null)
    }


    const [additem, setAddItem] = useState(false)
    const handleAddingItem = () => {
        setAddItem(!additem)
    }

    const handleItemAdded = () => {
        setMessage('Item added Successfully')
        setAddItem(!additem)
    }

    const [items, setItems] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        lastPage: false,
        pageNumber: 0
    })


    useEffect(() => {
        if (item === null && !additem) {
            changePage(0)
        }
    }, [item, additem])
    const changePage = (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > items.pageNumber && items.lastPage) {
            return
        }
        if (pageNumber < items.pageNumber && items.pageNumber === 0) {
            return
        }
        ItemService.getAllItems(pageNumber, pageSize)
            .then(response => {
                const itemsUpdated = [];
                const categoryUpdatePromises = response.data.content.map(item => (
                    CategoryService.getCategoryByItemId(item.id)
                        .then(categoryResponse => {
                            item.category = {
                                id: categoryResponse.data.id,
                                name: categoryResponse.data.name
                            };
                            itemsUpdated.push(item);
                        })
                ));

                Promise.all(categoryUpdatePromises)
                    .then(() => {
                        setItems({
                            content: itemsUpdated,
                            totalPages: response.data.totalPages,
                            totalElements: response.data.totalElements,
                            pageSize: response.data.pageable.pageSize,
                            lastPage: response.data.last,
                            pageNumber: response.data.pageable.pageNumber
                        });
                    })
                    .catch(error => {
                        console.error("Error updating categories:", error);
                    });
            })
            .catch(error => {
                console.error("Error fetching items:", error);
            });

    }

    const handleChangePage = (event, newPage) => {
        changePage(newPage, items.pageSize)
    };

    const handleChangeRowsPerPage = (event) => {
        changePage(0, parseInt(event.target.value, 10))
    };


    const [message, setMessage] = useState('')
    const handleSnackBarClose = () => {
        setMessage('')
    }

    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Items</h1>
                        <Tooltip title="Add new item">
                            <IconButton onClick={handleAddingItem} aria-label="add">
                                <AddCircleOutlineIcon style={{color: '#000000'}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="border-top mb-5"></div>
                </div>
                <TableContainer style={{marginBottom: '50px'}}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="left"><b>Name</b></TableCell>
                                <TableCell align="left"><b>Category</b></TableCell>
                                <TableCell align="left"><b>Price&nbsp;(TND)</b></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.content.map((item) => (
                                <TableRow
                                    key={item.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Avatar
                                            src={item.image ? 'data:image/png;base64,' + item.image.imageBytes : null}/>
                                    </TableCell>
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{item.name}</TableCell>
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{item.category?.name}</TableCell>
                                    <TableCell align="left">{item.price}</TableCell>
                                    <TableCell align="right">
                                        {/*<Tooltip title="Delete">
                                            <IconButton aria-label="delete">
                                                <DeleteForeverIcon/>
                                            </IconButton>
                                        </Tooltip>*/}
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEditItem(item)} aria-label="edit">
                                                <ModeEditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Watch">
                                            <IconButton onClick={() => handleOpenItem(item)} aria-label="open">
                                                <VisibilityIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>

                                    <Modal isOpen={modal} toggle={toggle} style={{maxWidth: 'max-content'}}>
                                        <ModalHeader style={{
                                            position: "absolute",
                                            zIndex: 999,
                                            width: '100%',
                                            borderBottom: 'none'
                                        }} toggle={toggle}></ModalHeader>
                                        <ModalBody style={{padding: 0}}>
                                            {chosenItem}
                                        </ModalBody>
                                    </Modal>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="pagination-Items">
                        <TablePagination
                            component="div"
                            count={items.totalElements}
                            page={items.pageNumber}
                            onPageChange={handleChangePage}
                            rowsPerPage={items.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            // rowsPerPageOptions={[10, 15, 25, 50]}
                        />
                    </div>
                </TableContainer>


                <Element name="itemForm">
                    {item && <ItemForm itemUpdate={item} onUpdate={handleItemUpdated}/>}
                </Element>
                <Modal style={{minWidth: '50%'}} isOpen={additem} toggle={handleAddingItem}>
                    <ModalHeader
                        style={{position: "absolute", border: "none", textAlign: "end", width: '100%', zIndex: 99}}
                        toggle={handleAddingItem}></ModalHeader>
                    <ModalBody>
                        <ItemForm onAdd={handleItemAdded}/>
                    </ModalBody>
                </Modal>

                <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>

            </div>
        </div>
    );
};
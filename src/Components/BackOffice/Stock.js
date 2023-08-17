import * as React from 'react';
import Tooltip from "@mui/material/Tooltip";
import {
    Avatar, FormControl, FormHelperText,
    IconButton, InputAdornment, OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SnackbarMessage from "../SnackbarMessage";
import {useEffect, useState} from "react";
import StockService from "../../Services/StockService";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {StockItemForm} from "./Stock-item-form";

export function Stock() {
    const [quantityError, setQuantityError] = useState("")
    const [addStockItem, setAddStockItem] = useState(false)
    const [stock, setStock] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        lastPage: false,
        pageNumber: 0
    })
    const changePage = (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > stock.pageNumber && stock.lastPage) {
            return
        }
        if (pageNumber < stock.pageNumber && stock.pageNumber === 0) {
            return
        }
        StockService.getStock(pageNumber, pageSize)
            .then(response => {
                setStock({
                    content: response.data.content,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageSize: response.data.pageable.pageSize,
                    lastPage: response.data.last,
                    pageNumber: response.data.pageable.pageNumber
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    const handleChangePage = (event, newPage) => {
        changePage(newPage, stock.pageSize)
    };

    const handleChangeRowsPerPage = (event) => {
        changePage(0, parseInt(event.target.value, 10))
    };

    useEffect(() => {
        changePage()
    }, [addStockItem])


    const handleAddingStockItem = () => {
        setItemUpdate(null)
        setAddStockItem(!addStockItem)
    }
    const handleStockItemAdded = () => {
        setMessage('Item added Successfully to the stock')
        setAddStockItem(!addStockItem)
    }

    const [message, setMessage] = useState('')
    const handleSnackBarClose = () => {
        setMessage('')
    }

    const [ItemUpdate, setItemUpdate] = useState(null)
    const handleUpdatingStockItem = (item) => {
        setItemUpdate(item)
    }

    const handleUpdateStockItem = () => {
        if (ItemUpdate.quantity.length === 0) {
            setQuantityError("Quantity is required")
            return false
        }
        StockService.updateStockItem(ItemUpdate)
            .then(response => {
                setQuantityError("")
                setItemUpdate(null)
                changePage(stock.pageNumber, stock.pageSize)
                setMessage("Item updated Successfully")
            })
            .catch(error => console.log(error))

    }
    const handleQuantityChange = (e) => {
        setItemUpdate(prev => ({...prev, quantity: e.target.value}))
    }

    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Stock</h1>
                        <Tooltip title="Add new item">
                            <IconButton aria-label="add" onClick={handleAddingStockItem}>
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
                                <TableCell align="left"><b>Quantity</b></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stock.content.map((item) => (
                                <TableRow
                                    key={item.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Avatar
                                            src={item.item ? 'data:image/png;base64,' + item.item.image.imageBytes : 'data:image/png;base64,' + item.ingredient.image.imageBytes}/>
                                    </TableCell>
                                    <TableCell align="left"
                                               style={{textTransform: "capitalize"}}>
                                        {item.item ? item.item.name : item.ingredient.name}
                                    </TableCell>
                                    <TableCell align="left"
                                               style={{textTransform: "capitalize"}}>
                                        {ItemUpdate?.id === item.id ?
                                            <FormControl error={!!(quantityError && quantityError.length)}>
                                                <OutlinedInput
                                                    id="outlined-adornment-weight" style={{maxWidth: '150px'}}
                                                    endAdornment={<InputAdornment
                                                        position="end">{item.ingredient ? item.ingredient.unit : ''}</InputAdornment>}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'quantity',
                                                    }}
                                                    placeholder="Quantity"
                                                    type="number" name="quantity" value={ItemUpdate.quantity}
                                                    onChange={handleQuantityChange}
                                                />
                                                {quantityError && <FormHelperText>{quantityError}</FormHelperText>}
                                            </FormControl>
                                            :
                                            <>{item.ingredient ? item.quantity + " " + item.ingredient.unit : item.quantity}</>
                                        }


                                    </TableCell>
                                    <TableCell align="right">
                                        {/*<Tooltip title="Delete">
                                            <IconButton aria-label="delete">
                                                <DeleteForeverIcon/>
                                            </IconButton>
                                        </Tooltip>*/}
                                        {ItemUpdate?.id !== item.id &&
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleUpdatingStockItem(item)}
                                                            aria-label="edit">
                                                    <ModeEditIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        }
                                        {ItemUpdate?.id === item.id &&
                                            <Tooltip title="Confirm">
                                                <IconButton onClick={handleUpdateStockItem} aria-label="confirm">
                                                    <i className='bx bxs-check-circle bx-tada'></i> </IconButton>
                                            </Tooltip>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="pagination-Items">
                        <TablePagination
                            component="div"
                            count={stock.totalElements}
                            page={stock.pageNumber}
                            onPageChange={handleChangePage}
                            rowsPerPage={stock.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </TableContainer>


                <Modal style={{minWidth: '50%'}} isOpen={addStockItem} toggle={handleAddingStockItem}>
                    <ModalHeader
                        style={{position: "absolute", border: "none", textAlign: "end", width: '100%', zIndex: 99}}
                        toggle={handleAddingStockItem}></ModalHeader>
                    <ModalBody>
                        <StockItemForm onAdd={handleStockItemAdded}/>
                    </ModalBody>
                </Modal>
                <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>
            </div>
        </div>

    );
};
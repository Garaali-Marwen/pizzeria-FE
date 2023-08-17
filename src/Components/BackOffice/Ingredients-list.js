import * as React from 'react';
import Tooltip from "@mui/material/Tooltip";
import {
    Avatar,
    IconButton,
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
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {Element, scroller} from "react-scroll";
import SnackbarMessage from "../SnackbarMessage";
import {useEffect, useState} from "react";
import IngredientService from "../../Services/IngredientService";
import {IngredientForm} from "./Ingredient-Form";

export function IngredientsList() {
    const [addIngredient, setAddIngredient] = useState(false)
    const [message, setMessage] = useState('')
    const [ingredient, setIngredient] = useState(null)
    const [ingredients, setIngredients] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        lastPage: false,
        pageNumber: 0
    })
    const changePage = (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > ingredients.pageNumber && ingredients.lastPage) {
            return
        }
        if (pageNumber < ingredients.pageNumber && ingredients.pageNumber === 0) {
            return
        }
        IngredientService.getAllIngredientsPagination(pageNumber, pageSize)
            .then(response => {
                setIngredients({
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

    useEffect(() => {
        if (ingredient === null && !addIngredient) {
            changePage()
        }
    }, [ingredient, addIngredient])

    const handleChangePage = (event, newPage) => {
        changePage(newPage, ingredients.pageSize)
    };

    const handleChangeRowsPerPage = (event) => {
        changePage(0, parseInt(event.target.value, 10))
    };

    const handleEditIngredient = (ingredient) => {
        setIngredient(ingredient)
        scroller.scrollTo("ingredientForm", {
            duration: 500,
            smooth: true,
        });
    }

    const handleIngredientUpdated = () => {
        setMessage('Ingredient updated Successfully')
        setIngredient(null)
    }

    const handleAddingIngredient = () => {
        setAddIngredient(!addIngredient)
    }

    const handleItemAdded = () => {
        setMessage('Ingredient added Successfully')
        setAddIngredient(!addIngredient)
    }

    const handleSnackBarClose = () => {
        setMessage('')
    }

    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Ingredients</h1>
                        <Tooltip title="Add new item">
                            <IconButton onClick={handleAddingIngredient} aria-label="add">
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
                                <TableCell align="left"><b>Unit</b></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredients.content.map((ingredient) => (
                                <TableRow
                                    key={ingredient.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Avatar
                                            src={ingredient.image ? 'data:image/png;base64,' + ingredient.image.imageBytes : null}/>
                                    </TableCell>
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{ingredient.name}</TableCell>
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{ingredient.unit}</TableCell>
                                    <TableCell align="right">
                                       {/* <Tooltip title="Delete">
                                            <IconButton aria-label="delete">
                                                <DeleteForeverIcon/>
                                            </IconButton>
                                        </Tooltip>*/}
                                        <Tooltip title="Edit" onClick={() => handleEditIngredient(ingredient)}>
                                            <IconButton aria-label="edit">
                                                <ModeEditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="pagination-Items">
                        <TablePagination
                            component="div"
                            count={ingredients.totalElements}
                            page={ingredients.pageNumber}
                            onPageChange={handleChangePage}
                            rowsPerPage={ingredients.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            // rowsPerPageOptions={[10, 15, 25, 50]}
                        />
                    </div>
                </TableContainer>


                <Element name="ingredientForm">
                    {ingredient && <IngredientForm ingredientUpdate={ingredient} onUpdate={handleIngredientUpdated}/>}
                </Element>


                <Modal style={{minWidth: '50%'}} isOpen={addIngredient} toggle={handleAddingIngredient}>
                    <ModalHeader
                        style={{position: "absolute", border: "none", textAlign: "end", width: '100%', zIndex: 99}}
                        toggle={handleAddingIngredient}></ModalHeader>
                    <ModalBody>
                        <IngredientForm onAdd={handleItemAdded}/>
                    </ModalBody>
                </Modal>

                <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>

            </div>
        </div>

    );
};
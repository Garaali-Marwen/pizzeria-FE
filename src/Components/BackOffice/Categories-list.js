import * as React from 'react';
import Tooltip from "@mui/material/Tooltip";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import SnackbarMessage from "../SnackbarMessage";
import {useEffect, useState} from "react";
import {CategoryForm} from "./Category-Form";
import CategoryService from "../../Services/CategoryService";
import {Element, scroller} from "react-scroll";

export function CategoriesList() {

    const [message, setMessage] = useState('')
    const [addCategory, setAddCategory] = useState(false)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(null)

    useEffect(() => {
        CategoryService.getAllCategories()
            .then(response => setCategories(response.data))
            .catch(error => console.log(error))
    }, [addCategory, category]);
    const handleSnackBarClose = () => {
        setMessage('')
    }
    const handleAddingCategory = () => {
        setAddCategory(!addCategory)
    }
    const handleCategoryAdded = () => {
        setMessage('Category added Successfully')
        setAddCategory(!addCategory)
    }

    const handleCategoryUpdated = () => {
        setCategory(null)
        setMessage('Category updated Successfully')
    }

    const handleEditCategory = (category) => {
        setCategory(category)
        scroller.scrollTo("categoryForm", {
            duration: 500,
            smooth: true,
        });
    }


    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Categories</h1>
                        <Tooltip title="Add new item">
                            <IconButton onClick={handleAddingCategory} aria-label="add">
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
                                <TableCell align="left"><b>Nom</b></TableCell>
                                <TableCell align="left"><b>Articles</b></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow
                                    key={category.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{category.name}</TableCell>
                                    <TableCell align="left">{category.items.length}</TableCell>
                                    <TableCell align="right">
                                        {/*<Tooltip title="Delete">
                                            <IconButton aria-label="delete">
                                                <DeleteForeverIcon/>
                                            </IconButton>
                                        </Tooltip>*/}
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEditCategory(category)} aria-label="edit">
                                                <ModeEditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>

                <Element name="categoryForm">
                    {category && <CategoryForm categoryUpdate={category} onUpdate={handleCategoryUpdated}/>}
                </Element>

                <Modal style={{minWidth: '50%'}} isOpen={addCategory} toggle={handleAddingCategory}>
                    <ModalHeader
                        style={{position: "absolute", border: "none", textAlign: "end", width: '100%', zIndex: 99}}
                        toggle={handleAddingCategory}></ModalHeader>
                    <ModalBody>
                        <CategoryForm onAdd={handleCategoryAdded}/>
                    </ModalBody>
                </Modal>

                <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>

            </div>
        </div>

    );
};
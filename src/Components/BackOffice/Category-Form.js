import * as React from 'react';
import {useEffect, useState} from "react";
import CategoryService from "../../Services/CategoryService";
import {Button, TextField} from "@mui/material";

export function CategoryForm({onAdd, categoryUpdate, onUpdate}) {

    const [category, setCategory] = useState({
        name: ''
    });

    const formChangeHandler = (e) => {
        setCategory({...category, [e.target.name]: e.target.value})
    }

    const submitHandler = (e) => {
        e.preventDefault()
        CategoryService.addCategory(category)
            .then(response => {
                    onAdd()
                }
            )
            .catch((error) => {
                console.error(error);
            });
    };

    const editHandler = (e) => {
        e.preventDefault()
        CategoryService.updateCategory(category)
            .then(response => onUpdate())
            .catch(error => console.log(error))
    }


    useEffect(() => {
        if (categoryUpdate){
            setCategory(categoryUpdate)
        }
    }, []);

    return (
        <div className="container">
            <h1 className="card-title">{categoryUpdate ? 'Update category' : 'Add new category'}</h1>
            <div className="border-top mb-5 mt-2"></div>
            <form onSubmit={categoryUpdate ? editHandler : submitHandler}>
                <TextField
                    name="name"
                    onChange={formChangeHandler}
                    value={category.name}
                    fullWidth
                    id="standard-required"
                    label="Ingredient name"
                    variant="standard"
                />

                <Button type="submit" className="mt-4" variant="contained"
                        endIcon={!categoryUpdate ?<i className="bx bx-plus-circle"></i>:<i className='bx bxs-edit'></i>}>
                    {categoryUpdate ? 'update' : 'Add'}
                </Button>
            </form>
        </div>
    );
};
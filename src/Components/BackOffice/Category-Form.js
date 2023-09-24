import * as React from 'react';
import {useEffect, useState} from "react";
import CategoryService from "../../Services/CategoryService";
import {Button, TextField} from "@mui/material";

export function CategoryForm({onAdd, categoryUpdate, onUpdate}) {
    const [categoryImage, setImage] = useState(null)
    const [categoryIconImage, setIcon] = useState(null)
    const [category, setCategory] = useState({
        name: '',
        image: {
            file: ""
        },
        icon: {
            file: ""
        }
    });

    const formChangeHandler = (e) => {
        setCategory({...category, [e.target.name]: e.target.value})
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('category', new Blob([JSON.stringify(category)], {type: 'application/json'}));
        formData.append('image', category.image.file ? category.image.file : new File([], ""));
        formData.append('icon', category.icon.file ? category.icon.file : new File([], ""));

        CategoryService.addCategory(formData)
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
        const formData = new FormData()
        formData.append('category', new Blob([JSON.stringify(category)], {type: 'application/json'}));
        formData.append('image', category.image.file ? category.image.file : new File([], ""));
        formData.append('icon', category.icon.file ? category.icon.file : new File([], ""));

        CategoryService.updateCategory(formData)
            .then(response => onUpdate())
            .catch(error => console.log(error))
    }


    useEffect(() => {
        if (categoryUpdate) {
            setCategory(categoryUpdate)
            setImage(categoryUpdate.image && 'data:image/png;base64,' + categoryUpdate.image.imageBytes)
            setIcon(categoryUpdate.icon && 'data:image/png;base64,' + categoryUpdate.icon.imageBytes)
        }
    }, [categoryUpdate]);

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            if (event.target.name === "image") {
                setImage(URL.createObjectURL(event.target.files[0]));
                setCategory((prev) => ({
                    ...prev,
                    image: {
                        file: event.target.files[0]
                    }
                }));
            } else {
                setIcon(URL.createObjectURL(event.target.files[0]));
                setCategory((prev) => ({
                    ...prev,
                    icon: {
                        file: event.target.files[0]
                    }
                }));
            }
        }
    };

    return (
        <div className="container">
            <h1 className="card-title">{categoryUpdate ? 'Modification de category' : 'Ajout de catégorie'}</h1>
            <div className="border-top mb-5 mt-2"></div>
            <form onSubmit={categoryUpdate ? editHandler : submitHandler}>
                <TextField
                    name="name"
                    onChange={formChangeHandler}
                    value={category.name}
                    fullWidth
                    id="standard-required"
                    label="Nom"
                    variant="standard"
                />

                <div className="d-flex flex-wrap gap-5 justify-content-center">
                    <div className="add-image mt-4 mb-2">
                        <label
                            htmlFor="file1"
                            className="label-file"
                            style={{border: !categoryImage ? '#575757 dashed 1px' : 'none'}}>
                            {!categoryImage && 'Choisissez l\'arrière-plan du catégorie'}
                            <img alt="" style={{backgroundColor: 'rgba(0,0,0,0.28)'}} src={categoryImage}/>
                            {categoryImage && (<span className="edit-icon"><i className="bx bxs-edit"></i></span>)}
                        </label>
                        <input name="image" onChange={onImageChange} id="file1" className="input-file"
                               type="file"/>
                        <b>Arrière-plan</b>
                    </div>

                    <div className="add-image mt-4 mb-2">
                        <label
                            htmlFor="file2"
                            className="label-file"
                            style={{border: !categoryIconImage ? '#575757 dashed 1px' : 'none'}}>
                            {!categoryIconImage && 'Choisissez l\'icone du catégorie'}
                            <img alt="" style={{backgroundColor: 'rgba(0,0,0,0.28)'}} src={categoryIconImage}/>
                            {categoryIconImage && (<span className="edit-icon"><i className="bx bxs-edit"></i></span>)}
                        </label>
                        <input name="icon" onChange={onImageChange} id="file2" className="input-file"
                               type="file"/>
                        <b>Icone</b>
                    </div>
                </div>

                <Button type="submit" className="mt-4" variant="contained"
                        endIcon={!categoryUpdate ? <i className="bx bx-plus-circle"></i> :
                            <i className='bx bxs-edit'></i>}>
                    {categoryUpdate ? 'Modifier' : 'Ajouter'}
                </Button>
            </form>
        </div>
    );
};
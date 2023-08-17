import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Chip,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import IngredientService from "../../Services/IngredientService";
import ItemService from "../../Services/ItemService";
import ItemIngredientService from "../../Services/Item-IngredientService";
import CategoryService from "../../Services/CategoryService";

export function ItemForm({itemUpdate, onUpdate, onAdd}) {

    const [allIngredients, setAllIngredients] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [itemImage, setImage] = useState(null)
    const [ingredients, setIngredients] = useState([]);
    const [additionalIngredients, setAdditionalIngredients] = useState([]);
    const [sizes, setSizes] = useState(false)
    const [ingredientForm, setIngredientForm] = useState(false)
    const [sizesForm, setSizesForm] = useState([])
    const [item, setItem] = useState({
        name: '',
        description: '',
        price: '',
        sizes: [],
        image: '',
        category: {
            id: '',
            name: ''
        }
    })


    useEffect(() => {
        IngredientService.getAllIngredients()
            .then(response => {
                setAllIngredients(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        CategoryService.getAllCategories().then(response => {
                setAllCategories(response.data)
            }
        ).catch(error => {
            console.log(error)
        })
        if (itemUpdate) {
            setItem(itemUpdate)
            setImage(itemUpdate.image && 'data:image/png;base64,' + itemUpdate.image.imageBytes)
            setSizesForm(itemUpdate.sizes)
            setIngredients(itemUpdate.itemIngredients.filter(ingredient => ingredient.type === 'PRIMARY'));
            setAdditionalIngredients(itemUpdate.itemIngredients.filter(ingredient => ingredient.type === 'SECONDARY'));
            if (itemUpdate.sizes.length > 0)
                setSizes(true)
            else setSizes(false)
            if (itemUpdate.itemIngredients.length > 0)
                setIngredientForm(true)
            else setIngredientForm(false)
        }
    }, [itemUpdate]);


    useEffect(() => {
        setItem(prevItem => ({
            ...prevItem,
            sizes: sizesForm
        }));
    }, [sizesForm])


    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
            setItem((prevItem) => ({
                ...prevItem,
                image: {
                    file: event.target.files[0]
                }
            }));
        }
    };


    const addSize = () => {
        setSizesForm((prev) => [...prev, {
            id: parseInt(Date.now() * Math.random()).toString(),
            size: '',
            price: ''
        }]);
    }
    const handleDeleteSize = (index) => {
        setSizesForm((prev) => {
            return prev.filter((size) => size.id !== index);
        });
    };
    const handleSizeChange = (id, e) => {
        setSizesForm((prev) => {
            return prev.map((size) => {
                if (size.id === id) {
                    return {...size, size: e.target.value};
                }
                return size;
            });
        });
    };

    const handlePriceChange = (id, e) => {
        setSizesForm((prev) => {
            return prev.map((size) => {
                if (size.id === id) {
                    return {...size, price: e.target.value};
                }
                return size;
            });
        });
        setItem(prevItem => ({
            ...prevItem,
            sizes: sizesForm
        }));
    };

    const handleAddIngredient = (event) => {
        const selectedIngredient = {
            ingredient: {
                id: event.target.value.id,
                name: event.target.value.name,
                image: event.target.value.image,
                unit: event.target.value.unit
            },
            type: 'PRIMARY',
            quantity: '',
            price: 0
        };
        if (!ingredients.some((item) => item.ingredient.id === selectedIngredient.ingredient.id)) {
            setIngredients((prevIngredients) => [...prevIngredients, selectedIngredient]);
        }
    };
    const handleDeleteIngredient = (index) => {
        setIngredients((prevIngredients) => {
            return prevIngredients.filter((ingredient) => ingredient.ingredient.id !== index);
        });
    };
    const handleQuantityIngredientChange = (event, index) => {
        setIngredients((prevIngredients) => {
            const updatedIngredients = [...prevIngredients];
            const ingredientToUpdate = updatedIngredients.find((ingredient) => ingredient.ingredient.id === index);
            if (ingredientToUpdate) {
                ingredientToUpdate.quantity = event.target.value;
            }
            return updatedIngredients;
        });
    };

    const handleQuantityAdditionalIngredientChange = (event, index) => {
        setAdditionalIngredients((prevIngredients) => {
            const updatedIngredients = [...prevIngredients];
            const ingredientToUpdate = updatedIngredients.find((ingredient) => ingredient.ingredient.id === index);
            if (ingredientToUpdate) {
                ingredientToUpdate.quantity = event.target.value;
            }
            return updatedIngredients;
        });
    };

    const handleAddAdditionalIngredients = (event) => {
        const selectedIngredient = {
            ingredient: {
                id: event.target.value.id,
                name: event.target.value.name,
                image: event.target.value.image,
                unit: event.target.value.unit
            },
            type: 'SECONDARY',
            quantity: 0,
            price: 0
        };
        if (!additionalIngredients.some((ingredient) => ingredient.ingredient.id === selectedIngredient.ingredient.id)) {
            setAdditionalIngredients((prevIngredients) => [...prevIngredients, selectedIngredient]);
        }
    };
    const handleDeleteAdditionalIngredients = (index) => {
        setAdditionalIngredients((prevIngredients) => {
            return prevIngredients.filter((ingredient) => ingredient.ingredient.id !== index);
        });
    };
    const handlePriceAdditionalIngredientsChange = (event, index) => {
        setAdditionalIngredients((prevIngredients) => {
            const updatedIngredients = [...prevIngredients];
            const ingredientToUpdate = updatedIngredients.find((ingredient) => ingredient.ingredient.id === index);
            if (ingredientToUpdate) {
                ingredientToUpdate.price = event.target.value;
            }
            return updatedIngredients;
        });
    };

    const handleFormChange = (e) => {
        if (e.target.name === "category") {
            const selectedCategory = allCategories.find(
                (category) => category.name === e.target.value
            );
            setItem({
                ...item,
                category: {
                    id: selectedCategory.id,
                    name: selectedCategory.name,
                },
            });
        } else {
            setItem({
                ...item,
                [e.target.name]: e.target.value
            });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('item', new Blob([JSON.stringify(item)], {type: 'application/json'}));
        formData.append('image', item.image.file);

        ItemService.addItem(formData)
            .then(response => {
                    const promises = [];
                    additionalIngredients.map(ingredient => ingredients.push(ingredient));
                    for (let ingredient of ingredients) {
                        const itemIngredient = {
                            quantity: ingredient.quantity,
                            type: ingredient.type,
                            price: ingredient.price,
                            item: {
                                id: response.data.id
                            },
                            ingredient: {
                                id: ingredient.ingredient.id
                            }
                        };
                        promises.push(ItemIngredientService.addItemIngredient(itemIngredient));
                    }

                    return Promise.all(promises);
                }
            ).then(response => {
                setItem({name: '', price: '', description: '', image: '', category: {id: '', name: ''}})
                setImage(null);
                setIngredients([])
                setAdditionalIngredients([])
                onAdd()
                setSizesForm((prev) => [{
                    id: parseInt(Date.now() * Math.random()).toString(),
                    size: '',
                    price: ''
                }]);
                setIngredientForm(false)
                setSizes(false)
            }
        )
            .catch((error) => {
                console.error(error);
            });
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        additionalIngredients.map(ingredient => ingredients.push(ingredient));
        ingredients.map(ingredient => {
            if (!ingredient.id) {
                return {
                    quantity: ingredient.quantity,
                    type: ingredient.type,
                    price: ingredient.price,
                    item: {
                        id: itemUpdate.id
                    },
                    ingredient: {
                        id: ingredient.ingredient.id
                    }
                };
            }
        });

        item.itemIngredients = ingredients
        const formData = new FormData()
        formData.append('item', new Blob([JSON.stringify(item)], {type: 'application/json'}));
        formData.append('image', item.image.file ? item.image.file : new File([], ""));
        ItemService.editItem(formData)
            .then(() => {
                onUpdate()
            })
            .catch(error => console.log(error))
    };

    const handleAddingSizes = () => {
        setSizes(prev => !prev)
        setItem(prevItem => ({
            ...prevItem,
            sizes: []
        }));
        setSizesForm((prev) => [{
            id: parseInt(Date.now() * Math.random()).toString(),
            size: '',
            price: ''
        }]);
    }

    const handleAddingIngredients = () => {
        setIngredientForm(prev => !prev)
        setIngredients([])
    }

    return (
        <div id="form-item" className="container">
            <div className="w-100">
                <div>
                    <h1 className="card-title text-start">
                        {!itemUpdate ?
                            'Add new item'
                            :
                            'Edit item'}
                    </h1>
                    <div className="border-top mb-5 mt-2"></div>
                </div>
                <form onSubmit={!itemUpdate ? submitHandler : handleUpdate} className="text-start">
                    <div className="row" style={{display: "flex", flexWrap: "wrap", gap: '10px', width: '100%'}}>
                        <div className="card p-4 m-0 flex-grow-1 h-auto d-flex col-md-4 gap-4">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={item.category?.name || ""}
                                    label="Category"
                                    name="category"
                                    onChange={handleFormChange}
                                >
                                    {allCategories.map((category) =>
                                        (<MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>)
                                    )}
                                </Select>
                            </FormControl>
                            <TextField
                                onChange={handleFormChange}
                                value={item.name}
                                required
                                name="name"
                                id="standard-required"
                                label="Name"
                                variant="standard"
                                fullWidth
                            />
                            <TextField
                                onChange={handleFormChange}
                                value={item.description}
                                required
                                name="description"
                                fullWidth
                                id="standard-required"
                                label="Description"
                                variant="standard"
                                className="mt-2"
                            />
                            <TextField
                                onChange={handleFormChange}
                                value={item.price}
                                required
                                name="price"
                                type="number"
                                fullWidth
                                id="standard-required"
                                label="price"
                                variant="standard"
                                className="mt-2"
                            />
                            <div className="add-image mt-4 col-md-4">
                                <label
                                    htmlFor="file1"
                                    className="label-file"
                                    style={{border: !itemImage ? '#575757 dashed 1px' : 'none'}}>
                                    {!itemImage && 'Choose item image'}
                                    <img alt="" src={itemImage}/>
                                    {itemImage && (<span className="edit-icon"><i className="bx bxs-edit"></i></span>)}
                                </label>
                                <input name="image" onChange={onImageChange} id="file1" className="input-file"
                                       type="file"/>
                            </div>
                            <div className="d-flex gap-4">
                                {!sizes &&

                                    <Button onClick={handleAddingSizes}
                                            style={{height: 'max-content', width: "max-content"}}
                                            className="mt-2" variant="contained"
                                            endIcon={<i className="bx bx-plus-circle"></i>}>
                                        Add sizes
                                    </Button>
                                }
                                {!ingredientForm &&
                                    <Button onClick={handleAddingIngredients}
                                            style={{height: 'max-content', width: "max-content"}}
                                            className="mt-2" variant="contained"
                                            endIcon={<i className="bx bx-plus-circle"></i>}>
                                        Add ingredients
                                    </Button>
                                }
                            </div>
                        </div>
                        {sizes &&
                            <div className="card p-4 m-0 flex-grow-1  col-md-4  h-auto d-flex col gap-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className="text-start">Sizes: </h5>
                                    {!itemUpdate &&
                                        <i onClick={handleAddingSizes} style={{
                                            fontSize: '20px',
                                            color: 'red',
                                            cursor: 'pointer',
                                            width: '20px',
                                        }} className='bx bxs-minus-circle'></i>
                                    }
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {sizesForm.map((size) => (
                                        <div style={{minWidth: '100px'}} className="card p-2 flex-grow-1 w-25 text-end"
                                             key={size.id}>
                                            <i onClick={() => handleDeleteSize(size.id)} style={{
                                                fontSize: '20px',
                                                color: 'red',
                                                cursor: 'pointer',
                                                width: '20px',
                                            }} className='bx bx-x-circle'></i>

                                            <TextField
                                                required
                                                name="size"
                                                fullWidth
                                                id="standard-required"
                                                label="Size"
                                                variant="standard"
                                                value={size.size}
                                                onChange={(e) => handleSizeChange(size.id, e)}/>
                                            <TextField
                                                required
                                                name="price"
                                                type="number"
                                                fullWidth
                                                id="standard-required"
                                                label="Price"
                                                variant="standard"
                                                value={size.price}
                                                onChange={(e) => handlePriceChange(size.id, e)}/>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={addSize} style={{width: "max-content"}} variant="contained"
                                        endIcon={<i className="bx bx-plus-circle"></i>}>
                                    Add another size
                                </Button>
                            </div>
                        }
                        {ingredientForm &&
                            <div className="card p-4 m-0 flex-grow-1  col-md-4 h-auto text-start">
                                <div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h5 className="text-start">Ingredients: </h5>
                                        {!itemUpdate &&
                                            <i onClick={handleAddingIngredients} style={{
                                                fontSize: '20px',
                                                color: 'red',
                                                cursor: 'pointer',
                                                width: '20px',
                                            }} className='bx bxs-minus-circle'></i>
                                        }
                                    </div>
                                    <div className="row d-flex flex-wrap col-md-8 w-100">
                                        <FormControl sx={{m: 1, minWidth: 120}}>
                                            <InputLabel id="demo-simple-select-helper-label">ingredients</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value=""
                                                label="ingredients"
                                                onChange={handleAddIngredient}
                                            >
                                                {allIngredients.map((ingredient) => (
                                                    <MenuItem key={ingredient.id} value={ingredient}>
                                                        <Avatar
                                                            src={'data:image/png;base64,' + ingredient.image.imageBytes}/>
                                                        <h4 style={{marginLeft: '10px'}}>{ingredient.name}</h4>
                                                    </MenuItem>
                                                ))}


                                            </Select>
                                        </FormControl>
                                        {ingredients.map((ingredient) => (
                                            <Chip
                                                key={ingredient.ingredient.id}
                                                className="m-1 w-auto"
                                                label={
                                                    <>
                                                        {ingredient.ingredient.name}
                                                        <Input
                                                            type="number"
                                                            required
                                                            value={ingredient.quantity}
                                                            onChange={(event) => handleQuantityIngredientChange(event, ingredient.ingredient.id)}
                                                            id="standard-adornment-weight"
                                                            endAdornment={<InputAdornment
                                                                position="end">{ingredient.ingredient.unit}</InputAdornment>}
                                                            aria-describedby="standard-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'quantity',
                                                            }}
                                                            style={{width: '100px', marginLeft: '5px'}}
                                                        />
                                                    </>
                                                }
                                                onDelete={() => handleDeleteIngredient(ingredient.ingredient.id)}
                                                avatar={<Avatar
                                                    src={'data:image/png;base64,' + ingredient.ingredient.image.imageBytes}/>}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <hr/>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h5 className="text-start">Additional ingredients: </h5>
                                    </div>
                                    <div className="row d-flex flex-wrap col-md-8 w-100">
                                        <FormControl sx={{m: 1, minWidth: 120}}>
                                            <InputLabel id="demo-simple-select-helper-label">ingredients</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value=""
                                                label="ingredients"
                                                onChange={handleAddAdditionalIngredients}
                                            >
                                                {allIngredients.map((ingredient) => (
                                                    <MenuItem key={ingredient.id} value={ingredient}>
                                                        <Avatar
                                                            src={'data:image/png;base64,' + ingredient.image.imageBytes}/>
                                                        <h4 style={{marginLeft: '10px'}}>{ingredient.name}</h4>
                                                    </MenuItem>
                                                ))}


                                            </Select>
                                        </FormControl>
                                        {additionalIngredients.map((ingredient) => (
                                            <Chip
                                                key={ingredient.ingredient.id}
                                                className="m-1 w-auto"
                                                label={
                                                    <>
                                                        {ingredient.ingredient.name}
                                                        <Input
                                                            type="number"
                                                            required
                                                            value={ingredient.price}
                                                            onChange={(event) => handlePriceAdditionalIngredientsChange(event, ingredient.ingredient.id)}
                                                            id="standard-adornment-weight"
                                                            endAdornment={<InputAdornment
                                                                position="end">TND</InputAdornment>}
                                                            aria-describedby="standard-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'quantity',
                                                            }}
                                                            style={{width: '100px', marginLeft: '5px'}}
                                                        />
                                                        <Input
                                                            type="number"
                                                            required
                                                            value={ingredient.quantity}
                                                            onChange={(event) => handleQuantityAdditionalIngredientChange(event, ingredient.ingredient.id)}
                                                            id="standard-adornment-weight"
                                                            endAdornment={<InputAdornment
                                                                position="end">{ingredient.ingredient.unit}</InputAdornment>}
                                                            aria-describedby="standard-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'quantity',
                                                            }}
                                                            style={{width: '100px', marginLeft: '5px'}}
                                                        />
                                                    </>
                                                }
                                                onDelete={() => handleDeleteAdditionalIngredients(ingredient.ingredient.id)}
                                                avatar={<Avatar
                                                    src={'data:image/png;base64,' + ingredient.ingredient.image.imageBytes}/>}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <Button type="submit" className="mt-4" variant="contained"
                            style={{height: "max-content", width: "max-content"}}
                            endIcon={
                                !itemUpdate ?
                                    <i className="bx bx-plus-circle"></i>
                                    :
                                    <i className='bx bxs-edit'></i>
                            }>
                        {!itemUpdate ?
                            'Add'
                            :
                            'Edit'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
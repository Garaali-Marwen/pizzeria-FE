import * as React from 'react';
import {
    Avatar,
    Button,
    FormControl, FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select} from "@mui/material";
import {useEffect, useState} from "react";
import ItemService from "../../Services/ItemService";
import IngredientService from "../../Services/IngredientService";
import {useForm} from "react-hook-form"
import StockService from "../../Services/StockService";

export function StockItemForm({onAdd}) {

    const {register, handleSubmit} = useForm();
    const [itemError, setItemError] = useState("")
    const [quantityError, setQuantityError] = useState("")

    const [stockItem, setStockItem] = useState({
        quantity: ''
    })
    const [items, setItems] = useState([])
    useEffect(() => {
        Promise.all([
            ItemService.getItemsByCategory('drinks'),
            IngredientService.getAllIngredients()
        ])
            .then(([drinksResponse, ingredientsResponse]) => {
                const drinks = drinksResponse.data;
                const ingredients = ingredientsResponse.data;
                setItems([...drinks, ...ingredients]);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleFormChange = (e) => {
        if (e.target.name === 'item') {
            if (e.target.value.description) {
                setStockItem(prevState => ({item: e.target.value, quantity: prevState.quantity}));
            } else {
                setStockItem(prevState => ({ingredient: e.target.value, quantity: prevState.quantity}));
            }
        } else {
            setStockItem({
                ...stockItem,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleFormSubmit = (formData) => {
        let formDirty = false
        if (!formData.item) {
            setItemError("Item is required")
            formDirty = true
        } else {
            setItemError("")
        }
        if (!formData.quantity || !formData.quantity.length) {
            setQuantityError("quantity is required")
            formDirty = true
        } else {
            setQuantityError("")
        }
        if (!formDirty)
            StockService.addStockItem(stockItem)
                .then(response => onAdd())
                .catch(error => console.log(error))
    }

    return (
        <div className="container">
            <div>
                <h1 className="card-title">
                    Add item to stock
                </h1>
                <div className="border-top mb-5 mt-2"></div>
                <form className="d-flex flex-column gap-3" onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormControl style={{minWidth: "248px"}}
                                 error={!!(itemError && itemError.length)}>
                        <InputLabel id="demo-simple-select-label">Item</InputLabel>
                        <Select
                            {...register('item')}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={stockItem.item || stockItem.ingredient || ''}
                            onChange={handleFormChange}
                            label="Item"
                            name="item"
                        >
                            {items.map((item, index) =>
                                <MenuItem key={index} value={item}>
                                    <div style={{display: 'flex', alignItems: "center"}}>
                                        <Avatar
                                            src={'data:image/png;base64,' + item.image.imageBytes}/>
                                        <h4 style={{marginLeft: '10px'}}>{item.name}</h4>
                                    </div>

                                </MenuItem>
                            )}
                        </Select>
                        {itemError && <FormHelperText>{itemError}</FormHelperText>}
                    </FormControl>
                    <FormControl error={!!(quantityError && quantityError.length)}>
                        <OutlinedInput
                            {...register('quantity')}
                            id="outlined-adornment-weight" style={{minWidth: '200px'}}
                            endAdornment={<InputAdornment
                                position="end">{stockItem.ingredient ? stockItem.ingredient.unit : stockItem.item ? 'PIECE' :''}</InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'quantity',
                            }}
                            placeholder="Quantity"
                            type="number" name="quantity" value={stockItem.quantity} onChange={handleFormChange}
                        />
                        {quantityError && <FormHelperText>{quantityError}</FormHelperText>}
                    </FormControl>

                    <Button type="submit" variant="contained"
                            endIcon={<i className="bx bx-plus-circle"></i>}>
                        Add
                    </Button>
                </form>
            </div>
        </div>

    );
};
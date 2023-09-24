import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useEffect, useState} from 'react';
import ItemService from '../../Services/ItemService';
import {Avatar, Button, InputAdornment, OutlinedInput, TextField} from "@mui/material";
import Form from 'react-bootstrap/Form';
import OfferService from "../../Services/OfferService";
import SizeService from "../../Services/SizeService";

export function OfferForm({offerUpdate, onUpdate, onAdd}) {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [offer, setOffer] = useState({
        description: "",
        itemsDiscount: [],
        totalPrice: "",
        beginDate: "",
        endDate: "",
        image: {
            file: ""
        }
    })
    const [ingredientImage, setImage] = useState(null)


    useEffect(() => {
        ItemService.findAllItems()
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => console.log(error));
        if (offerUpdate) {
            const formattedBeginDate = formatDate(offerUpdate.beginDate);
            const formattedEndDate = formatDate(offerUpdate.endDate);
            setOffer(prevOffer => ({
                ...prevOffer,
                ...offerUpdate,
                beginDate: formattedBeginDate,
                endDate: formattedEndDate,
            }));
            setImage(offerUpdate.image && 'data:image/png;base64,' + offerUpdate.image.imageBytes)
            setSelectedItems(offerUpdate.itemsDiscount)
        }
    }, [offerUpdate]);

    const handleChange = (event) => {
        const selectedItem = {
            item: event.target.value,
            size: event.target.value.sizes.length ? event.target.value.sizes[0] : null,
            quantity: 1,
        };

        if (!selectedItems.some((item) => item.item.id === selectedItem.item.id)) {
            setSelectedItems((prevItems) => [...prevItems, selectedItem]);
        } else {
            setSelectedItems((prevItems) => {
                return prevItems.filter((item) => item.item.id !== selectedItem.item.id);
            });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('offer', new Blob([JSON.stringify(offer)], {type: 'application/json'}));
        formData.append('image', offer.image.file ? offer.image.file : new File([], ""));

        OfferService.addOffer(formData)
            .then(response => onAdd())
            .catch(error => console.log(error))
    }

    const editHandler = (e) => {
        e.preventDefault()
        console.log(offer)

        const formData = new FormData()
        formData.append('offer', new Blob([JSON.stringify(offer)], {type: 'application/json'}));
        formData.append('image', offer.image.file ? offer.image.file : new File([], ""));

        OfferService.editOffer(formData)
            .then(response => onUpdate())
            .catch(error => console.log(error))
    }

    useEffect(() => {
        setOffer(prevState => ({
            ...prevState,
            itemsDiscount: selectedItems
        }))
    }, [selectedItems]);

    const offerValueChangeHandler = (e) => {
        const {name, value} = e.target;
        setOffer((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]))
            setOffer({
                ...offer, image: {
                    file: event.target.files[0]
                },
            });
        }
    };

    const handleQuantityChange = (event, itemId) => {
        const newItems = selectedItems.map(item => {
            if (item.item.id === itemId) {
                return {
                    ...item,
                    quantity: parseInt(event.target.value),
                };
            }
            return item;
        });
        setSelectedItems(newItems);
    };

    const handleSizeChange = async (event, itemId) => {
        const newItems = await Promise.all(
            selectedItems.map(async item => {
                if (item.item.id === itemId) {
                    const response = await SizeService.getSizeById(event.target.value);
                    const newSize = response.data;
                    return {
                        ...item,
                        size: newSize,
                    };
                }
                return item;
            })
        );

        setSelectedItems(newItems);
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };


    return (
        <div>
            <div>
                <h1 className="card-title">
                    {!offerUpdate ?
                        'Ajout d\'offre'
                        :
                        'Modification d\'offre'}
                </h1>
                <div className="border-top mb-5 mt-2"></div>
                <form onSubmit={!offerUpdate ? submitHandler : editHandler}>
                    <div className="d-flex flex-column gap-2">

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">Articles</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value=""
                                label="Articles"
                                onChange={handleChange}
                            >
                                {items.map((item) => (
                                    <MenuItem
                                        key={item.id}
                                        value={item}
                                        style={{backgroundColor: selectedItems.some(selectedItem => selectedItem.item.id === item.id) ? "rgba(0,0,0,0.09)" : "transparent"}}
                                    >
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <div className="d-flex flex-wrap gap-2 w-100 align-items-center">
                            {selectedItems.map(item => (
                                <div key={item.item.id} style={{
                                    backgroundColor: "rgba(0,0,0,0.18)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "10px",
                                    maxWidth: "500px",
                                    minWidth: "350px",
                                    borderRadius: "10px",
                                    padding: "5px"
                                }}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <Avatar
                                            src={item.item.image ? 'data:image/png;base64,' + item.item.image.imageBytes : null}/>
                                        <b>{item.item.name}</b>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <TextField
                                            name="quantity"
                                            value={item.quantity}
                                            id="standard-required"
                                            label="Quantité"
                                            variant={"outlined"}
                                            type={"number"}
                                            style={{maxWidth: "100px"}}
                                            onChange={(event) => handleQuantityChange(event, item.item.id)}
                                        />

                                        {item.item.sizes.length > 0 &&
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={item.size ? item.size.id : ""}
                                                label="Taille"
                                                name="size"
                                                onChange={(event) => handleSizeChange(event, item.item.id)}
                                            >
                                                {item.item.sizes.map((size) => (
                                                    <MenuItem key={size.id} value={size.id}>
                                                        {size.size}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Prix total</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                name="totalPrice"
                                onChange={offerValueChangeHandler}
                                value={offer.totalPrice}
                                type={"number"}
                                endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                label="Prix total"
                            />
                        </FormControl>
                        {selectedItems.length > 0 &&
                            <b>
                                Ancien prix :
                                {selectedItems.reduce((accumulator, selectedItem) => {
                                    if (selectedItem.item.sizes.length > 0) {
                                        return accumulator + (selectedItem.size.price * selectedItem.quantity);
                                    } else {
                                        return accumulator + (selectedItem.item.price * selectedItem.quantity);
                                    }
                                }, 0)} €
                            </b>
                        }

                        <label style={{color: "#666666"}}>Date de début</label>
                        <TextField
                            name="beginDate"
                            onChange={offerValueChangeHandler}
                            value={offer.beginDate}
                            fullWidth
                            id="standard-required"
                            variant="outlined"
                            type={"date"}
                        />
                        <label style={{color: "#666666"}}>Date de fin</label>
                        <TextField
                            name="endDate"
                            onChange={offerValueChangeHandler}
                            value={offer.endDate}
                            fullWidth
                            id="standard-required"
                            variant="outlined"
                            type={"date"}
                        />

                        <Form.Group style={{width: "100%"}} controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color: "#666666"}}>Description</Form.Label>
                            <Form.Control
                                name="description"
                                as="textarea"
                                onChange={offerValueChangeHandler}
                                value={offer.description}
                                rows={3}/>
                        </Form.Group>
                    </div>

                    <div className="add-image mt-4">
                        <label
                            htmlFor="file1"
                            className="label-file"
                            style={{border: !ingredientImage ? '#575757 dashed 1px' : 'none'}}
                        >
                            {!ingredientImage && 'Choisissez l\'image de l\'offre'}
                            <img alt="" src={ingredientImage}/>
                            {ingredientImage && (<span className="edit-icon">
                  <i className="bx bxs-edit"></i>
                </span>)}
                        </label>
                        <input name="image" onChange={onImageChange} id="file1" className="input-file" type="file"/>
                    </div>

                    <Button type="submit" className="mt-4" variant="contained"
                            endIcon={
                                !offerUpdate ?
                                    <i className="bx bx-plus-circle"></i>
                                    :
                                    <i className='bx bxs-edit'></i>
                            }>
                        {!offerUpdate ?
                            'Ajouter'
                            :
                            'Modifier'}
                    </Button>
                </form>
            </div>

        </div>
    );
}

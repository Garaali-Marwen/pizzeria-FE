import React, {useEffect, useState} from 'react';
import {Button, FormControl, InputBase, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import '../../assets/styles/IngredientForm.css';
import IngredientService from '../../Services/IngredientService';
import {styled} from "@mui/material/styles";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

export function IngredientForm({ingredientUpdate, onUpdate, onAdd}) {
    const [ingredientImage, setImage] = useState(null)
    const [ingredient, setIngredient] = useState({
        name: '', image: '', unit: 'KG'
    });


    useEffect(() => {
        if (ingredientUpdate) {
            setIngredient(ingredientUpdate)
            setImage(ingredientUpdate.image && 'data:image/png;base64,' + ingredientUpdate.image.imageBytes)
        }
    }, [ingredientUpdate])

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]))
            setIngredient({
                ...ingredient, image: {
                    file: event.target.files[0]
                },
            });
        }
    };

    const ingredientValueChangeHandler = (e) => {
        setIngredient({
            ...ingredient, [e.target.name]: e.target.value,
        });
    };

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('ingredient', new Blob([JSON.stringify(ingredient)], {type: 'application/json'}));
        formData.append('image', ingredient.image.file, ingredient.image.file.name);

        IngredientService.addIngredient(formData)
            .then(response => {
                    setIngredient({name: '', image: ''})
                    setImage(null);
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
        formData.append('ingredient', new Blob([JSON.stringify(ingredient)], {type: 'application/json'}));
        formData.append('image', ingredient.image.file ? ingredient.image.file : new File([], ""));

        IngredientService.updateIngredient(formData)
            .then(() => onUpdate())
            .catch(error => console.log(error))
    };

    return (
        <div className="container">
            <div>
                <h1 className="card-title">
                    {!ingredientUpdate ?
                        'Add new ingredient'
                        :
                        'Edit ingredient'}
                </h1>
                <div className="border-top mb-5 mt-2"></div>
                <form onSubmit={!ingredientUpdate ? submitHandler : editHandler}>
                   <div className="d-flex align-items-center">
                       <TextField
                           name="name"
                           onChange={ingredientValueChangeHandler}
                           value={ingredient.name}
                           fullWidth
                           id="standard-required"
                           label="Ingredient name"
                           variant="standard"
                       />
                       <FormControl sx={{m: 1, width: '100px'}} variant="standard">
                           <InputLabel htmlFor="demo-customized-select-native">Unit</InputLabel>
                           <Select
                               name="unit"
                               labelId="demo-customized-select-label"
                               id="demo-customized-select"
                               input={<BootstrapInput/>}
                               value={ingredient.unit || ''}
                               onChange={ingredientValueChangeHandler}
                           >
                               <MenuItem value={'G'}>g</MenuItem>
                               <MenuItem value={'KG'}>kg</MenuItem>
                               <MenuItem value={'PIECE'}>piece</MenuItem>
                           </Select>
                       </FormControl>
                   </div>

                    <div className="add-image mt-4">
                        <label
                            htmlFor="file1"
                            className="label-file"
                            style={{border: !ingredientImage ? '#575757 dashed 1px' : 'none'}}
                        >
                            {!ingredientImage && 'Choose Ingredient image'}
                            <img alt="" src={ingredientImage}/>
                            {ingredientImage && (<span className="edit-icon">
                  <i className="bx bxs-edit"></i>
                </span>)}
                        </label>
                        <input name="image" onChange={onImageChange} id="file1" className="input-file" type="file"/>
                    </div>

                    <Button type="submit" className="mt-4" variant="contained"
                            endIcon={
                                !ingredientUpdate ?
                                    <i className="bx bx-plus-circle"></i>
                                    :
                                    <i className='bx bxs-edit'></i>
                            }>
                        {!ingredientUpdate ?
                            'Add'
                            :
                            'Edit'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

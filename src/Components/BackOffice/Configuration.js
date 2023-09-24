import * as React from 'react';
import {Button, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import ConfigService from "../../Services/ConfigService";
import {v4 as uuidv4} from 'uuid';
import SnackbarMessage from "../SnackbarMessage";

export function Configuration() {

    const [config, setConfig] = useState({
        contactPhone: "",
        deliveryPhone: "",
        contactEmail: "",
        carouselImages: []
    })
    const [message, setMessage] = useState('')

    const [images, setImages] = useState([])

    const [addedImages, setAddedImages] = useState([])
    const [deletedImages, setDeletedImages] = useState([])
    useEffect(() => {
        ConfigService.getConfig()
            .then(response => {
                const updatedImages = response.data[0].carouselImages.map((image) => ({
                    id: image.id,
                    src: 'data:image/png;base64,' + image.imageBytes,
                }));
                setImages(updatedImages)
                setConfig(response.data[0])
            })
            .catch(error => console.log(error))
    }, []);

    const onImagesAdd = (event) => {
        if (event.target.files && event.target.files[0]) {
            const selectedImages = Array.from(event.target.files);
            const updatedImages = selectedImages.map((image) => ({
                id: uuidv4(),
                src: URL.createObjectURL(image),
            }));

            setImages((prevState) => [...prevState, ...updatedImages]);
            setAddedImages((prevState) => [...prevState, ...selectedImages])
        }
    }

    const deleteImageById = (idToDelete) => {
        const updatedImages = images.filter((image) => image.id !== idToDelete);
        setImages(updatedImages);
        setConfig((prevState) => ({
            ...prevState,
            carouselImages: prevState.carouselImages.filter((image) => image.id !== idToDelete),
        }));
        setAddedImages(updatedImages);
        setDeletedImages(prevState => [...prevState, idToDelete])
    };


    const onImagesSave = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('config', new Blob([JSON.stringify(config)], {type: 'application/json'}));
        if (addedImages.length > 0) {
            addedImages.forEach((image) => {
                formData.append('images', image);
            });
        }

        ConfigService.editConfigImages(formData)
            .then(response => setMessage('Images updated Successfully'))
            .catch(error => console.log(error))
    }
    const handleSnackBarClose = () => {
        setMessage('')
    }

    const handleFormChanging = (e) => {
        const {name, value} = e.target;
        setConfig((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault()
        ConfigService.editConfig(config)
            .then(response => setMessage('Images updated Successfully'))
            .catch(error => console.log(error))
    }
    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Configuration</h1>
                    </div>
                    <div className="border-top mb-5"></div>
                </div>
            </div>

            <div className="w-100 mb-5" style={{paddingLeft: 50}}>
                <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center mb-4"
                         style={{whiteSpace: "nowrap"}}>
                        <div style={{borderBottom: "1px solid #31302e", width: "100%"}}></div>
                        <h1 style={{width: "max-content"}}>Images Carrousel</h1>
                        <div style={{borderBottom: "1px solid #31302e", width: "100%"}}></div>
                    </div>

                    <div className="d-flex gap-4 flex-wrap justify-content-center">
                        {images.length > 0 &&
                            images.map((image) => (

                                <div key={image.id} className="add-image">
                                    <i style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        color: "#fb0002",
                                        cursor: "pointer"
                                    }}
                                       onClick={() => deleteImageById(image.id)}
                                       className='bx bxs-minus-circle bx-tada'></i>
                                    <label
                                        htmlFor="file1"
                                        className="label-file"
                                        style={{border: 'none'}}>
                                        <img alt="" src={image.src}/>
                                    </label>
                                </div>
                            ))
                        }
                        <div className="add-image">
                            <label
                                htmlFor="file2"
                                className="label-file"
                                style={{border: '#575757 dashed 1px'}}>
                                Ajouter des images
                            </label>
                            <input name="images" onChange={onImagesAdd} id="file2" className="input-file"
                                   type="file" multiple/>
                        </div>
                    </div>
                    {(addedImages.length > 0 || deletedImages.length > 0) &&
                        <Button onClick={onImagesSave} variant="contained"
                                style={{height: "max-content", marginTop: "20px"}}>
                            Sauvegarder
                        </Button>
                    }
                </div>
            </div>


            <div className="w-100 mb-5" style={{paddingLeft: 50}}>
                <div>
                    <div className="d-flex align-items-center justify-content-center mb-4"
                         style={{whiteSpace: "nowrap"}}>
                        <div style={{borderBottom: "1px solid #31302e", width: "100%"}}></div>
                        <h1 style={{width: "max-content"}}>Informations</h1>
                        <div style={{borderBottom: "1px solid #31302e", width: "100%"}}></div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="d-flex gap-4 flex-column justify-content-center m-auto"
                          style={{maxWidth: "500px"}}>
                        <div className="d-flex gap-4 flex-wrap justify-content-between">
                            <TextField onChange={handleFormChanging}
                                       name="contactPhone"
                                       value={config.contactPhone}
                                       style={{maxWidth: "250px"}}
                                       id="outlined-basic"
                                       label="Tel Contact"
                                       variant="outlined"
                                       InputLabelProps={{shrink: true}}/>
                            <TextField onChange={handleFormChanging}
                                       name="deliveryPhone"
                                       value={config.deliveryPhone}
                                       style={{maxWidth: "250px"}}
                                       id="outlined-basic"
                                       label="Tel Livraison"
                                       variant="outlined"
                                       InputLabelProps={{shrink: true}}/>
                        </div>
                        <TextField onChange={handleFormChanging}
                                   name="contactEmail"
                                   value={config.contactEmail}
                                   id="outlined-basic"
                                   label="E-mail"
                                   variant="outlined" fullWidth
                                   InputLabelProps={{shrink: true}}/>

                        <Button variant="contained"
                                type="submit"
                                style={{height: "max-content", marginTop: "20px"}}>
                            Sauvegarder
                        </Button>
                    </form>
                </div>
            </div>


            <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>

        </div>
    );
};
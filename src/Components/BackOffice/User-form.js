import * as React from 'react';
import {Avatar, Button, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import ClientService from "../../Services/ClientService";
import SnackbarMessage from "../SnackbarMessage";
import EmployeeService from "../../Services/EmployeeService";

export function UserForm({user, onUpdate}) {
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarMessage('');
    };
    const [userData, setUserData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        phoneNumber: ""
    })
    const [userImage, setImage] = useState(null)
    const fileInputRef = useRef(null);
    const [imageChange, setImageChange] = useState(false)

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    useEffect(() => {
        setUserData(user)
        setImage(user.image && 'data:image/png;base64,' + user.image.imageBytes)
    }, [user]);

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
            setUserData((prev) => ({
                ...prev,
                image: {
                    file: event.target.files[0]
                }
            }));
            setImageChange(true)
        }
    };

    const handleDetailsChange = (e) => {
        const {name, value} = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = () => {
        const formData = new FormData()
        if (user.role === "CLIENT") {
            formData.append('clientId', new Blob([JSON.stringify(userData.id)], {type: 'application/json'}));
            formData.append('image', userData.image.file ? userData.image.file : new File([], ""));
            ClientService.updateClientImage(formData)
                .then(response => {
                    setSnackbarMessage('Image updated successfully');
                    setImageChange(false)
                    if (onUpdate)
                        onUpdate()
                })
                .catch(error => console.log(error))
        } else if (user.role === "EMPLOYEE") {
            formData.append('employeeId', new Blob([JSON.stringify(userData.id)], {type: 'application/json'}));
            formData.append('image', userData.image.file ? userData.image.file : new File([], ""));
            EmployeeService.updateEmployeeImage(formData)
                .then(response => {
                    setSnackbarMessage('Image updated successfully');
                    setImageChange(false)
                    if (onUpdate)
                        onUpdate()
                })
                .catch(error => console.log(error))
        }
    }

    useEffect(() => {
        if (imageChange) {
            handleImageChange()
        }
    }, [imageChange]);

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (user.role === "CLIENT")
            ClientService.updateClient(userData)
                .then(response => {
                    setSnackbarMessage('data updated successfully')
                    if (onUpdate)
                        onUpdate()
                })
                .catch(error => console.log(error))
        else if (user.role === "EMPLOYEE")
            EmployeeService.updateEmployee(userData)
                .then(response => {
                    setSnackbarMessage('data updated successfully')
                    if (onUpdate)
                        onUpdate()
                })
                .catch(error => console.log(error))
    }
    return (
        <div className="d-flex flex-wrap gap-3 justify-content-evenly align-items-start">
            <div className="card d-flex flex-column align-items-center p-3 gap-3 m-0"
                 style={{width: "100%", flexGrow: 1}}>
                <div style={{textTransform: "capitalize", padding: "10px", textAlign: "left", width: "100%"}}>
                    <b>Image de profil</b>
                    <div style={{borderBottom: "1px solid #bcbcbc", width: "100%"}}/>
                </div>

                <Avatar
                    sx={{height: "100%",
                        width: "100%",
                        aspectRatio: "1 / 1",
                        maxWidth: "150px",
                        fontSize: "80px"
                    }}
                    src={userImage}
                >
                    {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : ''}
                    {userData.lastName ? userData.lastName.charAt(0).toUpperCase() : ''}
                </Avatar>

                <div className="position-relative">
                    <Button
                        variant="contained"
                        style={{marginBottom: "20px"}}
                        endIcon={<EditIcon/>}
                        onClick={handleButtonClick}
                    >
                        Modifier l'image
                    </Button>
                    <input
                        ref={fileInputRef}
                        name="image"
                        onChange={onImageChange}
                        type="file"
                        style={{display: 'none'}}
                    />
                </div>

            </div>

            <div className="card d-flex flex-column align-items-center gap-3 p-3 m-0"
                 style={{width: "100%", flexGrow: 1}}>
                <div style={{textTransform: "capitalize", padding: "10px", textAlign: "left", width: "100%"}}>
                    <b>Modifier les données</b>
                    <div style={{borderBottom: "1px solid #bcbcbc", width: "100%"}}/>
                </div>

                <form onSubmit={handleFormSubmit}
                      className="d-flex flex-column gap-3 w-100 align-items-start"
                      style={{color: "#6c6c6c"}}>
                    <b>Prénon</b>
                    <TextField fullWidth id="outlined-basic"
                               variant="outlined"
                               name="lastName"
                               value={userData.lastName}
                               onChange={handleDetailsChange}/>
                    <b>Nom</b>
                    <TextField fullWidth id="outlined-basic"
                               variant="outlined"
                               name="firstName"
                               value={userData.firstName}
                               onChange={handleDetailsChange}/>
                    <b>E-mail</b>
                    <TextField fullWidth id="outlined-basic"
                               variant="outlined"
                               name="email"
                               type={"email"}
                               value={userData.email}
                               onChange={handleDetailsChange}/>
                    {user.role === "CLIENT" &&
                        <>
                            <b>Nméro de téléphone</b>
                            <TextField fullWidth id="outlined-basic"
                                       variant="outlined"
                                       name="phoneNumber"
                                       type={"tel"}
                                       value={userData.phoneNumber}
                                       onChange={handleDetailsChange}/>
                        </>
                    }

                    <Button type="submit" variant="contained"
                            style={{marginBottom: "20px", margin: "auto"}} endIcon={<EditIcon/>}>
                        Modifier
                    </Button>
                </form>
            </div>

            <SnackbarMessage
                message={snackbarMessage}
                severity="success"
                onClose={handleSnackbarClose}
            />
        </div>
    )
        ;
};
import * as React from 'react';
import {Button, TextField} from "@mui/material";
import {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import ClientService from "../../Services/ClientService";
import UserService from "../../Services/UserService";
import SnackbarMessage from "../SnackbarMessage";
import EmployeeService from "../../Services/EmployeeService";

export function PasswordReset({user}) {

    const [newPassword, setNewPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [oldPasswordError, setOldPasswordError] = useState("")
    const [passwordConfirmationError, setPasswordConfirmationError] = useState("")
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSnackbarClose = () => {
        setSnackbarMessage('');
    };
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value)
    }
    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value)
    }
    const handleConfirmationPasswordChange = (e) => {
        setPasswordConfirmation(e.target.value)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        let error = false;
        if (oldPassword.length > 0) {
            let response = user.role === "CLIENT" ?
                await ClientService.passwordVerification({password: oldPassword}, user.id) :
                await EmployeeService.passwordVerification({password: oldPassword}, user.id)
            if (!response.data) {
                setOldPasswordError("L'ancien mot de passe est incorrect.")
                error = true;
            } else setOldPasswordError("")
        } else {
            setOldPasswordError("Champs obligatoire.")
            error = true;
        }
        if (newPassword.length > 0) {
            if (newPassword.length < 8) {
                setNewPasswordError("Le nouveau mot de passe doit comporter au moins 8 caractères.")
                error = true;
            } else {
                setNewPasswordError("")
            }
        } else {
            setNewPasswordError("Champs obligatoire.")
            error = true;
        }
        if (!passwordConfirmation.length > 0) {
            setPasswordConfirmationError("Champs obligatoire.")
            error = true;
        }
        if (newPassword.length > 0 && passwordConfirmation.length > 0) {
            if (newPassword !== passwordConfirmation) {
                setPasswordConfirmationError("Le nouveau mot de passe et le mot de passe réécrit doivent correspondre.");
                error = true;
            } else setPasswordConfirmationError("")
        }


        if (!error) {
            if (user.role === "CLIENT")
                ClientService.updateClientPassword({password: newPassword}, user.id)
                    .then(response => {
                        setOldPassword("")
                        setNewPassword("")
                        setPasswordConfirmation("")
                        setSnackbarMessage('Password updated successfully');
                    })
                    .catch(error => console.log(error))
            else if (user.role === "EMPLOYEE")
                EmployeeService.updateEmployeePassword({password: newPassword}, user.id)
                    .then(response => {
                        setOldPassword("")
                        setNewPassword("")
                        setPasswordConfirmation("")
                        setSnackbarMessage('Password updated successfully');
                    })
                    .catch(error => console.log(error))
        }
    }


    return (
        <form onSubmit={handleFormSubmit} className="card p-4 m-0 d-flex flex-column gap-3" style={{ minWidth: "100%" }}>
            <TextField fullWidth onChange={handleOldPasswordChange}
                       label="Ancien mot de passe"
                       value={oldPassword}
                       type="password"
                       variant="outlined"
                       error={!!oldPasswordError}
            />
            {oldPasswordError && <p style={{ textAlign: "left" }} className="text-danger">{oldPasswordError}</p>}

            <div className="d-flex gap-3 w-100">
                <div className="w-100">
                    <TextField onChange={handleNewPasswordChange}
                               value={newPassword}
                               fullWidth
                               label="Nouveau mot de passe"
                               type="password"
                               variant="outlined"
                               error={!!newPasswordError}
                    />
                    {newPasswordError && <p style={{ textAlign: "left" }} className="text-danger">{newPasswordError}</p>}

                </div>
                <div className="w-100">
                    <TextField onChange={handleConfirmationPasswordChange}
                               fullWidth label="Confirmer mot de passe"
                               type="password"
                               value={passwordConfirmation}
                               variant="outlined"
                               error={!!passwordConfirmationError}
                    />
                    {passwordConfirmationError &&
                        <p style={{ textAlign: "left" }} className="text-danger">{passwordConfirmationError}</p>}

                </div>
            </div>
            <Button type="submit" variant="contained"
                    style={{ width: "max-content", marginBottom: "20px", margin: "auto" }} endIcon={<EditIcon />}>
                Modifier
            </Button>


            <SnackbarMessage
                message={snackbarMessage}
                severity="success"
                onClose={handleSnackbarClose}
            />
        </form>
    );
};
import * as React from 'react';
import {Button, TextField} from "@mui/material";
import {useState} from "react";
import EmployeeService from "../../Services/EmployeeService";

export function EmployeeForm({onAdd}) {

    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })
    const employeeValueChangeHandler = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        })
    }
    const submitHandler = (e) => {
        e.preventDefault()
        EmployeeService.addEmployee(employee)
            .then(response => {
                setEmployee({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                })
                onAdd()
            })
            .catch(error => console.log(error))
    }
    return (
        <div className="container">
            <div>
                <h1 className="card-title">
                    Ajout d'employé
                </h1>
                <div className="border-top mb-5 mt-2"></div>
                <form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center gap-2">
                        <TextField
                            name="firstName"
                            onChange={employeeValueChangeHandler}
                            value={employee.firstName}
                            fullWidth
                            label="Prénom"
                            variant="standard"
                        />
                        <TextField
                            name="lastName"
                            onChange={employeeValueChangeHandler}
                            value={employee.lastName}
                            fullWidth
                            label="Nom"
                            variant="standard"
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <TextField
                            name="email"
                            onChange={employeeValueChangeHandler}
                            value={employee.email}
                            fullWidth
                            label="E-mail"
                            variant="standard"
                        />
                        <TextField
                            name="password"
                            onChange={employeeValueChangeHandler}
                            value={employee.password}
                            fullWidth
                            label="Password"
                            type={"password"}
                            variant="standard"
                        />
                    </div>
                    <Button type="submit" className="mt-4" variant="contained"
                            endIcon={<i className="bx bx-plus-circle"></i>}
                    >
                        Ajouter
                    </Button>
                </form>
            </div>
        </div>
    )
        ;
};
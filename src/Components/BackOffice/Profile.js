import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {UserForm} from "./User-form";
import {PasswordReset} from "./Password-reset";
import {useEffect, useState} from "react";
import ClientService from "../../Services/ClientService";
import UserService from "../../Services/UserService";
import EmployeeService from "../../Services/EmployeeService";

function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function Profile({userUpdate, onUpdate}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [user, setUser] = useState({
        image: null,
        lastName: "",
        firstName: "",
        email: "",
        phoneNumber: ""
    })

    useEffect(() => {
        if (userUpdate)
            setUser(userUpdate)

        else {
            if (UserService.getRole() === "CLIENT")
                ClientService.getClientById(UserService.getUserId())
                    .then(response => {
                        setUser(response.data)
                    })
                    .catch(error => console.log(error))
            else
                EmployeeService.getEmployeeById(UserService.getUserId())
                    .then(response => {
                        setUser(response.data)
                    })
                    .catch(error => console.log(error))
        }

    }, [userUpdate]);

    return (
        <div className="h-100">
            <div className="w-100">
                <div className="p-5">
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Compte</h1>
                    </div>
                    <div className="border-top mb-5"></div>
                </div>
                <Box sx={{width: '100%'}}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider', marginLeft: 5}}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab style={{fontWeight: 'bold'}} label="Profil" {...a11yProps(0)} />
                            {UserService.getRole() !== "ADMIN" &&
                                <Tab style={{fontWeight: 'bold'}} label="Securité" {...a11yProps(1)} />
                            }
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <div>
                            <UserForm user={user} onUpdate={onUpdate}/>
                        </div>
                    </CustomTabPanel>
                    {UserService.getRole() !== "ADMIN" &&
                        <CustomTabPanel value={value} index={1}>
                            <div>
                                <PasswordReset user={user}/>
                            </div>
                        </CustomTabPanel>
                    }
                </Box>
            </div>
        </div>
    );
}
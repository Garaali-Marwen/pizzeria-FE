import * as React from 'react';
import Tooltip from "@mui/material/Tooltip";
import {
    Avatar, Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {Element, scroller} from "react-scroll";
import {ItemForm} from "./Item-Form";
import SnackbarMessage from "../SnackbarMessage";
import {useEffect, useState} from "react";
import {ItemCard} from "../FrontOffice/Item-Card";
import ItemService from "../../Services/ItemService";
import CategoryService from "../../Services/CategoryService";
import ClientService from "../../Services/ClientService";
import {Profile} from "./Profile";
import {EmployeeForm} from "./Employee-form";

export function Users() {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [chosenUser, setChosenUser] = useState(null)
    const handleOpenUser = (item) => {
        setChosenUser(<ItemCard style={{margin: 0}} item={item}/>)
        toggle()
    }

    const [user, setUser] = useState(null)
    const handleEditUser = (user) => {
        setUser(user)
        scroller.scrollTo("userForm", {
            duration: 500,
            smooth: true,
        });
    }

    const handleUserUpdated = () => {
        setMessage('User updated Successfully')
        setUser(null)
    }


    const [addUser, setAddUser] = useState(false)
    const handleAddingUser = () => {
        setAddUser(!addUser)
    }

    const handleUserAdded = () => {
        setMessage('Employee added Successfully')
        setAddUser(!addUser)
    }

    const [users, setUsers] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        lastPage: false,
        pageNumber: 0
    })


    useEffect(() => {
        if (user === null && !addUser) {
            changePage(0)
        }
    }, [user, addUser])
    const changePage = (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > users.pageNumber && users.lastPage) {
            return
        }
        if (pageNumber < users.pageNumber && users.pageNumber === 0) {
            return
        }
        ClientService.getAllClients(pageNumber, pageSize)
            .then(response => {
                setUsers({
                    content: response.data.content,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageSize: response.data.pageable.pageSize,
                    lastPage: response.data.last,
                    pageNumber: response.data.pageable.pageNumber
                });
            })
            .catch(error => {
                console.error("Error fetching items:", error);
            });

    }

    const handleChangePage = (event, newPage) => {
        changePage(newPage, users.pageSize)
    };

    const handleChangeRowsPerPage = (event) => {
        changePage(0, parseInt(event.target.value, 10))
    };
    const [message, setMessage] = useState('')
    const handleSnackBarClose = () => {
        setMessage('')
    }
    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Utilisateurs</h1>
                        <Button variant="contained" onClick={handleAddingUser}>Ajouter un employé</Button>
                    </div>
                    <div className="border-top mb-5"></div>
                </div>
                <TableContainer style={{marginBottom: '50px'}}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="left"><b>Nom</b></TableCell>
                                <TableCell align="left"><b>E-mail</b></TableCell>
                                <TableCell align="left"><b>Téléphone</b></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.content.map((user) => (
                                <TableRow
                                    key={user.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <Avatar
                                            src={user.image ? 'data:image/png;base64,' + user.image.imageBytes : null}>
                                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                                            {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell align="left"
                                               style={{textTransform: "capitalize"}}>{user.firstName} {user.lastName}</TableCell>
                                    <TableCell align="left"
                                               style={{textTransform: "capitalize"}}>{user.email}</TableCell>
                                    <TableCell align="left">{user.phoneNumber}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEditUser(user)} aria-label="edit">
                                                <ModeEditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>

                                    <Modal isOpen={modal} toggle={toggle} style={{maxWidth: 'max-content'}}>
                                        <ModalHeader style={{
                                            position: "absolute",
                                            zIndex: 999,
                                            width: '100%',
                                            borderBottom: 'none'
                                        }} toggle={toggle}></ModalHeader>
                                        <ModalBody style={{padding: 0}}>
                                            {chosenUser}
                                        </ModalBody>
                                    </Modal>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="pagination-Items">
                        <TablePagination
                            component="div"
                            count={users.totalElements}
                            page={users.pageNumber}
                            onPageChange={handleChangePage}
                            rowsPerPage={users.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </TableContainer>


                <Element name="userForm">
                    {user && <Profile userUpdate={user} onUpdate={handleUserUpdated}/>}
                </Element>

                <Modal style={{minWidth: '50%'}} isOpen={addUser} toggle={handleAddingUser}>
                    <ModalHeader
                        style={{position: "absolute", border: "none", textAlign: "end", width: '100%', zIndex: 99}}
                        toggle={handleAddingUser}></ModalHeader>
                    <ModalBody>
                        <EmployeeForm onAdd={handleUserAdded}/>
                    </ModalBody>
                </Modal>

                <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>

            </div>
        </div>
    );
};
import * as React from 'react';
import {useEffect, useState} from 'react';
import Tooltip from "@mui/material/Tooltip";
import {
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
import SnackbarMessage from "../SnackbarMessage";
import {OfferCard} from "../FrontOffice/Offer-card";
import OfferService from "../../Services/OfferService";
import {OfferForm} from "./Offer-form";

export function Offers() {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [chosenOffer, setChosenOffer] = useState(null)
    const handleOpenOffer = (item) => {
        setChosenOffer(<OfferCard style={{margin: 0}} item={item}/>)
        toggle()
    }

    const [offer, setOffer] = useState(null)
    const handleEditOffer = (offer) => {
        setOffer(offer)
        scroller.scrollTo("offerForm", {
            duration: 500,
            smooth: true,
        });
    }

    const handleOfferUpdated = () => {
        setMessage('offer updated Successfully')
        setOffer(null)
    }


    const [addOffer, setAddOffer] = useState(false)
    const handleAddingOffer = () => {
        setAddOffer(!addOffer)
    }

    const handleOfferAdded = () => {
        setMessage('Offer added Successfully')
        setAddOffer(!addOffer)
    }

    const [offers, setOffers] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        lastPage: false,
        pageNumber: 0
    })


    useEffect(() => {
        if (offer === null && !addOffer) {
            changePage(0)
        }
    }, [offer, addOffer])
    const changePage = (pageNumber = 0, pageSize = 10) => {
        if (pageNumber > offers.pageNumber && offers.lastPage) {
            return
        }
        if (pageNumber < offers.pageNumber && offers.pageNumber === 0) {
            return
        }
        OfferService.getAllOffers(pageNumber, pageSize)
            .then(response => {
                setOffers({
                    content: response.data.content,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    pageSize: response.data.pageable.pageSize,
                    lastPage: response.data.last,
                    pageNumber: response.data.pageable.pageNumber
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleChangePage = (event, newPage) => {
        changePage(newPage, offers.pageSize)
    };

    const handleChangeRowsPerPage = (event) => {
        changePage(0, parseInt(event.target.value, 10))
    };


    const [message, setMessage] = useState('')
    const handleSnackBarClose = () => {
        setMessage('')
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="h-100 p-2">
            <div className="w-100 p-5">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1 className="card-title text-start">Offres</h1>
                        <Tooltip title="Add new item">
                            <IconButton onClick={handleAddingOffer} aria-label="add">
                                <AddCircleOutlineIcon style={{color: '#000000'}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="border-top mb-5"></div>
                </div>
                <TableContainer style={{marginBottom: '50px'}}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"><b>Date de début</b></TableCell>
                                <TableCell align="left"><b>Date de fin</b></TableCell>
                                <TableCell align="left"><b>Articles</b></TableCell>
                                <TableCell align="left"><b>Prix total&nbsp;(€)</b></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {offers.content.map((offer) => (
                                <TableRow
                                    key={offer.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{formatDate(offer.beginDate)}</TableCell>
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{formatDate(offer.endDate)}</TableCell>
                                    <TableCell align="left" style={{textTransform: "capitalize"}}>{offer.itemsDiscount.map(itemDiscount => (<b key={itemDiscount.id}>{itemDiscount.item.name}<br/></b>))}</TableCell>
                                    <TableCell align="left">{offer.totalPrice}</TableCell>
                                    <TableCell align="right">
                                        {/*<Tooltip title="Delete">
                                            <IconButton aria-label="delete">
                                                <DeleteForeverIcon/>
                                            </IconButton>
                                        </Tooltip>*/}
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEditOffer(offer)} aria-label="edit">
                                                <ModeEditIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Watch">
                                            <IconButton onClick={() => handleOpenOffer(offer)} aria-label="open">
                                                <VisibilityIcon/>
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
                                            {chosenOffer}
                                        </ModalBody>
                                    </Modal>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="pagination-Items">
                        <TablePagination
                            component="div"
                            count={offers.totalElements}
                            page={offers.pageNumber}
                            onPageChange={handleChangePage}
                            rowsPerPage={offers.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            // rowsPerPageOptions={[10, 15, 25, 50]}
                        />
                    </div>
                </TableContainer>


                <Element name="offerForm">
                    {offer && <OfferForm offerUpdate={offer} onUpdate={handleOfferUpdated}/>}
                </Element>
                <Modal style={{minWidth: '50%'}} isOpen={addOffer} toggle={handleAddingOffer}>
                    <ModalHeader
                        style={{position: "absolute", border: "none", textAlign: "end", width: '100%', zIndex: 99}}
                        toggle={handleAddingOffer}></ModalHeader>
                    <ModalBody>
                        <OfferForm onAdd={handleOfferAdded}/>
                    </ModalBody>
                </Modal>

                <SnackbarMessage message={message} onClose={handleSnackBarClose} severity="success"/>

            </div>
        </div>
    );
};
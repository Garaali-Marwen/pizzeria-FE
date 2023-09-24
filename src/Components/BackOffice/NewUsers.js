import * as React from 'react';
import {Avatar, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {useEffect, useState} from "react";
import ClientService from "../../Services/ClientService";
import OrderService from "../../Services/OrderService";

export function NewUsers() {
    const [clients, setClients] = useState([]);
    const [clientCounts, setClientCounts] = useState({});

    useEffect(() => {
        ClientService.getNewClients()
            .then(response => {
                setClients(response.data);
                fetchOrderCounts(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    async function fetchOrderCounts(clients) {
        const counts = {};
        for (const client of clients) {
            try {
                const response = await OrderService.countOrdersByClient_Id(client.id);
                counts[client.id] = response.data;
            } catch (error) {
                console.log(error);
            }
        }
        setClientCounts(counts);
    }

    return (
        <Table size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell align="left"><b>Clients</b></TableCell>
                    <TableCell align="right"><b>Commandes</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {clients.map((client) => (
                    <TableRow
                        key={client.id}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell align="left" style={{textTransform: "capitalize"}}>
                            <div className="d-flex align-items-center gap-2">
                                <Avatar
                                    src={client.image ? 'data:image/png;base64,' + client.image.imageBytes : null}>
                                    {client.firstName ? client.firstName.charAt(0).toUpperCase() : ''}
                                    {client.lastName ? client.lastName.charAt(0).toUpperCase() : ''}
                                </Avatar>
                                <b>{client.firstName} {client.lastName}</b>
                            </div>
                        </TableCell>
                        <TableCell align="right" style={{textTransform: "capitalize"}}>
                            {clientCounts[client.id] > 0 ?
                                (<b className="d-flex align-items-center justify-content-end gap-2"><i
                                    style={{color: "#6cc305", fontSize: "30px"}}
                                    className='bx bx-chevrons-up'></i> {clientCounts[client.id]}</b>)
                                : (<b> {clientCounts[client.id]}</b>)
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

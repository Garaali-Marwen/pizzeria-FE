import React, {useEffect, useState} from 'react';
import SideNavBar from './SideNavBar';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {Dashboard} from './Dashboard';
import {OrdersList} from "./Orders-list";
import {Items} from "./Items";
import {IngredientsList} from "./Ingredients-list";
import {Stock} from "./Stock";
import {CategoriesList} from "./Categories-list";
import {Transactions} from "./Transactions";
import {MapDelivery} from "./MapDelivery";
import {Offers} from "./Offers";
import {Profile} from "./Profile";
import {NotFound} from "./404NotFound";
import UserService from "../../Services/UserService";
import {Users} from "./Users";
import {ClientOrders} from "./ClientOrders";
import {Configuration} from "./Configuration";

export function BackOffice() {
    const navigate = useNavigate();

    const [isExpanded, setExpendState] = useState(true);
    const handleExpandedNav = (isExpanded) => {
        setExpendState(isExpanded)
    }

    const isLoggedIn = UserService.isLoggedIn();
    const userRole = UserService.getRole();

    useEffect(() => {
        if (!isLoggedIn)
            navigate("/404")
    }, []);

    return (
        <div className="w-100 d-flex">
            <SideNavBar onExpand={handleExpandedNav}/>
            <div className="w-100 bg-white" style={{paddingLeft: isExpanded ? '300px' : '85px', minHeight: '100vh'}}>
                <Routes>
                    {userRole === "ADMIN" &&
                        <>
                            <Route path="/users" element={<Users/>}/>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/categories" element={<CategoriesList/>}/>
                            <Route path="/Offers" element={<Offers/>}/>
                        </>
                    }
                    {(userRole === "ADMIN" || userRole === "CLIENT") &&
                        <Route path="/transactions" element={<Transactions/>}/>
                    }
                    {(userRole === "ADMIN" || userRole === "EMPLOYEE") &&
                        <>
                            <Route path="/ingredients" element={<IngredientsList/>}/>
                            <Route path="/items" element={<Items/>}/>
                            <Route path="/stock" element={<Stock/>}/>
                            <Route path="/orders" element={<OrdersList/>}/>
                            <Route path="/orders-map" element={<MapDelivery/>}/>
                            <Route path="/configuration" element={<Configuration/>}/>
                        </>
                    }
                    {(userRole === "CLIENT" || userRole === "EMPLOYEE") &&
                        <Route path="/profile" element={<Profile/>}/>
                    }
                    {userRole === "CLIENT" &&
                        <Route path="/client/orders" element={<ClientOrders/>}/>
                    }
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
        </div>
    );
}

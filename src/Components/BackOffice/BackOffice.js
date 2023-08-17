import React, {useState} from 'react';
import SideNavBar from './SideNavBar';
import {Route, Routes} from 'react-router-dom';
import { Dashboard } from './Dashboard';
import {OrdersList} from "./Orders-list";
import {Items} from "./Items";
import {IngredientsList} from "./Ingredients-list";
import {Stock} from "./Stock";
import {CategoriesList} from "./Categories-list";
import {Transactions} from "./Transactions";
export function BackOffice() {

    const [isExpanded, setExpendState] = useState(true);
    const handleExpandedNav = (isExpanded) => {
        setExpendState(isExpanded)
    }

    return (
        <div className="w-100 d-flex">
            <SideNavBar onExpand={handleExpandedNav} />
            <div className="w-100 bg-white" style={{paddingLeft: isExpanded ? '300px' : '115px', minHeight: '100vh'}}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ingredients" element={<IngredientsList />} />
                    <Route path="/categories" element={<CategoriesList />} />
                    <Route path="/orders" element={<OrdersList />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/stock" element={<Stock />} />
                    <Route path="/transactions" element={<Transactions />} />

                </Routes>
            </div>
        </div>
    );
}

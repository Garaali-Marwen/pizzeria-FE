import React, {useEffect, useState} from 'react';
import {IncomeStats} from "./IncomeStats";
import {OrdersStats} from "./OrdersStats";
import {ItemsClientsStats} from "./Items-Clients-Stats";
import {StackedColumnChart} from "./StackedColumnChart";
import {NewUsers} from "./NewUsers";
import {StackedChart} from "./StackedChart";
import {RadialbarChart} from "./RadialbarChart";
import CategoryService from "../../Services/CategoryService";

export function Dashboard() {
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState("")

    useEffect(() => {
        CategoryService.getAllCategories()
            .then(response => {
                setCategory(response.data[0].id)
                setCategories(response.data)
            })
            .catch(error => console.log(error))
    }, []);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value)
    }


    return (
        <div>
            <div className="d-flex gap-3 w-auto p-4 flex-wrap">
                <IncomeStats/>
                <OrdersStats/>
                <ItemsClientsStats/>
            </div>
            <div className="row p-4 gap-5" style={{maxWidth: "100%"}}>
                <div className="col-8 col-sm-12 col-lg-7 card">
                    <div className="card-title p-3" style={{textAlign: "left"}}>
                        <div>
                            <b>Revenus par catégorie pour l'année {new Date().getFullYear()}</b>
                        </div>
                        <div style={{borderBottom: "1px solid rgba(89,89,89,0.63)", marginTop: "3px"}}></div>
                    </div>
                    <div className="card-body">
                        <StackedColumnChart year={new Date().getFullYear()}/>
                    </div>
                </div>
                <div className="col-4 col-sm-12 col-lg-4 card">
                    <div className="card-title p-3" style={{textAlign: "left"}}>
                        <div>
                            <b>Nouveaux clients</b>
                        </div>
                        <div style={{borderBottom: "1px solid rgba(89,89,89,0.63)", marginTop: "3px"}}></div>
                    </div>
                    <div className="card-body p-0">
                        <NewUsers/>
                    </div>
                </div>
            </div>
            <div className="row p-4 gap-5" style={{maxWidth: "100%"}}>
                <div className="col-8 col-sm-12 col-lg-7 card">
                    <div className="card-title p-3" style={{textAlign: "left"}}>
                        <div>
                            <b>Répartition des Types de Commandes pour l'année {new Date().getFullYear()}</b>
                        </div>
                        <div style={{borderBottom: "1px solid rgba(89,89,89,0.63)", marginTop: "3px"}}></div>
                    </div>
                    <div className="card-body">
                        <StackedChart/>
                    </div>
                </div>
                <div className="col-4 col-sm-12 col-lg-4 card">
                    <div className="card-title p-3" style={{textAlign: "left"}}>
                        <div>
                            <b>
                                Répartition des commandes par article pour la catégorie :&nbsp;&nbsp;
                                <select name="category"
                                        value={category || categories[0]?.id || ""}
                                        style={{textTransform: "capitalize",
                                            width: "max-content",
                                        border: "1px solid rgba(0,0,0,0.53)",
                                        borderRadius: "10px"}}
                                        onChange={handleCategoryChange}
                                >
                                    {categories.map((category) =>
                                        (<option key={category.id}
                                                 value={category.id}
                                                 style={{textTransform: "capitalize"}}>
                                            {category.name}
                                        </option>)
                                    )}
                                </select>
                            </b>
                        </div>
                        <div style={{borderBottom: "1px solid rgba(89,89,89,0.63)", marginTop: "3px"}}></div>
                    </div>
                    <div className="card-body p-0">
                        <RadialbarChart category={category}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
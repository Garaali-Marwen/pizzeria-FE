import React, {useEffect, useState} from "react";
import "../../assets/styles/SideNavBar.css";
import {Link, useLocation, useNavigate} from "react-router-dom";
import UserService from "../../Services/UserService";
import ClientService from "../../Services/ClientService";
import EmployeeService from "../../Services/EmployeeService";
import useMediaQuery from '@mui/material/useMediaQuery';
import ingredientsIcon from '../../assets/Images/ingredients.png'
import InventoryIcon from '@mui/icons-material/Inventory';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SettingsIcon from '@mui/icons-material/Settings';

const SideNavBar = ({onExpand}) => {
    const location = useLocation();

    const matches = useMediaQuery('(min-width:900px)');


    const [user, setUser] = useState(null)

    useEffect(() => {
        onExpand(matches)
        setExpendState(matches)
    }, [matches])

    useEffect(() => {
        switch (UserService.getRole()) {
            case "CLIENT" :
                ClientService.getClientById(UserService.getUserId()).then(response => setUser(response.data)).catch(error => console.log(error))
                break
            case "EMPLOYEE" :
                EmployeeService.getEmployeeById(UserService.getUserId()).then(response => setUser(response.data)).catch(error => console.log(error))
                break
            case "ADMIN" :
                UserService.getUserById(UserService.getUserId()).then(response => setUser(response.data)).catch(error => console.log(error))
                break
            default:
                break
        }
    }, [])

    const navigate = useNavigate();

    const logout = () => {
        UserService.clear()
        navigate('/')
    }

    const [isExpanded, setExpendState] = useState(matches);
    const menuItems = [
        {
            text: "Tableau de bord",
            icon: <i className='bx bx-bar-chart-alt-2 menu-item-icon'></i>,
            link: "/backOffice/dashboard"
        },
        {
            text: "Configuration",
            icon: <i><SettingsIcon/></i>,
            link: "/backOffice/configuration"
        },
        {
            text: "Profil",
            icon: <i className='bx bxs-user-circle'></i>,
            link: "/backOffice/profile"
        },
        {
            text: "Utilisateurs",
            icon: <i><PeopleAltIcon/></i>,
            link: "/backOffice/users"
        },
        {
            text: "Offres",
            icon: <i className='bx bxs-offer'></i>,
            link: "/backOffice/offers"
        },
        {
            text: "Stock",
            icon: <i><InventoryIcon/></i>,
            link: "/backOffice/stock"
        },
        {
            text: "Commandes",
            icon: <i className='bx bx-food-menu'></i>,
            link: "/backOffice/orders"
        },
        {
            text: "Articles",
            icon: <i className='bx bx-list-ul'></i>,
            link: "/backOffice/items"
        },
        {
            text: "Ingrédients",
            icon: <i><img alt="" src={ingredientsIcon} style={{width: '30px', height: '30px'}}/></i>,
            link: "/backOffice/ingredients"
        },
        {
            text: "Mes commandes",
            icon: <i><FastfoodIcon/></i>,
            link: "/backOffice/client/orders"
        },
        {
            text: "Transactions",
            icon: <i><PaidIcon/></i>,
            link: "/backOffice/transactions"
        },
        {
            text: "Carte",
            icon: <i className='bx bx-map'></i>,
            link: "/backOffice/orders-map"
        },
        {
            text: "Catégories",
            icon: <i className='bx bx-category'></i>,
            link: "/backOffice/categories"
        },
        {
            text: "Acceuil",
            icon: <i className='bx bx-home  menu-item-icon'></i>,
            link: "/"
        }
    ];

    const filterMenuItemsByRole = (role) => {
        return menuItems.filter((item) => {
            switch (role) {
                case 'CLIENT':
                    return ['Transactions', 'Profil', 'Acceuil', 'Mes commandes'].includes(item.text);
                case 'EMPLOYEE':
                    return ['Carte', 'Stock', 'Commandes', 'Articles', 'Ingrédients', "Profil", 'Acceuil'].includes(item.text);
                case 'ADMIN':
                    return !['Profil', "Mes commandes"].includes(item.text);
                default:
                    return false;
            }
        });
    };
    const userRole = UserService.getRole();
    const filteredMenuItems = filterMenuItemsByRole(userRole);

    return (
        <div className={isExpanded
            ? "side-nav-container"
            : "side-nav-container side-nav-container-NX"}>
            <div className="nav-upper">
                <div className="nav-heading">
                    {isExpanded && (
                        <div className="nav-brand">
                            <h2 className="m-0">Pizzeria</h2>
                        </div>
                    )}
                    <button onClick={() => {
                        onExpand(!isExpanded)
                        setExpendState(!isExpanded)
                    }}
                            className={isExpanded
                                ? "hamburger hamburger-in"
                                : "hamburger hamburger-out"}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <div className="nav-menu">
                    {filteredMenuItems.map(({text, icon, link}) => (
                        <Link key={link} className={isExpanded ? "menu-item" : "menu-item menu-item-NX"}
                              style={{backgroundColor: location.pathname === link ? "rgba(255,255,255,0.13)" : "transparent"}}
                              to={link}>
                            {icon}
                            {isExpanded && <p>{text}</p>}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="nav-footer">
                {isExpanded && user && (
                    <p className="nav-footer-user-name"
                       style={{textTransform: "capitalize"}}>{user.firstName} {user.lastName}</p>
                )}
                <i style={{cursor: "pointer"}} onClick={logout} className='bx bx-log-out logout-icon'></i>
            </div>
        </div>
    );
};

export default SideNavBar;

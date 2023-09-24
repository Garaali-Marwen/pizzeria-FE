import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import {Avatar, IconButton, Menu, MenuItem} from "@mui/material";
import "../../assets/styles/header.css"
import UserService from "../../Services/UserService";
import ClientService from "../../Services/ClientService";
import EmployeeService from "../../Services/EmployeeService";
import Badge from '@mui/material/Badge';
import {styled} from '@mui/material/styles';
import logo from '../../assets/Images/logo.png'
import delivery from '../../assets/Images/delivery.png'
import useMediaQuery from "@mui/material/useMediaQuery";
import ConfigService from "../../Services/ConfigService";


const StyledBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        right: 1,
        top: 5,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

function Header({cartItemCount, updateCartItemCount, updateIsLoggedIn, isLoggedIn}) {
    const matches = useMediaQuery('(min-width:700px)');
    const [user, setUser] = useState(null)
    const location = useLocation();
    const [deliveryPhone, setDeliveryPhone] = useState("")

    useEffect(() => {
        updateCartItemCount()
        ConfigService.getConfig()
            .then(response => setDeliveryPhone(response.data[0].deliveryPhone))
            .catch(error => console.log(error))
        if (isLoggedIn) {
            const id = UserService.getUserId()
            switch (UserService.getRole()) {
                case "CLIENT" :
                    ClientService.getClientById(id).then(response => setUser(response.data)).catch(error => console.log(error))
                    break
                case "EMPLOYEE" :
                    EmployeeService.getEmployeeById(id).then(response => setUser(response.data)).catch(error => console.log(error))
                    break
                case "ADMIN" :
                    UserService.getUserById(id).then(response => setUser(response.data)).catch(error => console.log(error))
                    break
                default :
                    break
            }
        }
    }, [isLoggedIn])

    const [isNavVisible, setIsNavVisible] = useState(false);
    const handleMenuClick = () => {
        setIsNavVisible(!isNavVisible);
    };


    const [anchorEl, setAnchorEl] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const logOut = () => {
        setUser(null);
        UserService.clear();
        updateIsLoggedIn()
        updateCartItemCount();
    };

    const [search, setSearch] = useState(false)
    const handleSearch = () => {
        setSearch(prevState => !prevState)
    }

    return (
        <div style={{backgroundColor: "#211e1e", zIndex: 9999}}>
            <div className="header">
                <div className="logo-container">
                    <Link className="navbar-text text-decoration-none m-2" to="/"><img className="logo" src={logo}
                                                                                       alt=""/></Link>
                </div>


                <div className="w-100 d-flex justify-content-around">
                    <nav>
                        <ul>
                            <li>
                                <Link className="navbar-text text-decoration-none" to="/" style={{
                                    padding: 0,
                                    color: location.pathname === "/" ? "#6cc305" : "#fbfcfd"
                                }}>

                                    Acceuil
                                    <span
                                        className="underline"
                                        style={{display: location.pathname === "/" ? "block" : "none"}}
                                    ></span>
                                </Link>
                            </li>
                            <li>
                                <Link className="navbar-text text-decoration-none" to="/offers" style={{
                                    padding: 0,
                                    color: location.pathname === "/offers" ? "#6cc305" : "#fbfcfd"
                                }}>
                                    Nos offres
                                    <span
                                        className="underline"
                                        style={{display: location.pathname === "/offers" ? "block" : "none"}}
                                    ></span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div style={{width: '150px'}}></div>
                    <nav>
                        <ul>
                            <li>
                                <Link className="navbar-text text-decoration-none" to="/menu" style={{
                                    padding: 0,
                                    color: location.pathname === "/menu" ? "#6cc305" : "#fbfcfd"
                                }}>
                                    Menu
                                    <span
                                        className="underline"
                                        style={{display: location.pathname === "/menu" ? "block" : "none"}}
                                    ></span>
                                </Link>
                            </li>
                            <li>
                                <Link className="navbar-text text-decoration-none" to="/contact" style={{
                                    padding: 0,
                                    color: location.pathname === "/contact" ? "#6cc305" : "#fbfcfd"
                                }}>
                                    Contactez-nous
                                    <span
                                        className="underline"
                                        style={{display: location.pathname === "/contact" ? "block" : "none"}}
                                    ></span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>


                <div className="menu">
                    <i className='bx bx-menu' onClick={handleMenuClick}></i>
                </div>
            </div>

            <div style={{
                width: '100%',
                minHeight: '40px',
                display: "flex",
                justifyContent: 'space-around',
                padding: '10px',
                borderBottom: '1px solid #333230FF'
            }}>

                <div className="delivery-contact">
                    <img alt="" src={delivery} style={{width: '60px', height: '40px'}}/>
                    <div>
                        <p style={{margin: 0, color: "white"}}>Pour la livraison, appelez</p>
                        <b style={{margin: 0, color: "#fb0002"}}>{deliveryPhone}</b>
                    </div>
                </div>
                <div style={{width: '150px'}}></div>

                <div className="user">
                    <div>
                        <div className="d-flex align-items-center">
                            <button type="button" onClick={handleSearch} className="search-button">
                                <i className='bx bx-search'></i>
                            </button>

                            {(UserService.getRole() !== "EMPLOYEE" && UserService.getRole() !== "ADMIN") &&
                                <button type="button" className="cart-button">
                                    <Link className="navbar-text text-decoration-none" to="/cart">
                                        <StyledBadge badgeContent={cartItemCount} color="primary">
                                            <i className={cartItemCount > 0 ? 'bx bx-cart bx-tada' : 'bx bx-cart'}></i>
                                        </StyledBadge>
                                    </Link>
                                </button>
                            }


                            {!user &&
                                <div style={{marginTop: '10px'}} className="button-container">
                                    <button type="button" className="signIn">
                                        <Link className="navbar-text text-decoration-none" to="/signIn">Se
                                            connecter</Link>
                                    </button>
                                    <button type="button" className="signUp">
                                        <Link className="navbar-text text-decoration-none m-2"
                                              to="/signUp">S'inscrire</Link>
                                    </button>
                                </div>
                            }
                            {user &&
                                <>
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ml: 2}}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}>
                                        {matches ?
                                            <Avatar sx={{marginTop: '10px'}}
                                                    src={user.image ? 'data:image/png;base64,' + user.image.imageBytes : null}>
                                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                                                {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                                            </Avatar>
                                            :
                                            <Avatar sx={{width: 30, height: 30, marginTop: '10px'}}
                                                    src={user.image ? 'data:image/png;base64,' + user.image.imageBytes : null}>
                                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                                                {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                                            </Avatar>
                                        }
                                    </IconButton>

                                    <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={open}
                                        onClose={handleClose}
                                        onClick={handleClose}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                    >
                                        <MenuItem onClick={handleClose}>
                                            <Link style={{color: '#333230'}}
                                                  className="d-flex align-items-center text-decoration-none"
                                                  to={UserService.getRole() === 'CLIENT' ? '/backOffice/profile'
                                                      : UserService.getRole() === 'ADMIN' ? '/backOffice/dashboard'
                                                          : '/backOffice/orders'}>
                                                <i style={{fontSize: '30px', marginRight: '10px'}}
                                                   className='bx bx-user-circle'></i> Mon compte
                                            </Link>
                                        </MenuItem>
                                        <MenuItem onClick={() => (handleClose(), logOut())}>
                                            <Link to="/" style={{color: '#333230'}}
                                                  className="d-flex align-items-center text-decoration-none">
                                                <i style={{fontSize: '30px', marginRight: '10px'}}
                                                   className='bx bx-log-out'></i> Se déconnecter
                                            </Link>
                                        </MenuItem>
                                    </Menu>
                                </>
                            }
                        </div>
                        <input type="text" className="form-control mt-1"
                               placeholder="Search..." aria-label=""
                               style={{background: '#333230', color: '#ffffff', display: search ? "block" : "none"}}/>

                    </div>

                </div>
            </div>

            <div className="smallNav" style={{display: isNavVisible ? 'flex' : 'none'}}>
                <nav>
                    <ul>
                        <li>
                            <Link onClick={handleMenuClick} className="navbar-text text-decoration-none m-2" to="/"
                                  style={{color: location.pathname === "/" ? "#6cc305" : "#fbfcfd"}}
                            >
                                Acceuil
                            </Link>
                        </li>
                        <div className="divider-smallNav"></div>
                        <li>
                            <Link onClick={handleMenuClick} className="navbar-text text-decoration-none m-2" to="/menu"
                                  style={{color: location.pathname === "/menu" ? "#6cc305" : "#fbfcfd"}}
                            >
                                Menu
                            </Link>
                        </li>
                        <div className="divider-smallNav"></div>

                        {!user ?
                            <>
                                <li>
                                    <Link onClick={handleMenuClick} className="navbar-text text-decoration-none m-2"
                                          to="/signIn"
                                          style={{color: location.pathname === "/signIn" ? "#6cc305" : "#fbfcfd"}}
                                    >
                                        Se connecter
                                    </Link>
                                </li>
                                <div className="divider-smallNav"></div>
                                <li>
                                    <Link onClick={handleMenuClick} className="navbar-text text-decoration-none m-2"
                                          to="/signUp"
                                          style={{color: location.pathname === "/signUp" ? "#6cc305" : "#fbfcfd"}}
                                    >
                                        S'inscrire
                                    </Link>
                                </li>
                            </>
                            :
                            <>
                                <li>
                                    <Link onClick={handleMenuClick}
                                          className="d-flex align-items-center justify-content-center navbar-text text-decoration-none m-2"
                                          to="/backoffice/dashboard"><i style={{fontSize: '30px', marginRight: '10px'}}
                                                                        className='bx bx-user-circle'></i>
                                        Mon compte
                                    </Link>
                                </li>
                                <div className="divider-smallNav"></div>
                                <li>
                                    <Link onClick={() => (handleMenuClick(), logOut())} to='/'
                                          className="d-flex align-items-center justify-content-center navbar-text text-decoration-none m-2">
                                        <i style={{fontSize: '30px', marginRight: '10px'}}
                                           className='bx bx-log-out'></i>
                                        Se déconnecter
                                    </Link>
                                </li>
                            </>
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
        ;
}

export default Header;
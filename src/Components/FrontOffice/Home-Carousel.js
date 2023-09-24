import React, {useEffect, useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../../assets/styles/Carousel.css';
import useMediaQuery from "@mui/material/useMediaQuery";
import CategoryService from "../../Services/CategoryService";
import {Link, useNavigate} from "react-router-dom";
import image1 from "../../assets/Images/1.jpg"
import image2 from "../../assets/Images/2.jpg"
import image3 from "../../assets/Images/3.jpg"
import ConfigService from "../../Services/ConfigService";

export function HomeCarousel() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const matches = useMediaQuery('(min-width:500px)');
    const [size, setSize] = useState('60px')
    const [categories, setCategories] = useState([])


    useEffect(() => {
        if (!matches)
            setSize("20px")
    }, [matches])
    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    useEffect(() => {
        CategoryService.getAllCategories()
            .then(response => setCategories(response.data))
            .catch(error => console.log(error))
    }, []);

    const carouselData = [
        {
            id: 1,
            imageSrc: image1,
        },
        {
            id: 2,
            imageSrc: image2,
        },
        {
            id: 3,
            imageSrc: image3,
        },
    ];

    const renderCarouselItems = () => {
        return carouselData.map((item) => (
            <Carousel.Item key={item.id}>
                <img
                    className="d-block w-100 carousel-image"
                    src={item.imageSrc}
                    alt=""
                />
            </Carousel.Item>
        ));
    };

    const [carouselImages, setCarouselImages] = useState([])
    useEffect(() => {
        ConfigService.getConfig()
            .then(response => setCarouselImages(response.data[0].carouselImages))
            .catch(error => console.log(error))
    }, []);

    const redirectToMenuWithCategory = (categoryName) => {
        navigate(`/menu?category=${categoryName}`);
    };

    return (
        <div className="position-relative">
            <div className="categories">
                <div className="categories-icons">
                    {categories.map(category => {
                            if (category.items.length)
                                return (
                                    <div onClick={() => redirectToMenuWithCategory(category.name)} key={category.id}
                                         className="category-icon">
                                        <img src={'data:image/png;base64,' + category.icon.imageBytes}
                                             style={{height: size, width: size}}/>
                                        <h5 style={{textTransform: 'uppercase'}}>{category.name}</h5>
                                    </div>)
                        }
                    )}
                </div>
                <div className="text-center">
                    <h1>La Magie Des Saveurs Dans Chaque Bouchée!</h1>
                    <button className="menu-button">
                        <Link className="navbar-text text-decoration-none" to="/menu">
                            VOIR NOTRE MENU
                        </Link>
                    </button>
                </div>
            </div>
            <Carousel controls={false} indicators={false} activeIndex={activeIndex} onSelect={handleSelect}>
                {carouselImages.length > 0 ?
                    carouselImages.map(image => (
                        <Carousel.Item key={image.id}>
                            <img
                                className="d-block w-100 carousel-image"
                                src={'data:image/png;base64,' + image.imageBytes}
                                alt=""
                            />
                        </Carousel.Item>
                    ))
                    :
                    renderCarouselItems()
                }
            </Carousel>

        </div>
    );
}

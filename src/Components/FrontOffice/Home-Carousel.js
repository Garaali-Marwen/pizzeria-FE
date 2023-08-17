import React, {useEffect, useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../../assets/styles/Carousel.css';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import useMediaQuery from "@mui/material/useMediaQuery";

export function HomeCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const matches = useMediaQuery('(min-width:500px)');
    const [size, setSize] = useState('50px')
    useEffect(() => {
        if (!matches)
            setSize("20px")
    }, [matches])
    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    const carouselData = [
        {
            id: 1,
            imageSrc: 'https://images2.alphacoders.com/276/276652.jpg',
        },
        {
            id: 2,
            imageSrc: 'https://images3.alphacoders.com/276/276645.jpg',
        },
        {
            id: 3,
            imageSrc: 'https://images7.alphacoders.com/596/596343.jpg',
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

    return (
        <div className="position-relative">
            <div className="categories">
                <div className="categories-icons">
                    <div className="category-icon">
                        <LunchDiningIcon style={{fontSize: size}} />
                        <h5>Burgers</h5>
                    </div>
                    <div className="category-icon">
                        <LocalPizzaIcon style={{fontSize: size}} />
                        <h5>Pizzas</h5>
                    </div>
                    <div className="category-icon">
                        <RestaurantIcon style={{fontSize: size}} />
                        <h5>Dishes</h5>
                    </div>
                    <div className="category-icon">
                        <LocalBarIcon style={{fontSize: size}} />
                        <h5>Drinks</h5>
                    </div>
                </div>
                <div className="text-center">
                    <h1>Order Today, While It's Hot!</h1>
                    <h4>Eat Delicious & Tasty Fast-Food With Real Flavours</h4>
                    <button className="menu-button">VIEW OUR MENU</button>
                </div>
            </div>
            <Carousel controls={false} indicators={false} activeIndex={activeIndex} onSelect={handleSelect}>
                {renderCarouselItems()}
            </Carousel>

        </div>
    );
}

import React from 'react';
import {HomeCarousel} from "./Home-Carousel";
import {ItemsList} from "./Items-list";


export function Home({ updateCartItemCount }) {
    return (
        <div>
            <HomeCarousel />
            <ItemsList updateCartItemCount={updateCartItemCount} />
        </div>
    );
};
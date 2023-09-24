import * as React from 'react';
import notFound from "../../assets/Images/404.svg"
import "../../assets/styles/NotFound.css"

export function NotFound()
{
    return (
        <div className="containerNotFound">
            <img src={notFound} alt="" className="not-found-image"/>
        </div>
    );
};
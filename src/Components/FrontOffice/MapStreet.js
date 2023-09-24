import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FyYWFsaSIsImEiOiJjbGxkYTF3YmkwYWZoM3VxeTNwbXZxNHoyIn0.GnZIqJU9czgOXv0v5QUuog';

export function MapStreet({onUpdateAddress, orders}) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [lng, setLng] = useState(2.349014);
    const [lat, setLat] = useState(48.864716);


    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: onUpdateAddress ? 4 : 8
        });
        if (onUpdateAddress)
            map.current.on('dblclick', (event) => {
                setLng(event.lngLat.lng);
                setLat(event.lngLat.lat);
                if (marker.current) {
                    marker.current.remove();
                }
                marker.current = new mapboxgl.Marker()
                    .setLngLat([event.lngLat.lng, event.lngLat.lat])
                    .addTo(map.current);
                onUpdateAddress({
                    latitude: event.lngLat.lat.toString(),
                    longitude: event.lngLat.lng.toString()
                })
            })
    }, []);

    useEffect(() => {
        if (orders) {
            for (let order of orders) {
                const marker = new mapboxgl.Marker()
                    .setLngLat([order.address.longitude, order.address.latitude])
                    .addTo(map.current);

                const popupContent = `
    <b>Détails de la commande</b>
    ${order.orderItems.map(orderItem => `
        <div key="${orderItem.id}">
            <div style="border-bottom: 1px solid #4b4b4b; margin-bottom: 3px; margin-top: 3px"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; min-width: 150px">
                <div>
                    <img style="border-radius: 50%;" height="30" width="30" src="${orderItem.item.image ? 'data:image/png;base64,' + orderItem.item.image.imageBytes : ''}" alt="" />
                    <b style="text-transform: capitalize;">${orderItem.item.name}</b>
                </div>
                <b>X ${orderItem.quantity}</b>
            </div>
        </div>
    `).join('')}
    <div style="border-bottom: 1px solid #4b4b4b; margin-bottom: 3px; margin-top: 3px"></div>
    <b class="text-danger">Prix: ${order.price} €</b>`;
                const popup = new mapboxgl.Popup({offset: 25})
                    .setHTML(popupContent);
                marker.setPopup(popup);
            }
        }
    }, [orders]);


    return (
        <div ref={mapContainer} className="map-container" style={{height: "100%", width: "100%"}}/>
    );
};
import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FyYWFsaSIsImEiOiJjbGxkYTF3YmkwYWZoM3VxeTNwbXZxNHoyIn0.GnZIqJU9czgOXv0v5QUuog';

export function MapStreet({onUpdateAddress}) {

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
            zoom: 4
        });
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

    return (
        <div ref={mapContainer} className="map-container" style={{height: "200px"}}/>
    );
};
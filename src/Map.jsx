import React from 'react';


// import css
import './Map.css';

// import leaflet components
// in TileLayer, there are some standar things which we can just copy and paste
import { MapContainer, TileLayer, useMap } from 'react-leaflet';


import { showDataOnMap } from './util';

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function Map({ center, zoom, countries, casesType }) {
    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <ChangeView center={center} zoom={zoom} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Loop through all countries and draw circles */}
            {showDataOnMap(countries, casesType)}

            </MapContainer>
        </div>
    )
}

export default Map;

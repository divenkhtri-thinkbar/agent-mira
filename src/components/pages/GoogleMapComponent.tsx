import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

interface GoogleMapComponentProps {
    lat: number;
    lng: number;
}

export default function GoogleMapComponent({ lat, lng }: GoogleMapComponentProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <LoadScript 
            googleMapsApiKey={import.meta.env.VITE_REACT_GOOGLE_MAP_API_KEY}
            // libraries={['marker']}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                    lat,
                    lng
                }}
                zoom={15}
            >
                <Marker
                    position={{
                        lat,
                        lng
                    }}
                />
            </GoogleMap>
        </LoadScript>
    );
} 
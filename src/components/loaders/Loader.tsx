import React from 'react';
import { useLoader } from '../../services/LoaderContext';

const Loader: React.FC = () => {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div className="loader-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default Loader; 
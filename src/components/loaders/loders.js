import React, { useContext } from 'react';
import { LoaderContext } from '../services/LoaderContext';
import './loader.css'; 

const Loader = () => {
    const { loading } = useContext(LoaderContext);

    if (!loading) return null;

    return (
        <div className="loader-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;

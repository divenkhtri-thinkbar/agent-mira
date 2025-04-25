// import { useEffect } from "react";
import React from 'react';
import { LoaderProvider } from '@/services/LoaderContext';
import Loader from '@/components/loaders/Loader';
import ResponsiveRoutes from "./layouts/ResponsiveLayout";
// In your main App component or index file
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <LoaderProvider>
      <Loader />
      <ToastContainer /> 
      <ResponsiveRoutes />
    </LoaderProvider>
  );
};

export default App;
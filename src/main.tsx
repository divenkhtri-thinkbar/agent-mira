import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_REACT_APP_CLIENT_ID || '';

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
          <BrowserRouter>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <App />
            </GoogleOAuthProvider>
          </BrowserRouter>
      </PersistGate>
    </Provider>
);

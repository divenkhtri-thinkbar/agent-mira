import React, { useState, useContext, useRef } from "react";
import Header from "../header/header";
import { LoaderContext } from '../services/LoaderContext';
import Modal from '../utils/Modal';
import { requestForAccessUpdate } from '../services/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const cs_width = "35%";

const UpdateAccess = () => {
    const bottomRef = useRef(null);
    const { showLoader, hideLoader } = useContext(LoaderContext);
    const [showModal, setShowModal] = useState(false);
    const [request, setRequest] = useState(false);
    const navigate = useNavigate();


    const subscribeFullAccess = async () => {
        showLoader();
        try {
            const response = await requestForAccessUpdate();
            if (response.code === 200) {
                setRequest(true);
                checkModal();
                toast.success("Request generated successfully!");
            }
            hideLoader();
        }
        catch (error) {
            hideLoader();
        }
    };

    const checkModal = () => {
        setShowModal((prevState) => !prevState);
    };


    return (
        <>
            <div className="d-flex page border-on flex-column">
                <Header />

                <div className="d-flex justify-content-center" ref={bottomRef}>
                    <div className="scrollable-content mb-5 w-100 flex-justify-center flex-content-center justify-content-center justify-items-center">
                        <div className="container d-flex justify-content-center mt-3">
                            <div className="content mt-5">
                                <div className="message-holder w-80 ml-98 mb-5 mt-5">
                                    <div className="cs-card h-100 position-relative mt-4 p-5 text-center">
                                        <div className="card-header">
                                            <h4>
                                                Unlock the full potential! 
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <h5>
                                                "Subscribe now to access exclusive reports and premium features designed to empower your decisions and enhance your experience. Don't miss out—start your journey today!"
                                            </h5>

                                            <div className="d-flex js-center">
                                                {request && <>
                                                    <div id="go-home" className="button-primary w-20 mt-3 text-center" onClick={()=> navigate('/')}>
                                                        Go to home
                                                    </div>
                                                </>}

                                                {!request && <>
                                                    <div id="go-subscribe" className="button-primary w-20 mt-3 text-center" onClick={subscribeFullAccess}>
                                                        Subscribe
                                                    </div>
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={checkModal} cswidth={cs_width}>
                <div className="mb-2">
                    Your request has been submitted successfully, we will update you shortly.

                    <p>Thank you for your intrest.</p>

                    <div className="d-flex js-center mt-4">
                        <div id="go-home-2" className="button-primary mw-10em" onClick={()=> navigate('/')}>
                            Go to home
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default UpdateAccess;

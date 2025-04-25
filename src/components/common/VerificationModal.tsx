import React, { useState, useEffect } from "react";
import { useLoader } from "../../services/LoaderContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyUser, resendOtp } from "../../services/apiService";

interface VerificationModalProps {
    showVerifyModal: boolean;
    loginEmail: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface Errors {
    otp?: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ 
    showVerifyModal, 
    loginEmail, 
    onClose, 
    onSuccess 
}) => {
    const { showLoader, hideLoader } = useLoader();
    const [showModal, setShowModal] = useState(showVerifyModal);
    const [otp, setOtp] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);

    // Timer Logic
    const startTimer = () => {
        setTimeLeft(30);
        setIsActive(true);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        } 
        else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearTimeout(timer);
    }, [isActive, timeLeft]);

    useEffect(() => {
        setShowModal(showVerifyModal);
    }, [showVerifyModal]);

    const handleModalClose = () => {
        setShowModal(false);
        onClose();
    };

    const returnUser = () => {
        onSuccess();
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Errors = {};

        if (!otp.trim()) {
            newErrors.otp = "Please enter the verification code.";
        } 
        else if (otp.length !== 6) {
            newErrors.otp = "Verification code must be 6 digits.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            showLoader();
            const response = await verifyUser({ "email": btoa(loginEmail)}, btoa(otp));
            if (response.code === 200) {
                hideLoader();
                returnUser();
                handleModalClose();
            }
            else {
                hideLoader();
                toast.error("Invalid Code. Please try again.");
            }
        }
        catch (error) {
            hideLoader();
            toast.error("Invalid Code. Please try again.");
        }
    };

    const otpSend = async () => { 
        try {
            showLoader();
            const response = await resendOtp({ "email": btoa(loginEmail) });
            if (response.code === 200) {
                startTimer();
                toast.success("Verification code sent to your email "+loginEmail);
            }
            else {
                hideLoader();
                toast.error("Error sending code. Please try again.");
            }
        }
        catch (error) {
            hideLoader();
            toast.error("Error sending code. Please try again.");
        }
    }

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-[9990] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9989]" 
                    onClick={handleModalClose}
                />

                {/* Modal panel */}
                <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle z-[9990] relative">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={handleModalClose}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Email Verification
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Verification code has been sent to your registered email address.
                                </p>
                            </div>
                            <form onSubmit={handleOtpSubmit} className="mt-4" autoComplete="off">
                                <div className="mt-4">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                        Enter verification code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value);
                                            setErrors({ ...errors, otp: "" });
                                        }}
                                        className={`mt-1 block w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ease-in-out
                                            ${errors.otp 
                                                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                                                : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            }
                                            placeholder-gray-400 text-gray-900 text-sm
                                            hover:border-gray-400
                                            focus:outline-none focus:shadow-sm`}
                                        placeholder="Enter verification code"
                                        maxLength={6}
                                    />
                                    {errors.otp && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.otp}</p>
                                    )}
                                </div>

                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="mt-4 text-center">
                                    {isActive ? (
                                        <span className="text-sm text-gray-500">
                                            Resend verification code in <strong>{timeLeft} sec.</strong>
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={otpSend}
                                            className="text-sm text-blue-600 hover:text-blue-500"
                                        >
                                            Resend verification code
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;

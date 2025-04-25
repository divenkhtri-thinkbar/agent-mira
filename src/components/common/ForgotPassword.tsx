import React, { useCallback, useEffect, useState } from 'react';
import { useLoader } from '../../services/LoaderContext';
import { toast } from 'react-toastify';
import { forgotPassword, recordotp, resendOtp } from '../../services/apiService';

interface ForgotPasswordProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Errors {
    email?: string;
    loginEmail?: string;
    otp?: string;
}

interface ApiResponse {
    code: number;
    response: {
        message?: string;
    };
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose }) => {
    const { showLoader, hideLoader } = useLoader();

    const [showModal, setShowModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Email Validation
    const validateEmail = useCallback((email: string) => {
        // RFC 5322 compliant email regex
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }, []);

    // OTP Validation
    const validateOtp = useCallback((otpValue: string) => {
        // Check if OTP is numeric and 6 digits
        return /^\d{6}$/.test(otpValue);
    }, []);

    // Timer Logic
    const startTimer = useCallback(() => {
        setTimeLeft(60);
        setIsActive(true);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearTimeout(timer);
    }, [isActive, timeLeft]);

    useEffect(() => {
        setShowModal(isOpen);
        
        // Reset state when modal opens
        if (isOpen) {
            setShowOtpModal(false);
            setLoginEmail("");
            setOtp("");
            setErrors({});
            setIsActive(false);
        }
    }, [isOpen]);

    const handleModalClose = useCallback(() => {
        setShowModal(false);
        setShowOtpModal(false);
        setLoginEmail("");
        setOtp("");
        setErrors({});
        setIsActive(false);
        onClose();
    }, [onClose]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const newErrors: Errors = {};
        const trimmedEmail = loginEmail.trim();

        if (!trimmedEmail) {
            newErrors.loginEmail = "Email address is required.";
        } 
        else if (!validateEmail(trimmedEmail)) {
            newErrors.loginEmail = "Please enter a valid email address.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // API Call
        try {
            setIsSubmitting(true);
            showLoader();
            
            const response = await forgotPassword({ "email": btoa(trimmedEmail) });
            hideLoader();
            
            if (response.code === 200) {
                toast.success("Verification code sent to your email!");
                setShowOtpModal(true);
                startTimer();
            }
        }
        catch (error: any) {
            console.log(error);
            hideLoader();
            console.error("Forgot password error:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const newErrors: Errors = {};
        const trimmedOtp = otp.trim();

        if (!trimmedOtp) {
            newErrors.otp = "Please enter the verification code.";
        } 
        else if (!validateOtp(trimmedOtp)) {
            newErrors.otp = "Verification code must be 6 numeric digits.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // OTP Validation
        try {
            setIsSubmitting(true);
            showLoader();
            
            const response = await recordotp({ "email": btoa(loginEmail)}, btoa(trimmedOtp));
            hideLoader();
            
            if (response.code === 200) {
                toast.success("The password has been sent to your registered email address!");
                handleModalClose();
            }
            else {
                toast.error("Invalid verification code. Please try again.");
            }
        }
        catch (error) {
            hideLoader();
            console.error("OTP verification error:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const otpSend = async () => { 
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            showLoader();
            
            const response = await resendOtp({ "email": btoa(loginEmail) });
            hideLoader();
            
            if (response.code === 200) {
                startTimer();
                toast.success("Verification code sent to your email!");
            }
        }
        catch (error) {
            hideLoader();
            console.error("Resend OTP error:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {!showOtpModal && (<>
                    {/* Background overlay - smooth transparency */}
                    <div 
                        className="fixed inset-0 bg-black/20 transition-all duration-300 ease-in-out" 
                        onClick={handleModalClose}
                    />

                    {/* Modal panel - clean white background */}
                    <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-lg transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                        <div className="absolute top-0 right-0 pt-4 pr-4">
                            <button
                                type="button"
                                className="cursor-pointer rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                onClick={handleModalClose}
                                aria-label="Close"
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
                                    Forgot Password
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Enter your email address and we'll send you instructions to reset your password.
                                    </p>
                                </div>
                                <form onSubmit={handleEmailSubmit} className="mt-4">
                                    <div className="mt-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email address <span className="text-red-500">*</span>
                                        </label>
                                        
                                        <input
                                            type="email"
                                            id="email"
                                            value={loginEmail}
                                            onChange={(e) => {
                                                setLoginEmail(e.target.value);
                                                setErrors({ ...errors, loginEmail: '' });
                                            }}
                                            className={`mt-1 block w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ease-in-out
                                                ${errors.loginEmail 
                                                    ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                                                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                }
                                                placeholder-gray-400 text-gray-900 text-sm
                                                hover:border-gray-400
                                                focus:outline-none focus:shadow-sm`}
                                            placeholder="Enter your email address"
                                            autoComplete="email"
                                            disabled={isSubmitting}
                                            required
                                        />
                                        {errors.loginEmail && (
                                            <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.loginEmail}</p>
                                        )}
                                    </div>

                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            className={`cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Submit'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleModalClose}
                                            className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>)}

                {showOtpModal && (
                    <>
                    {/* Background overlay */}
                    <div 
                        className="fixed inset-0 bg-black/20 transition-all duration-300 ease-in-out" 
                        onClick={handleModalClose}
                    />

                    {/* Modal panel */}
                    <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-lg transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Enter OTP
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                A 6-digit verification code has been sent to {loginEmail}
                            </p>
                            <form onSubmit={handleOtpSubmit} className="mt-4">
                                <div className="mt-4">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                        Verification Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => {
                                            // Only allow numeric input
                                            const value = e.target.value.replace(/\D/g, '');
                                            setOtp(value);
                                            setErrors({ ...errors, otp: '' });
                                        }}
                                        className={`mt-1 block w-full px-4 py-2.5 rounded-lg border 
                                            ${errors.otp 
                                                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                                                : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            } 
                                            text-gray-900 text-sm`}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        disabled={isSubmitting}
                                        required
                                    />
                                    {errors.otp && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.otp}</p>
                                    )}
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className={`cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Verifying...' : 'Verify Code'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>

                            <div className="flex justify-center mt-4">
                                {isActive ? (
                                    <span className="text-sm text-gray-600">
                                        Resend verification code in <strong>{timeLeft} sec.</strong>
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className={`cursor-pointer text-sm text-blue-600 cursor-pointer hover:underline focus:outline-none ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        onClick={otpSend}
                                        disabled={isSubmitting}
                                    >
                                        Resend verification code
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>)}
            </div>
        </div>
    );
};

export default ForgotPassword; 

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { changeUserPassword } from '@/services/apiService';
import { useLoader } from '@/services/LoaderContext';
import { useAuth } from '@/utils/AuthProvider';
import Modal from './Modal';


interface ChangePasswordProps {
    showChangeModal: boolean;
    onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ showChangeModal, onClose }) => {
    const { showLoader, hideLoader } = useLoader();
    const [showModal, setShowModal] = useState(showChangeModal);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setShowModal(showChangeModal);
    }, [showChangeModal]);

    const handleModalClose = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        setShowModal(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        
        if (!oldPassword.trim()) {
            newErrors.oldPassword = "Old password is required!"
        }
        if (!newPassword.trim()) {
            newErrors.newPassword = "New password is required!";
        }
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm password is required!";
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "New password and confirm password does not match!";
        }
        if (newPassword.trim() === oldPassword.trim()) {
            newErrors.confirmPassword = "New password must be different from the current password.";
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            showLoader();
            const response = await changeUserPassword({ 
                "current_password": btoa(oldPassword), 
                "new_password": btoa(newPassword), 
                "confirm_password": btoa(confirmPassword) 
            });
            
            if (response.code === 200) {
                logout();
                toast.success("Your password has been changed. Please log in again.");
                localStorage.clear();
                sessionStorage.clear();
                hideLoader();
                navigate('/login');
            } else {
                hideLoader();
                toast.error("Password must be 7-14 characters long and include at least one uppercase letter, one number, and one special character.");
            }
        } catch (error) {
            hideLoader();
            toast.error("Unable to reset the password. Please try again later.");
        }
    };
    return (
        <Modal 
            open={showModal}
            onClose={handleModalClose}
            className="w-[90%] md:w-[35%] mx-4 md:mx-0 p-6 bg-white"
        >
            <div className="mb-4">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-semibold text-gray-900">Change Password</h4>
                    <button 
                        onClick={handleModalClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-6">
                    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">
                                Enter old password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.oldPassword 
                                    ? "border-red-500 focus:ring-red-500" 
                                    : "border-gray-300 focus:ring-blue-500"
                                } focus:outline-none focus:ring-2`}
                                id="old_password"
                                placeholder="Enter old password.."
                                onChange={(e) => {
                                    setOldPassword(e.target.value);
                                    setErrors({ ...errors, oldPassword: "" });
                                }}
                            />
                            {errors.oldPassword && (
                                <p className="text-red-500 text-sm">{errors.oldPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                Enter new password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.newPassword 
                                    ? "border-red-500 focus:ring-red-500" 
                                    : "border-gray-300 focus:ring-blue-500"
                                } focus:outline-none focus:ring-2`}
                                id="new_password"
                                placeholder="Enter new password.."
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setErrors({ ...errors, newPassword: "" });
                                }}
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm">{errors.newPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                                Confirm new password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.confirmPassword 
                                    ? "border-red-500 focus:ring-red-500" 
                                    : "border-gray-300 focus:ring-blue-500"
                                } focus:outline-none focus:ring-2`}
                                id="confirm_password"
                                placeholder="Confirm new password.."
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrors({ ...errors, confirmPassword: "" });
                                }}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex justify-center mt-6">
                            <button 
                                type="submit" 
                                data-test-id="reset-password-submit" 
                                id="reset-pass" 
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default ChangePassword;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '@/services/apiService';
import { useLoader } from '@/services/LoaderContext';
import { useAuth } from '@/utils/AuthProvider';
import { useDispatch } from 'react-redux';
import { logout } from '@/slices/loginSlice';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { logout: authLogout } = useAuth();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        showLoader();
        try {
            await userLogout();
        } catch (error) {
            hideLoader();
            console.error('Logout failed:', error);
        }
        dispatch(logout());
        authLogout();
        localStorage.clear();
        sessionStorage.clear();
        hideLoader();
        navigate('/login');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className="fixed inset-0 bg-black/20 transition-all duration-300 ease-in-out z-[99998]" 
                    onClick={onClose}
                />

                {/* Modal panel */}
                <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-lg transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle z-[99999] relative">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Confirm Logout
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to logout? This will end your current session.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal; 
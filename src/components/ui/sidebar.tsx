import { Settings, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import textData from "@/config/text.json";
import ImageCard from "../pageComponents/common/sidebar/imageCard";
import { useState, useEffect, useRef } from 'react';
import LogoutModal from '../common/LogoutModal';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserPropertyHistory } from "@/services/apiService";
import { toast } from "react-toastify";
import { loginData } from "@/slices/loginSlice";
import { useSelector } from "react-redux";
import ChangePassword from "../common/ChangePasswordModal";
import { selectPropertyData, selectPropertySidebarListings, setSidebarListings, clearSidebarListings } from "@/slices/propertySlice";
// Define the property type
interface Property {
    id: string;
    title: string;
    image?: string;
    address?: string;
    status?: string;
}

export default function Sidebar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [propertyList, setPropertyList] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);
    const { sidebar } = textData;
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = useSelector(loginData);
    const dispatch = useDispatch();
    const propertyInfo = useSelector(selectPropertyData);
    const sidebarListings = useSelector(selectPropertySidebarListings);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [propertyId, setPropertyId] = useState<any>(propertyInfo?.propertyId || '');

    useEffect(() => {
        if (propertyInfo) {
            setPropertyId(propertyInfo?.propertyId);
        }
    }, [propertyInfo, setPropertyId]);

    useEffect(() => {
        const fetchAccountHistory = async () => {
            if (hasFetched.current) return;         
            
            hasFetched.current = true;
            setIsLoading(true);
            setError(null);
            dispatch(clearSidebarListings());
            
            try {
                const response = await getUserPropertyHistory();
                if (response?.code === 200 && Array.isArray(response.response)) {
                    setPropertyList(response.response);
                    dispatch(setSidebarListings(response.response));
                } 
                else {
                    setError('Failed to fetch property history');
                    toast.error('Failed to fetch property history');
                }
            } catch (error) {
                console.error('Error fetching account history:', error);
                setError('An error occurred while fetching properties');
                toast.error('Failed to load property history');
            } finally {
                setIsLoading(false);
            }
        };

        // Check if sidebarListings has data and location.pathname is not '/'
        if (sidebarListings.length === 0 || location.pathname === '/' || propertyInfo?.propertyId) {
            fetchAccountHistory();
        } 
        else if (sidebarListings.length > 0 && location.pathname !== '/') {
            setPropertyList(sidebarListings);
        }
    }, [sidebarListings, location.pathname, propertyInfo]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const settingsButton = document.querySelector('.settings-button');
            const dropdownMenu = document.querySelector('.settings-dropdown');
            
            // Check if click is outside both the settings button AND the dropdown menu
            if (isSettingsOpen && 
                settingsButton && 
                dropdownMenu && 
                !settingsButton.contains(target) && 
                !dropdownMenu.contains(target)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen]);

  

    return (
        <>
            <div className="fixed top-0 left-0 h-screen w-[280px] flex flex-col border-r-[1px] border-[#BFBFBF] bg-[#E3EEFF] group">
                {/* User Profile Section */}
                <div className="flex items-center justify-between px-4 pt-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>
                                {
                                    userDetails?.firstName && userDetails?.lastName
                                    ? `${atob(userDetails.firstName).trim()} ${atob(userDetails.lastName).trim()}`.charAt(0).toUpperCase()
                                    : userDetails?.nick_name
                                    ? userDetails.nick_name.charAt(0).toUpperCase()
                                    : 'U'
                                }
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-[Geologica] font-medium text-[#797979]">
                            {userDetails?.firstName && userDetails?.lastName
                                ? `${atob(userDetails.firstName).trim()} ${atob(userDetails.lastName).trim()}`
                                : 'User'
                            }
                        </span>
                    </div>
                    <div className="relative">
                        <button 
                            className="cursor-pointer settings-button flex items-center justify-center p-1 rounded-full hover:bg-[#D0E1FF] transition-colors"
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        >
                            <Settings strokeWidth={3} size={20} className="text-[#79ACF8]" />
                        </button>
                        
                        {isSettingsOpen && (
                            <div className="settings-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                <a 
                                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        setIsChangePasswordModalOpen(true);
                                    }}
                                >
                                    {sidebar.changePassword}
                                </a>
                                <button 
                                    className="w-full text-left cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                                    onClick={() => {
                                        setShowLogoutModal(true);
                                    }}
                                >
                                    {sidebar.logout}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Offer Button */}
                <div className="p-4">
                    {location.pathname === '/' && <>
                        <div className="group flex w-full cursor-pointer" onClick={() => navigate('/agent')}>
                            <div className="flex-1 bg-[#1E4DB7] text-[#F6F3EE] rounded-full flex items-center justify-center font-[ClashDisplay-Medium] text-base">
                                {sidebar.buttonText}
                            </div>
                            <div className="bg-[#1E4DB7] text-[#F6F3EE] p-2 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
                                <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
                            </div>
                        </div>
                    </>}
                </div>

                <div className="border-t-[#797979] border-t-[0.5px] opacity-40" />

                {/* Property List Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <h2 className="my-4 text-sm font-[Geologica] font-normal text-[#272727] px-4">
                        {sidebar.headingText}
                    </h2>

                    {/* Dynamic Cards Display */}
                    <div className="space-y-4 flex flex-col items-center w-full px-4">
                        {isLoading ? (
                            <div className="text-center text-gray-500 text-sm">
                                Loading properties...
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 text-sm">
                                {error}
                            </div>
                        ) : propertyList.length > 0 ? (
                            propertyList.map((property: any) => (
                                <ImageCard property={property} key={property.property_id} />
                            ))
                        ) : (
                            <div className="text-center text-gray-500 text-sm">
                                No previous offers found
                            </div>
                        )}
                    </div>
                </div>

                {/* Static Bottom Navigation */}
                <div className="flex border-t border-[#E5E7EB] bg-[#B8D4FF] rounded-t-2xl text-[#272727]">
                    {location.pathname !== '/' && (
                        <div className="cursor-pointer flex-1 p-4 text-center font-[ClashDisplay-Medium] text-base" onClick={() => navigate('/')}>
                            {sidebar.home}
                        </div>
                    )}
                    {location.pathname !== '/faq' && (
                        <div className="cursor-pointer flex-1 p-4 text-center font-[ClashDisplay-Medium] text-base" onClick={() => navigate('/faq')}>
                            {sidebar.faq}
                        </div>
                    )}
                </div>
            </div>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            />

            <ChangePassword
                showChangeModal={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />

        </>
    );
}
import { AuthLayout } from "../../layouts/AuthLayout";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {InputField,Separator,SubmitButton} from "@/components/common";
import { userLogin, userInfo, getPropertyInformation, userSSOLogin } from "@/services/apiService";
import { useAuth } from "../../utils/AuthProvider";
import { useDispatch } from "react-redux";
import { login } from '../../slices/loginSlice';
import { toast } from "react-toastify";
import { setPropertyData, clearPropertyData} from '../../slices/propertySlice';
import { clearOfferInfo, setCmaList } from '../../slices/preferenceSlice';
import { useGoogleLogin } from '@react-oauth/google';
import googleIcon from '@/assets/images/google.svg';
import VerificationModal from '@/components/common/VerificationModal';
import ForgotPassword from '@/components/common/ForgotPassword';
import { useLoader } from "../../services/LoaderContext";

interface UserResponse {
    is_auth?: number;
    token?: string;
    full_access?: boolean;
    isAccessed?: string;
    is_recurring?: boolean;
    lite_access?: boolean;
    nick_name?: string;
    propertyId?: string;
    property_address?: string;
    cma_list?: any;
    images?: string[];
    firstName?: string;
    lastName?: string;
    is_admin?: boolean;
}

interface ApiResponse {
    code: number;
    response: UserResponse;
    data?: {
        message?: string;
    };
}

interface PropertyApiResponse {
    code: number;
    response: {
        property_address?: string;
        cma_list?: {
            subjectProperty?: {
                BedroomsTotal?: number;
                BathroomsTotalDecimal?: number;
                LivingArea?: number;
                ListPrice?: number;
                UnparsedAddress?: string;
            };
        };
        images?: string[];
    };
}

interface GoogleTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export default function Login() {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const { login: authLogin } = useAuth();
    const dispatch = useDispatch();
    const [loginAPIResponse, setLoginAPIResponse] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // Validate Email Function
    const validateEmail = useCallback((email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }, []);

    const fetchPropertyInformation = useCallback(async (infoUserResponse: string) => {
        setIsLoading(true);
        try {
            const mainResponse = (infoUserResponse as any);
            const apiResponse = await getPropertyInformation(mainResponse?.propertyId) as PropertyApiResponse;
            
            if (apiResponse.code === 200 && apiResponse.response) {
                // Clear previous property-related info in Redux store
                dispatch(clearPropertyData());
                dispatch(clearOfferInfo());

                // Get the property data using propertyId as the key
                const propertyData = (apiResponse as any).response[mainResponse?.propertyId];
                
                if (propertyData) {
                    // Prepare the property data with the correct structure
                    const updatedResponse = {
                        ...propertyData,
                        propertyId: mainResponse?.propertyId,
                        UnparsedAddress: propertyData.UnparsedAddress,
                        ListPrice: propertyData.ListPrice || 0,
                        LivingArea: propertyData.LivingArea,
                        BedroomsTotal: propertyData.BedroomsTotal,
                        BathroomsTotalDecimal: propertyData.BathroomsTotalDecimal,
                        image_url: propertyData.image_url
                    };

                    // Store in Redux
                    dispatch(setPropertyData(updatedResponse));

                    // Handle navigation based on isAccessed
                    if (mainResponse.isAccessed && mainResponse.propertyId !== '') {
                        const decodedPath = atob(mainResponse.isAccessed);
                        if (decodedPath === '' || decodedPath.includes('property-info')) {
                            navigate(decodedPath);
                        } 
                        else {
                            navigate(`${decodedPath}${mainResponse.propertyId}`);
                        }
                    }
                    else{
                        navigate(`/`);
                    }

                    // toast.success("Login successful!");
                }
            } 
            else {
                toast.error("Failed to fetch property information");
            }
        } 
        catch (error) {
            console.error("Error in fetchPropertyInformation:", error);
            toast.error("Error fetching property information");
        } 
        finally {
            setIsLoading(false);
        }
    }, [dispatch, navigate]);

    const routeToHomePage = useCallback(async (response: ApiResponse) => {
        try {
            if (!response.response.token) {
                throw new Error("No token received");
            }

            const user_response = { ...response.response };
            // Transform the response to match LoginPayload type
            const loginPayload = {
                token: user_response.token || '',
                is_recurring: user_response.is_recurring || false,
                nick_name: user_response.nick_name || '',
                firstName: user_response.firstName || '',
                lastName: user_response.lastName || '',
                is_admin: user_response.is_admin || false,
                isSaved: false,
                full_access: user_response.full_access || false,
                lite_access: user_response.lite_access || false
            };

            dispatch(login(loginPayload));

            if (user_response.token) {
                authLogin(user_response.token);
                sessionStorage.setItem('token', user_response.token);
            }

            const infoResponse = await userInfo() as ApiResponse;

            if (infoResponse.code === 200 && infoResponse.response) {
                // Merge additional details from infoResponse into user_response
                const updatedUserResponse = {
                    ...user_response,
                    full_access: infoResponse.response.full_access,
                    isAccessed: infoResponse.response.isAccessed,
                    is_recurring: infoResponse.response.is_recurring,
                    lite_access: infoResponse.response.lite_access,
                    nick_name: infoResponse.response.nick_name,
                    propertyId: infoResponse.response.propertyId,
                };

                // Transform the updated response to match LoginPayload type
                const updatedLoginPayload = {
                    token: updatedUserResponse.token || '',
                    is_recurring: updatedUserResponse.is_recurring || false,
                    nick_name: updatedUserResponse.nick_name || '',
                    firstName: updatedUserResponse.firstName || '',
                    lastName: updatedUserResponse.lastName || '',
                    is_admin: updatedUserResponse.is_admin || false,
                    isSaved: false,
                    full_access: updatedUserResponse.full_access || false,
                    lite_access: updatedUserResponse.lite_access || false
                };

                // Dispatch updated user_response
                dispatch(login(updatedLoginPayload));

                // Navigate or fetch additional information based on conditions
                if (!updatedUserResponse.isAccessed || updatedUserResponse.propertyId === '') {
                    // toast.success("Login successful!");
                    navigate(`/`);
                } 
                else {
                    await fetchPropertyInformation((updatedUserResponse as any));
                }
            } 
            else {
                toast.error(infoResponse.data?.message || "Failed to fetch user information");
            }
        } 
        catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    }, [authLogin, dispatch, navigate, fetchPropertyInformation]);

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors: { email?: string; password?: string } = {};
        if (!validateEmail(email)) validationErrors.email = "Please enter a valid email address";
        if (!password) validationErrors.password = "Password is required";

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsLoading(true);
        showLoader();
        try {
            const payload = { username: email, password };
            const response = await userLogin(payload) as ApiResponse;

            if (response.code === 200) {
                if (response.response?.is_auth === 0) {
                    setVerificationEmail(email);
                    setShowVerificationModal(true);
                    setLoginAPIResponse(response);
                } else {
                    await routeToHomePage(response);
                }
            } else {
                setErrors({ email: "Invalid email or password" });
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ email: "An error occurred. Please try again." });
        } finally {
            setIsLoading(false);
            hideLoader();
        }
    };

    const handleGoogleLoginSuccess = async (tokenResponse: GoogleTokenResponse) => {
        try {
            const { access_token } = tokenResponse;
            // Send the token to the backend for verification and user handling
            const response = await userSSOLogin({ "google_token": access_token }) as ApiResponse;
            if (response.code === 200 && response.response) {
                await routeToHomePage(response);
            } else {
                toast.error("Authentication failed. Please try again.");
            }
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Authentication failed. Please try again.");
        }
    };

    // Configure Google Login
    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => toast.error("Google Login Failed"),
    });

    const handleVerificationSuccess = () => {
        setShowVerificationModal(false);
        if (loginAPIResponse) {
            routeToHomePage(loginAPIResponse);
        }
    };

    return (
        <>
            <AuthLayout imageClassName="rounded-tr-[32px]">
                <div className="w-auto h-full bg-[#1354B6] rounded-br-[32px] overflow-hidden">
                    <div className="w-full relative bg-[#E3EEFF] px-6 pr-26 rounded-bl-[32px] border-[#1354B6]">
                        <h1 className="text-[#1354B6] font-[ClashDisplay-Medium] text-5xl leading-tight mx-auto">
                            Let's craft a winning offer together!
                        </h1>
                    </div>
                    {/* Main Form */}
                    <div className="w-full p-6 h-full rounded-tr-2xl bg-[#1354B6]">
                        <div className="max-w-[440px] mx-auto space-y-6 h-full">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-6">
                                    <h2 className="text-white text-[22px] font-[Geologica] font-medium mt-10">
                                        Log in
                                    </h2>
                                    <InputField
                                        label="Email address"
                                        type="email"
                                        placeholder="Enter your e-mail address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors((prev) => ({ ...prev, email: "" }));
                                        }}
                                    />
                                    {errors.email && <div className="text-red-500">{errors.email}</div>}

                                    <InputField
                                        label="Password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrors((prev) => ({ ...prev, password: "" }));
                                        }}
                                    />
                                    {errors.password && <div className="text-red-500">{errors.password}</div>}

                                    <div className="flex justify-between items-start">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="cursor-pointer text-white font-[Geologica] font-normal underline text-base"
                                            disabled={isLoading}
                                        >
                                            Forgot password?
                                        </button>
                                        <SubmitButton
                                            text={isLoading ? "Loading..." : "Submit"}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </form>
                            <Separator />
                            {/* Other Login Options */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => loginWithGoogle()}
                                    className="flex items-center justify-center gap-2 cursor-pointer font-[Geologica] text-[22px] font-normal h-12 bg-white hover:bg-gray-50 hover:text-[#1354B6] text-[#1354B6] rounded-full w-full"
                                >
                                    <img src={googleIcon} alt="Google" className="w-8 h-8" />
                                    Sign in using Google
                                </button>

                                <div className="text-center">
                                    <a className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full font-[Geologica] text-[22px] font-normal h-12 bg-white hover:bg-gray-50 hover:text-[#1354B6] text-[#1354B6] rounded-full">
                                        Don't have an account?
                                        <span className="font-semibold cursor-pointer" onClick={() => navigate('/register')}>Sign up</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>


            <VerificationModal
                showVerifyModal={showVerificationModal}
                loginEmail={verificationEmail}
                onClose={() => setShowVerificationModal(false)}
                onSuccess={handleVerificationSuccess}
            />

            <ForgotPassword
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </>
    );
}

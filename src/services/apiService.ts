import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const platform_url: string = import.meta.env.VITE_REACT_APP_PLATFORM_URL || '';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 120000, // 120 seconds timeout
});

// Request interceptor to add headers or log request details
apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token'); // Get token from sessionStorage
        if (token && config.url !== '/uam/login') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle responses globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error.response || error.message)
);

// Define a TypeScript Interface for API Response
interface ApiResponse {
    code: number;
    response?: {
        is_auth?: number;
    };
}

// Simplified API request function to properly handle both JSON and FormData
const apiRequest = async <T extends ApiResponse | Blob>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    headers?: Record<string, string>,
    data: any = null,
    responseType: 'json' | 'blob' = 'json'
): Promise<T> => {
    try {
        // Prepare headers
        const requestHeaders = { ...headers };
        
        // Only set Content-Type if data is not FormData
        if (data && !(data instanceof FormData)) {
            requestHeaders['Content-Type'] = 'application/json';
        }
        
        const response: AxiosResponse<T> = await apiClient.request({
            method,
            url,
            headers: requestHeaders,
            data, // This will handle both JSON and FormData
            responseType
        });

        if (responseType === 'json') {
            if (response.data && typeof response.data === 'object' && 'code' in response.data) {
                if (response?.data?.code === 401) {
                    toast.error("Session expired, logging out.");
                    handleSessionExpiration();
                }
                else if (response?.data?.code === 400) {
                    toast.error((response as any)?.response?.message);
                }
                else {
                    return response?.data?.code === 200 ? response?.data : response?.data;
                }
            }
            return response.data;
        } 
        else {
            return response.data;
        }
    } 
    catch (error: any) {
        if (error.response?.status === 401 || error?.status === 401) {
            toast.error("Session expired, logging out.");
            handleSessionExpiration();
        }
        else if (error.response?.status === 400 || error?.status === 400 || error?.data?.code === 400) {
            console.log(error);
            toast.error(error.data.message);
        }
        throw error;
    }
};

const handleSessionExpiration = (): void => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login'; // Redirect to login page
};

// API Methods with Proper Types
export const userLogin = (payload: any) => 
    apiRequest<ApiResponse>('post', '/uam/login', undefined, payload);

export const userSSOLogin = (payload: any) => 
    apiRequest<ApiResponse>('post', '/uam/login/google', undefined, payload);

export const userLogout = () => apiRequest<ApiResponse>('post', '/uam/logout', undefined, {});
export const registerNewUser = (payload: any) => apiRequest<ApiResponse>('post', '/uam/signup', undefined, payload);
export const forgotPassword = (payload: any) => apiRequest<ApiResponse>('post', '/uam/forgot-password', undefined, payload);
export const recordotp = (payload: any, query: string) => apiRequest<ApiResponse>('post', `/uam/reset-password/${query}`, undefined, payload);
export const resendOtp = (payload: any) => apiRequest<ApiResponse>('post', '/uam/resend-otp', undefined, payload);
export const changeUserPassword = (payload: any) => apiRequest<ApiResponse>('post', '/uam/change-password', undefined, payload);
export const verifyUser = (payload: any, query: string) => apiRequest<ApiResponse>('post', `/uam/validate-identity/${query}`, undefined, payload);

// Platform URL services
export const userInfo = () => apiRequest<ApiResponse>('get', `${platform_url}/user/info`);
export const searchProperties = (query: any) => apiRequest<ApiResponse>('post', `${platform_url}/property/search`, undefined, query);

export const getPropertyEstimate = (query: string) => apiRequest<ApiResponse>('get', `${platform_url}/property-external/${query}/estimates`);
export const getPropertyFacts = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property-external/fact/${mlsid}`);
export const getUserPrefrencesQNA = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/agent-qna/${mlsid}/user_preferences`);
export const getQuestions = (mlsid: string, page: string) => apiRequest<ApiResponse>('get', `${platform_url}/agent-qna/${mlsid}/${page}`);
export const saveQnaQuestion = (query: any, pageName: string, mlsid: string) => apiRequest<ApiResponse>('post', `${platform_url}/agent-qna/${mlsid}/${pageName}`, undefined, query);
export const getAccountHistory = () => apiRequest<ApiResponse>('post', `${platform_url}/property/account_history`, undefined, {});
export const getUserPropertyHistory = () => apiRequest<ApiResponse>('get', `${platform_url}/property/history/property_visits`);
export const getCmaListOld = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/${mlsid}/cma`);

export const fetchUserHistory = (mlsid: string, page: string) => apiRequest<ApiResponse>('get', `${platform_url}/user/${mlsid}/${page}/history`);
export const fetchMarkedQna = (mlsid: string, page: string) => apiRequest<ApiResponse>('get', `${platform_url}/agent-qna/${mlsid}/marked/${page}`);
export const fetchCurrentQuestion = (mlsid: string, page: string) => apiRequest<ApiResponse>('get', `${platform_url}/agent-qna/${mlsid}/${page}`);
export const sideNavigation = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/agent-qna/qna-ready-status?mlsid=${mlsid}`);

export const getPropertyHome = () => apiRequest<ApiResponse>('get', `${platform_url}/property/page/property_home`);
export const getMapData = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/property-map/${mlsid}`);
export const getPropertyInformation = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/${mlsid}`);
export const getPropertyFeatures = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/features/${mlsid}`);
export const updatePropertyInformation = (payload: any) => apiRequest<ApiResponse>('post', `${platform_url}/property/update/property-information`, undefined, payload);
export const saveChatResponse = (payload: any, mlsid: string) => apiRequest<ApiResponse>('post', `${platform_url}/agent-chat/${mlsid}`, undefined, payload);


// Property Features, Standout features, Inspection damage features
export const getStandoutFeatures = (mlsid: string, page: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/insights/${page}/${mlsid}`);
export const getInspectionDamageFeatures = (mlsid: string, page: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/category/${page}/${mlsid}`);
export const uploadImage = (mlsId: string, page: string, formData: FormData) => apiRequest<ApiResponse>('post', `${platform_url}/property/upload-property/${page}/${mlsId}`, undefined, formData);

export const getMarketAnalysis = (mlsid: string, optionId: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/${mlsid}/market-analysis/${optionId}`);
export const getCmaList = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/${mlsid}/cma-analysis`);
export const removeComparableFromCMA = (mlsid: string, payload: any) => apiRequest<ApiResponse>('put', `${platform_url}/property/${mlsid}/comparable-delete`, undefined, payload);

// Offer Process
export const getOfferPrice = (mlsid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/${mlsid}/offer_price`, undefined);
export const getMatchData = (mlsid: string,) => apiRequest<ApiResponse>('get', `${platform_url}/property/${mlsid}/offer/match`);
export const adjustOfferPrice = (mlsid: string, payload: any) => apiRequest<ApiResponse>('post', `${platform_url}/property/${mlsid}/adjusted_offer_price`, undefined, payload);
export const offerPriceCalculation = (mlsid: string, payload: any) => apiRequest<ApiResponse>('post', `${platform_url}/property/${mlsid}/offer/offer_price_calculation`, undefined, payload);
export const offerPriceReCalculate = (mlsid: string, payload: any) => apiRequest<ApiResponse>('post', `${platform_url}/property/${mlsid}/price_recalculate`, undefined, payload);

// Utility Functions
export const generateOfferReport = (listing_id: string, payload: any) => apiRequest<ApiResponse>('post', `${platform_url}/property/${listing_id}/generate-pdf`, undefined, payload);
export const getStatusOfOfferDownload = (mlsid: string, pid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/status/${mlsid}/${pid}`);
export const downloadOfferReport = (mlsid: string, pid: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/download/${mlsid}/${pid}`, undefined, 'blob');
export const generateCmaReport = (listing_id: string, payload: any) => apiRequest<ApiResponse>('post', `${platform_url}/property/${listing_id}/generate-cma`, undefined, payload);

// Property Condition Input
export const getSavedImagesList = (mlsid: string, page: string) => apiRequest<ApiResponse>('get', `${platform_url}/property/${mlsid}/images-list/${page}`);
export const getSingleImage = (mlsid: string, imageId: string) => apiRequest<Blob>('get', `${platform_url}/property/${mlsid}/images/download/${imageId}`, undefined, null, 'blob');


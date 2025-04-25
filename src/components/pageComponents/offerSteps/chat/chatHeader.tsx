import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from '@/store';

function ChatHeader() {
    const { propertyData } = useSelector((state: RootState) => state.propertySlice);
    const [propertyInfo, setPropertyInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (propertyData) {
            setPropertyInfo(propertyData);
            setIsLoading(false);
        }
    }, [propertyData]);

    return (
        <div className="flex justify-between items-center rounded-b-2xl rounded-t-none px-4 py-6 bg-[#5D9DFE] border-b border-gray-200">
            <span className="font-[ClashDisplay-Medium] text-base leading-[25.12px] text-white ">
                {isLoading
                    ? ''
                    : propertyInfo?.UnparsedAddress?.trim() || 
                      'Please select a property'}
            </span>
            <span className="font-[ClashDisplay-Regular] text-sm text-white">
                {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </span>
        </div>
    );
}

export default ChatHeader;

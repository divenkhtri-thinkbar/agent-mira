import {
    ChevronRight,
    ChevronUp,
    ChevronDown,
    MessageCircle,
} from "lucide-react";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { agent, User } from "@/assets/images";
import { saveChatResponse } from '@/services/apiService';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { 
    addMessage,
    selectChatMessages, 
    ChatMessage
} from '@/slices/chatSlice';
import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

interface UserQueryMessageProps {
    propertyInfo: any;
    currentPage: string;
    chatHistory: any[];
    loadingQuestion: boolean;
}
import { chat } from "@/config/text.json";

// Add this memoized selector outside of the component
const selectMemoizedChatMessages = createSelector(
    [(state: RootState) => state, (_, currentPage: string) => currentPage],
    (state, currentPage) => selectChatMessages(state, currentPage)
);

const UserQueryMessage = ({ propertyInfo, currentPage, chatHistory, loadingQuestion }: UserQueryMessageProps) => {
    const dispatch = useDispatch();
    
    // Replace this line:
    // const messages = useSelector((state: RootState) => selectChatMessages(state, currentPage));
    
    // With this:
    const messages = useSelector((state: RootState) => 
        selectMemoizedChatMessages(state, currentPage)
    );
    
    const [message, setMessage] = useState('');
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isChatInitialized, setIsChatInitialized] = useState<boolean>(false);
    const [isChatExpanded, setIsChatExpanded] = useState<boolean>(false);
    const hasFetched = useRef(false);

    // Handle message input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const scrollToBottom = useCallback(() => {
        const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            setTimeout(() => {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, []);

    useEffect(() => {
        if (chatHistory.length > 0 && !hasFetched.current) {
            chatHistory.forEach(msg => {
                dispatch(addMessage({ page: currentPage, message: msg }));
            });

            setIsChatInitialized(true);
            setIsChatExpanded(false);
            hasFetched.current = true;
        }
    }, [chatHistory, dispatch, currentPage]);

    // Handle sending message
    const handleSend = async () => {
        if (message.trim()) {
            setIsLoading(true);
            scrollToBottom();
            // Create user message
            const userMessage: ChatMessage = { 
                text: message, 
                isUser: true,
                timestamp: new Date().toISOString()
            };
            
            // Add message to Redux store
            dispatch(addMessage({ page: currentPage, message: userMessage }));
            
            // Clear input
            setMessage("");
            
            // Initialize chat if not already
            if (!isChatInitialized) {
                setIsChatInitialized(true);
                setIsChatExpanded(true);
            }

            try {
                const chat_response = await saveChatResponse({ 
                    "user_str": message, 
                    "page": currentPage 
                }, propertyInfo?.propertyId);
    
                if (chat_response.code === 200) {
                    setTimeout(() => {
                        // Create agent response
                        const agentResponse: ChatMessage = {
                            text: (chat_response as any).response.mira_chat_response,
                            isUser: false,
                            timestamp: new Date().toISOString()
                        };
                        scrollToBottom();
                        // Add agent response to Redux store
                        dispatch(addMessage({ page: currentPage, message: agentResponse }));
                    }, 500);
        
                    setIsLoading(false);
                }
                else {
                    setIsLoading(false);
                    toast.error("Failed to get response");
                }
            }
            catch (error) {
                setIsLoading(false);
                toast.error("An error occurred");
                console.error("Chat error:", error);
            }
        }
        else {
            toast.error("Please enter a message");
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    // Toggle chat accordion
    const toggleChatAccordion = () => {
        setIsChatExpanded(!isChatExpanded);
    };

    // Dynamic background color based on message presence for input
    const inputBackgroundColor = message.trim() ? "#B8D4FF" : "white";

    // Auto-scroll chat body to the latest message when expanded
    useEffect(() => {
        if (isChatExpanded && isChatInitialized && chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isChatExpanded, isChatInitialized]);

    return (
        <div className={`flex flex-col w-full pb-5 duration-500 ease-in-out transition-[box-shadow,background-color] ${(isChatInitialized || messages.length > 0) && isChatExpanded
                ? "bg-[#B8D4FF] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]"
                : "bg-transparent shadow-none"
            }`}>
            <div className="relative mb-4 px-1">
                
                {/* Chat body with accordion functionality */}
                    <div className={`relative ${loadingQuestion ? "opacity-20" : "opacity-100"}`}>
                        {messages?.length > 0 && 
                            <button onClick={toggleChatAccordion} className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-full px-5 py-0.5 bg-[#B8D4FF] rounded-full z-10 cursor-pointer hover:bg-[#A0C1FF] transition-colors shadow-[2px_2px_2px_0px_rgba(0,0,0,0.15)]" aria-label="Toggle chat expansion">
                                {isChatExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-[#1354B6]" />
                                ) : (
                                    <ChevronUp className="w-5 h-5 text-[#1354B6]" />
                                )}
                            </button>
                        }
                        
                        {(isChatInitialized || messages.length > 0) && (
                            <div ref={chatBodyRef}
                                className={`
                                    rounded-lg overflow-y-auto transition-all duration-500 ease-in-out chat-body
                                    ${isChatExpanded ? "max-h-[400px] p-4" : "max-h-0 p-0"}
                                    ${isChatExpanded ? "overflow-auto" : "overflow-hidden"}
                                `}
                            >
                                <div className="min-h-0">
                                    {messages.map((msg, index) => (
                                        <div key={index} className="mb-2">
                                            {msg.isUser ? (
                                                <div className="flex flex-row-reverse items-start gap-0">
                                                    <Avatar className="w-10 h-10 p-1 flex items-center justify-center bg-white rounded-full rounded-l-none">
                                                        <AvatarImage
                                                            src={User}
                                                            alt="User"
                                                            className="rounded-full"
                                                        />
                                                        <AvatarFallback>
                                                            <MessageCircle className="w-4 h-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="bg-white rounded-sm p-3 rounded-tr-none text-wrap" dangerouslySetInnerHTML={{ __html: msg.text }} />
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-0">
                                                    <Avatar className="w-10 h-10 p-1 flex items-center justify-center bg-white rounded-full rounded-r-none">
                                                        <AvatarImage
                                                            src={agent}
                                                            alt="Agent Mira"
                                                            className="rounded-full"
                                                        />
                                                        <AvatarFallback>
                                                            <MessageCircle className="w-4 h-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="bg-white rounded-sm p-3 rounded-tl-none text-wrap" dangerouslySetInnerHTML={{ __html: msg.text }} />
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="w-full flex items-center py-4">
                                            <div className="animate-pulse flex space-x-2">
                                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {/* Input field */}
            <div className={`flex justify-center px-14 ${loadingQuestion ? "opacity-20" : "opacity-100"}`}>
                <div className="flex items-center w-full max-w-3xl border rounded-full px-3 py-2 bg-white">
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder={chat.placeholder}
                        className={`flex-1 p-2 rounded-md focus:outline-none transition-colors ${inputBackgroundColor} placeholder:font-[Geologica] placeholder:font-medium placeholder:text-[14px] placeholder:leading-[15px] placeholder:tracking-[0]`}
                        aria-label="Message input"
                        disabled={loadingQuestion}
                    />
                    <button
                        onClick={handleSend}
                        className="text-black p-2 rounded-r-md cursor-pointer"
                        aria-label="Send message"
                        disabled={loadingQuestion}
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserQueryMessage;
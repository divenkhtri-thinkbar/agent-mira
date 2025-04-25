import textData from "@/config/text.json";
import { useLocation } from 'react-router-dom';

export const getCurrentPageName = (pathname: string): string => {
    const routes = textData.routes.pages;
    switch (true) {
        case pathname.includes('agent'):
            return routes.PROPERTY_INFORMATION_PAGE;
        case pathname.includes('comparable'):
            return routes.PROPERTY_COMPARABLE_PAGE;
        case pathname.includes('market'):
            return routes.PROPERTY_MARKET_PAGE;
        case pathname.includes('conditions'):
            return routes.PROPERTY_CONDITION_INPUT;
        case pathname.includes('preference'):
            return routes.PERSONALISED_PAGE;
        case pathname.includes('offer'):
            return routes.PROPERTY_OFFER_PAGE;
        default:
            return ''
    }
};

export const useCurrentPage = () => {
    const location = useLocation();
    return getCurrentPageName(location.pathname);
}; 

// Combines user history and marked API data into one single array
export const DataBinder = (userHistory: any, markedResponse: any, currentPage: string) => {
    let outputdata: any[] = [];
    if (userHistory.length > 0) {
        userHistory.forEach((ques: any) => {
            if (ques?.event?.toLowerCase() === "q") {
                const matchedQuestion = markedResponse[currentPage]?.find((item2: any) => item2.question_id === ques.question);
                
                if (matchedQuestion) {
                    const exists = outputdata.some(item => item.question_id === matchedQuestion.question_id);

                    if (!exists) {
                        const updatedItem = {
                            ...matchedQuestion,
                            showAvatar: matchedQuestion.showAvatar ?? true, // Add only if not already present
                        };
                        outputdata.push(updatedItem);
                    }
                }
            }
        });
        return outputdata;
    } 
    else {

        // Add keys to every object in `markedResponse` if it's an array
        if (Array.isArray(markedResponse[currentPage])) {
            return markedResponse[currentPage].map((item: any) => ({
                ...item,
                showAvatar: item.showAvatar ?? true
            }));
        } 
        
        // Handle `markedResponse` as a single object
        return {
            ...markedResponse[currentPage],
            showAvatar: markedResponse[currentPage].showAvatar ?? true
        };
    }
};

// Combines user history chat data into one single array
export const DataBinderWithChat = (userHistory: any) => {
    let outputdata: any[] = [];
    if (userHistory.length > 0) {
        userHistory.forEach((ques: any) => {
            if (ques?.event?.toLowerCase() === "c") {
                const finalItem = { isUser: ques.actor.toLowerCase() === "u" ? true : false, text: ques.text};
                outputdata.push(finalItem);
            }
        });
        return outputdata;
    }
    else {
        return [];
    }
};

import Layout from "@/layouts/OfferLayout";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearPropertyData, clearPropertyFeatures } from "@/slices/propertySlice";
import { clearCmaList } from "@/slices/preferenceSlice";
import { clearAllQnaQuestions } from "@/slices/qnaSlice";
import { clearAllMessages } from "@/slices/chatSlice";
import { getPropertyHome } from "@/services/apiService";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    lists?: string[];
    title?: string;
    sub_text?: string;
}

const FAQData: FAQItem[] = [
    {
        id: 1,
        question: "What is Agent Mira?",
        answer: "Agent Mira is The World's First Home Buyer Advocate, dedicated solely to helping buyers—not sellers. We use AI-powered insights, data-driven decision-making, and transparent flat-fee pricing to put buyers in control of their home purchase."
    },
    {
        id: 2,
        question: "How is Agent Mira different from traditional real estate agents?",
        answer: "Unlike traditional brokers who work on commission and represent both buyers and sellers, Agent Mira is 100% buyer-focused.",
        lists: [
            "No conflicts of interest – We don't represent sellers, ensuring unbiased advice.",
            "AI-powered insights – Our technology provides real-time data on pricing, market trends, and contract analysis.",
            "Flat-fee pricing – No inflated commissions, just fair and transparent pricing.",
        ]
    },
    {
        id: 3,
        question: "What does it mean to have a 'Home Buyer Advocate'?",
        answer: "A Home Buyer Advocate is fundamentally different from a traditional agent. At Agent Mira, your interests come before anything else—even our own. Unlike traditional brokers who represent both buyers and sellers, we work exclusively for buyers, ensuring there is zero conflict of interest—not just with the seller, but also with the agent's own financial incentives. <br><br> Traditional agents often earn higher commissions when buyers spend more or when they push deals through quickly. With Agent Mira's flat-fee model, our success isn't tied to the price of your home—we succeed only when you succeed. That means every piece of advice we give is based on what's best for you, not what benefits the agent or brokerage. <br><br> Our mission is to be your ultimate advocate—providing unbiased guidance, AI-powered insights, and expert negotiation strategies to secure the best possible home for you. With Agent Mira, you're never pressured into a deal that isn't in your best interest. Instead, we empower you with data, transparency, and true advocacy so that you can buy your home with total confidence."
    },
    {
        id: 4,
        question: "Can I still work with a human advocate at Agent Mira?",
        answer: "Yes! Agent Mira is a hybrid model—you get AI-driven insights for better decision-making, plus a dedicated home-buying advocate who provides expert guidance, negotiates on your behalf, and supports you throughout the entire process."
    },
    {
        id: 5,
        question: "How does Agent Mira's AI technology work?",
        title: "The AI Advantage",
        answer: "Agent Mira's AI uses real-time market data, comparable sales, and predictive analytics to help you:",
        lists: [
            "Find the right home faster with AI-powered search.",
            "Determine the best offer price using our Offer Savant tool (93% accuracy).",
            "Time your purchase perfectly with Market Savant insights.",
            "Evaluate properties smarter using AI-guided home assessments.",
        ]
    },
    {
        id: 6,
        question: "What is Offer Savant, and how does it work?",
        answer: "Offer Savant is Agent Mira's AI-powered pricing tool that analyzes market conditions, historical sales, and comparable properties to predict the right offer price. It helps you avoid overpaying while staying competitive."
    },
    {
        id: 7,
        question: "How does Agent Mira predict home prices?",
        answer: "We use a proprietary AI model that considers:",
        lists: [
            "✅ Recent comparable sales",
            "✅ Neighborhood and school data.",
            "✅ Property features and amenities",
            "✅ Historical pricing trends",
            "✅ Local market conditions",
        ]
    },
    {
        id: 8,
        question: "How does AI improve home showings?",
        answer: "Our AI-Guided Showings provide real-time insights while you tour homes, including:",
        lists: [
            "Smart property scoring based on condition and amenities.",
            "Automated value assessments to see if the price is fair.",
            "Neighborhood insights on safety, schools, and future value trends."
        ]
    },
    {
        id: 9,
        question: "How does Agent Mira help with offer negotiations?",
        title: "Home Buying Process & Advocacy ",
        answer: "Our AI + human Home Buyer Advocates help craft winning offers by:",
        lists: [
            "✅ Analyzing market conditions to determine the strongest offer price",
            "✅ Ensuring competitive yet fair bids so you don't overpay. ",
            "✅ Providing AI-backed recommendations for contingencies and terms."
        ]
    },
    {
        id: 10,
        question: "How does Agent Mira assist with contracts and legal reviews?",
        answer: "Our Contract Management Savant AI helps buyers by: ",
        lists: [
            "Summarizing legal terms in plain language.",
            "Highlighting red flags or conflicting clauses.",
            "Comparing multiple contracts to ensure fair terms."
        ]
    },
    {
        id: 11,
        question: "Will Agent Mira help me throughout the closing process?",
        answer: "Absolutely! Our White-Glove Closing Support ensures a smooth transition from offer to closing by:",
        lists: [
            "✅ Coordinating with lenders, attorneys, and escrow agents.",    
            "✅ Ensuring all documents are correctly reviewed.",
            "✅ Providing expert guidance until you get the keys to your home."
        ]
    },
    {
        id: 12,
        question: "How does the flat-fee pricing model work?",
        title: "Pricing & Transparency",
        answer: "Unlike traditional agents who charge a commission based on home price, we offer a simple, transparent flat fee. This means:",
        lists: [
            "You pay the same fair price no matter what home you buy.",
            "There are no hidden fees or inflated commissions.",
            "Our only goal is to advocate for the best deal for you."    
        ]
    },
    {
        id: 13,
        question: "How much can I save with Agent Mira?",
        answer: "By eliminating commission-based pricing, buyers save thousands while still receiving expert guidance and AI-powered insights.",
        lists: [
            "Transparent flat-fee pricing.",
        ]
    },
    {
        id: 14,
        title:"Locations & Availability",
        question: "What areas does Agent Mira serve?",
        answer: "We are currently live in Miami-Dade County, Florida, with plans to expand nationwide. If you're interested in Agent Mira in your area, contact us at:  <span class='text-blue-500'>📩 mira@agentmira.ai</span>"
    },
    {
        id: 15,
        question: "Is Agent Mira available nationwide?",
        answer: "Not yet, but we will be coming to every city in US soon. Join the waitlist to get early access when we launch in your city. As of now, we are operating in Miami.",
    },
    {
        id: 16,
        title: "Getting Started",
        question: "How do I get started with Agent Mira?",
        answer: "",
        lists: [
            "✅ Sign up on our website to schedule a quick call with our team.",
            "✅ Join a personalized Buyer Consult Workshop, where we craft your Buying Strategy based on your goals, preferences, and market insights.",
            "✅ Sign your Buyer Advocacy Agreement to gain full access to your dedicated Home Buyer Advocate and AI-powered insights.",
            "✅ Find, evaluate, and purchase your dream home with total confidence—free from bias and perfectly suited to your needs."
        ],
        sub_text: "Your Home Buyer Advocate will be with you at every step, ensuring no conflicts of interest, no unnecessary pressure, and no bias—just expert guidance to help you make the smartest home-buying decision."
    },
    {
        id: 17,
        question: "What if I already started working with another agent?",
        answer: "The process is simple and straightforward:",
        lists: [
            "Sign up on our website to schedule a quick call with our team.",   
            "Join a personalized Buyer Consult Workshop, where we craft your Buying Strategy based on your goals, preferences, and market insights.",
            "Sign your Buyer Advocacy Agreement to gain full access to your dedicated Home Buyer Advocate and AI-powered insights.",
            "Find, evaluate, and purchase your dream home with total confidence—free from bias and perfectly suited to your needs."
        ],
        sub_text: ""
    },
    {
        id: 18,
        question: "Our mission is simple: to revolutionize home buying by putting buyers first.",
        title: "Final Thoughts",
        answer: "The process is simple and straightforward:",
        lists: [
            "📌 Have more questions? Contact us at <span class='text-blue-500'>📩 mira@agentmira.ai</span>",   
            "🎯 Ready to experience smarter home buying? ",
            "👉 <a href='https://agentmira.ai' class='text-blue-500' target='_blank'>Join the Movement | See How It Works</a>"
        ],
        sub_text: ""
    }
];


export default function FAQ() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear property data when component mounts
        dispatch(clearAllQnaQuestions());
        dispatch(clearPropertyData());
        dispatch(clearCmaList());
        dispatch(clearAllMessages());
        dispatch(clearPropertyFeatures());
        
        // Make API call once on mount
        getPropertyHome().catch(error => 
            console.error('Error fetching property home data:', error)
        );
    }, []); // Empty dependency array ensures this runs only once on mount

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number): void => {
        setActiveIndex(activeIndex === index ? null : index);
    }
    

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>

                <div className="space-y-4">
                    {FAQData.map((faq, index) => (
                        <>
                            {faq.title && <h2 className="text-2xl font-bold mb-5 mt-5">{faq.title}</h2>}

                            <div key={faq.id} className="border rounded-lg">
                                <button
                                    className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span className="font-medium cursor-pointer">{faq.question}</span>
                                    <span className="transform transition-transform duration-200 cursor-pointer">
                                        {activeIndex === index ? '−' : '+'}
                                    </span>
                                </button>

                                {activeIndex === index && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                                        
                                        {faq.lists && (
                                            <ul className="list-disc pl-6 mt-2 text-gray-600">
                                                {faq.lists.map((item, i) => (
                                                    <li key={i}><div dangerouslySetInnerHTML={{ __html: item }}></div></li>
                                                ))}
                                            </ul>
                                        )}
                                        
                                        {faq.sub_text && (
                                            <p className="mt-3 text-gray-600 italic" dangerouslySetInnerHTML={{ __html: faq.sub_text }}></p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ))}
                </div>
            </div>                   
        </Layout>
    );
}
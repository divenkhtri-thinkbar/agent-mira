import { ArrowRight } from "lucide-react";
import Layout from "../layouts/OfferLayout";
import { logo, agent } from "@/assets/images";
import textData from "@/config/text.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  clearPropertyData,
  clearPropertyFeatures,
} from "@/slices/propertySlice";
import { clearCmaList, clearOfferInfo } from "@/slices/preferenceSlice";
import { clearAllQnaQuestions } from "@/slices/qnaSlice";
import { clearAllMessages } from "@/slices/chatSlice";
import { getPropertyHome } from "@/services/apiService";
interface HomeProps {
  onButtonRef?: (element: HTMLAnchorElement | null) => void;
}

export default function Home({ onButtonRef }: HomeProps) {
  const { homepage } = textData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear property data when component mounts
    dispatch(clearAllQnaQuestions());
    dispatch(clearPropertyData());
    dispatch(clearCmaList());
    dispatch(clearAllMessages());
    dispatch(clearPropertyFeatures());
    dispatch(clearOfferInfo());

    // Make API call once on mount
    getPropertyHome().catch((error) =>
      console.error("Error fetching property home data:", error)
    );
  }, []); // Empty dependency array ensures this runs only once on mount

  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (buttonRef.current && onButtonRef) {
      onButtonRef(buttonRef.current);
    }
  }, [onButtonRef]);

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen">
        {/* Main Container */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Welcome Section */}
          <div className="w-full max-w-7xl flex flex-col md:flex-row items-center md:items-start xl:items-stretch justify-between  relative gap-6 md:gap-4 xl:gap-0">
            {/* Welcome Text */}
            <div className="space-y-2 bg-[#1E4DB7] rounded-[30px] rounded-tr-none p-8 sm:p-10 md:p-12 lg:p-14 relative w-full md:w-auto md:max-w-[55%] lg:max-w-3xl z-10 md:my-6 lg:my-6 self-start">
              <div className="absolute -top-0 -right-12 sm:-right-16 md:-right-20 bg-[#1E4DB7] p-3 sm:p-4 md:p-5 px-6 sm:px-7 md:px-8 h-auto w-auto rounded-tr-[36px] rounded-br-[36px] z-10">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-12 sm:h-14 md:h-16 lg:h-[68px] w-8 sm:w-10 md:w-11 lg:w-[46px]"
                />
              </div>
              <h1
                className="font-[ClashDisplay-Regular] text-left text-white 
               md:text-[clamp(32px,5vw,72px)] 
               lg:text-[clamp(36px,5vw,84px)] 
               xl:text-[clamp(40px,5vw,90px)] 
               2xl:text-[clamp(48px,6vw,96px)]"
              >
                {homepage.welcomeTitle}
                <br />
                <span className="font-[ClashDisplay-Medium]">
                  {homepage.brandName}
                </span>
              </h1>
              <p className="font-[ClashDisplay-Medium] text-[clamp(16px,2.5vw,36px)] md:text-[clamp(18px,3vw,25px)] lg:text-[clamp(20px,3vw,28px)] xl:text-[clamp(20px,3vw,32px)] 2xl:text-[clamp(24px,3vw,36px)] leading-tight text-white">
                {homepage.tagline.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            {/* Agent Image */}
            <img
              src={agent}
              alt="Professional"
              className="h-auto w-full max-w-[80%] md:max-w-[40%] md:min-w-[30%] md:h-[400px] lg:h-[500px] xl:h-[600px] object-contain mt-8 xl:-mb-10 md:mt-0 xl:mt-0 xl:self-end relative z-0"
            />
          </div>

          {/* Button and Description Section */}
          <div className="w-full max-w-7xl flex flex-col items-center mt-[-20px] xl:mt-0 relative z-0">
            <a
              ref={buttonRef}
              onClick={() => navigate("/agent")}
              className="cursor-pointer group flex w-full h-14 sm:h-16 md:h-18 lg:h-20"
            >
              <div className="flex-1 bg-[#4ADAA8] text-[#1E4DB7] font-[ClashDisplay-Medium] text-lg sm:text-xl md:text-2xl lg:text-[30px] xl:text-[35px] 2xl:text-[38px] leading-tight text-center flex items-center justify-center rounded-full">
                {homepage.buttonText}
              </div>
              <div className="h-14 sm:h-16 xl:h-17 2xl:h-20 w-14 sm:w-16 xl:w-17 2xl:w-20 flex items-center justify-center bg-[#4ADAA8] text-[#1E4DB7] rounded-full transition-transform group-hover:translate-x-2">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </a>

            {/* Description Box */}
            <div className="mt-6 w-full rounded-[12px] border-[1px] border-[#1354B6] xl:py-8 2xl:py-12 px-10">
              <p className="text-center font-[Geologica] font-light text-lg sm:text-lg md:text-lg lg:text-xl xl:text-[25px] 2xl:text-[28px] text-[#1E4DB7]">
                {homepage.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

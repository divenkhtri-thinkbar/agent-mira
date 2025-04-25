import { google } from "@/assets/images";
import { Button } from "../ui/button";

const GoogleButton = ({ width = "w-auto" }) => {
  return (
    <Button
      variant="outline"
      className={`cursor-pointer font-[Geologica] text-[22px] font-normal h-12 bg-white hover:bg-gray-50 hover:text-[#1354B6] text-[#1354B6] gap-2 rounded-full ${width}`}
    >
      <img src={google} alt="Google" className="w-8 h-8" />
      Sign in using Google
    </Button>
  );
};

export default GoogleButton;

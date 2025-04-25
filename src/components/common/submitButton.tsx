import { Button } from "../ui/button";

const SubmitButton = ({ text }: { text: string }) => {
  return (
    <Button
      type="submit"
      className="bg-[#40E6B4] hover:bg-[#3ad1a3] font-[ClashDisplay-Medium] text-2xl text-[#1354B6] px-8 rounded-full h-12"
    >
      {text}
    </Button>
  );
};

export default SubmitButton;

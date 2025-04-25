import { Button } from "../ui/button";

interface SubmitButtonProps {
    text: string;
    disabled?: boolean;
}

const SubmitButton = ({ text, disabled = false }: SubmitButtonProps) => {
    return (
        <Button
            type="submit"
            disabled={disabled}
            className={`bg-[#40E6B4] hover:bg-[#3ad1a3] font-[ClashDisplay-Medium] text-2xl text-[#1354B6] px-8 cursor-pointer rounded-full h-12
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {text}
        </Button>
    );
};

export default SubmitButton;

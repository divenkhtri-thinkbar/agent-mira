import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageExpandViewProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onIndexChange: (index: number) => void;
}

export function ImageExpandView({
    images,
    currentIndex,
    onClose,
    onIndexChange
}: ImageExpandViewProps) {
    const [direction, setDirection] = useState<"left" | "right" | null>(null);

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        setDirection("right");
        onIndexChange((currentIndex + 1) % images.length);
        setTimeout(() => setDirection(null), 500);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setDirection("left");
        onIndexChange((currentIndex - 1 + images.length) % images.length);
        setTimeout(() => setDirection(null), 500);
    };

    // Handle Escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-transparent/50 z-50 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] overflow-hidden">
                <div className="relative h-full w-full">
                    <img
                        src={images[currentIndex] || "/placeholder.svg"}
                        alt={`Expanded image ${currentIndex + 1}`}
                        className={cn(
                            "w-full h-full object-contain transition-all",
                            direction === "left" && "animate-slide-in-from-right",
                            direction === "right" && "animate-slide-in-from-left",
                            !direction && "translate-x-0"
                        )}
                    />
                    
                    {/* Navigation Arrows */}
                    {images.length > 0 && <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevious}
                            className="cursor-pointer absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
                            disabled={images.length <= 1}
                        >
                            <ArrowLeft className="w-6 h-6 text-black" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            className="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
                            disabled={images.length <= 1}
                        >
                            <ArrowRight className="w-6 h-6 text-black" />
                        </Button>
                    </>}
                </div>
                
                <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white/100 hover:text-white"
                    onClick={onClose}
                >
                    <Expand className="h-6 w-6 rotate-45" />
                </Button>
            </div>
        </div>
    );
} 
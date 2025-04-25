import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    cutPrice,
    onValueChange,
    evenlyDistributed = false,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
    cutPrice?: number[]
    evenlyDistributed?: boolean
}) {
    // If cutPrice is provided, use its values for min and max
    const effectiveMin = cutPrice ? Math.min(...cutPrice) : min;
    const effectiveMax = cutPrice ? Math.max(...cutPrice) : max;

    // Map values for evenly distributed mode
    const mapIndexToValue = React.useCallback((index: number): number => {
        if (!cutPrice || !evenlyDistributed) return 0;
        return cutPrice[index];
    }, [cutPrice, evenlyDistributed]);

    const mapValueToIndex = React.useCallback((val: number): number => {
        if (!cutPrice || !evenlyDistributed) return 0;

        // Find the closest value in cutPrice array
        const index = cutPrice.findIndex((price, i) => {
            if (price === val) return true;
            if (i === cutPrice.length - 1) return false;
            return val > price && val < cutPrice[i + 1];
        });

        if (index === -1) {
            // Value is outside range, snap to nearest end
            return val <= cutPrice[0] ? 0 : cutPrice.length - 1;
        }

        // Check if we should snap to this index or the next one
        if (index < cutPrice.length - 1) {
            const distToLower = Math.abs(val - cutPrice[index]);
            const distToUpper = Math.abs(val - cutPrice[index + 1]);
            return distToLower <= distToUpper ? index : index + 1;
        }

        return index;
    }, [cutPrice, evenlyDistributed]);

    // Handle the case where the component can be controlled or uncontrolled
    const isControlled = value !== undefined;

    // Function to find closest value in cutPrice array
    const findClosestValue = React.useCallback((val: number, values: number[]): number => {
        return values.reduce((prev, curr) =>
            Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev, values[0]
        );
    }, []);

    // For evenly distributed mode
    const getEffectiveValue = React.useCallback((rawValues: number[]): number[] => {
        if (!cutPrice || !evenlyDistributed) return rawValues;

        // For evenly distributed mode, we're using index values internally
        // so we need to map these back to real cutPrice values
        return rawValues.map(val => {
            const normalizedVal = (val - min) / (max - min) * (cutPrice.length - 1);
            const lowerIndex = Math.floor(normalizedVal);
            const upperIndex = Math.ceil(normalizedVal);

            if (lowerIndex === upperIndex) return cutPrice[lowerIndex];

            const ratio = normalizedVal - lowerIndex;
            // Use the closest of the two points
            return ratio < 0.5 ? cutPrice[lowerIndex] : cutPrice[upperIndex];
        });
    }, [cutPrice, evenlyDistributed, min, max]);

    // For converting real values to "index space" in evenly distributed mode
    const getNormalizedValue = React.useCallback((realValues: number[]): number[] => {
        if (!cutPrice || !evenlyDistributed) return realValues;

        return realValues.map(val => {
            const closestValue = findClosestValue(val, cutPrice);
            const index = cutPrice.indexOf(closestValue);
            // Map index to 0-100 range for the slider
            return min + (index / (cutPrice.length - 1)) * (max - min);
        });
    }, [cutPrice, evenlyDistributed, findClosestValue, min, max]);

    // Convert initial values to cutPrice values if needed
    const getInitialValues = React.useCallback(() => {
        const initialValues = isControlled
            ? (Array.isArray(value) ? value : [effectiveMin])
            : (Array.isArray(defaultValue) ? defaultValue : [effectiveMin]);

        if (!cutPrice) return initialValues;
        return initialValues.map(val => findClosestValue(val, cutPrice));
    }, [cutPrice, value, defaultValue, effectiveMin, isControlled, findClosestValue]);

    // State for internal value tracking (for uncontrolled component)
    const [internalValue, setInternalValue] = React.useState<number[]>(getInitialValues);

    // Update internal value when controlled value changes
    React.useEffect(() => {
        if (isControlled) {
            const newValues = Array.isArray(value) ? value : [effectiveMin];
            if (cutPrice) {
                setInternalValue(newValues.map(val => findClosestValue(val, cutPrice)));
            } else {
                setInternalValue(newValues);
            }
        }
    }, [value, cutPrice, effectiveMin, isControlled, findClosestValue]);

    // Handle value changes
    const handleValueChange = React.useCallback((newValues: number[]) => {
        if (!cutPrice) {
            // Normal behavior without cutPrice
            if (!isControlled) {
                setInternalValue(newValues);
            }
            onValueChange?.(newValues);
            return;
        }

        // Get the actual values if using evenly distributed mode
        const actualValues = evenlyDistributed
            ? getEffectiveValue(newValues)
            : newValues.map(val => findClosestValue(val, cutPrice));

        if (!isControlled) {
            setInternalValue(actualValues);
        }

        // Only call onValueChange if values actually changed
        if (JSON.stringify(actualValues) !== JSON.stringify(internalValue)) {
            onValueChange?.(actualValues);
        }
    }, [cutPrice, isControlled, onValueChange, internalValue, findClosestValue, evenlyDistributed, getEffectiveValue]);

    // Determine which values to use for rendering
    const rawDisplayValues = isControlled
        ? (Array.isArray(value) ? value : [effectiveMin])
        : internalValue;

    // For evenly distributed mode, we need to convert the actual values to index-based positions
    const displayValues = evenlyDistributed && cutPrice
        ? getNormalizedValue(rawDisplayValues)
        : rawDisplayValues;

    return (
        <div className="relative w-full">
            <SliderPrimitive.Root
                data-slot="slider"
                value={displayValues}
                defaultValue={!isControlled ? defaultValue : undefined}
                min={evenlyDistributed ? min : effectiveMin}
                max={evenlyDistributed ? max : effectiveMax}
                step={evenlyDistributed ? (max - min) / ((cutPrice?.length || 2) * 10) : undefined}
                onValueChange={handleValueChange}
                className={cn(
                    "z-100 relative flex w-full touch-none items-center select-none py-4 cursor-pointer data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
                    className
                )}
                {...props}
            >
                {/* Step markers positioned on top of track */}
                {cutPrice && (
                    <div className="absolute w-full top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        {cutPrice.map((price, idx) => {
                            const position = evenlyDistributed
                                ? (idx / (cutPrice.length - 1)) * 100
                                : ((price - effectiveMin) / (effectiveMax - effectiveMin)) * 100;

                            return idx !== 0 && idx !== (cutPrice.length - 1) ? (
                                <div 
                                    key={`step-${idx}`}
                                    className="absolute w-1 h-3 bg-zinc-300 -translate-x-1/2"
                                    style={{ left: `${position}%`, top: '-6px' }}
                                />
                            ) : null;
                        })}
                    </div>
                )}
                
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className={cn(
                        "bg-[#D8E7FF] relative grow overflow-hidden rounded-full h-4 cursor-pointer data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4 dark:bg-zinc-800"
                    )}
                >
                    <SliderPrimitive.Range
                        data-slot="slider-range"
                        className={cn(
                            "bg-transparent absolute inset-0 h-full cursor-pointer data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                        )}
                    />
                </SliderPrimitive.Track>
                {Array.from({ length: displayValues.length }, (_, index) => (
                    <SliderPrimitive.Thumb
                        data-slot="slider-thumb"
                        key={index}
                        className="p-2 bg-[#0036AB] block size-4 shrink-0 rounded-full border-0 outline-none ring-0 shadow-none transition-[color,box-shadow] hover:ring-2 focus-visible:ring-2 focus-visible:outline-none cursor-grab active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50 dark:bg-[#0036AB]"
                    />
                ))}
            </SliderPrimitive.Root>
        </div>
    )
}

export { Slider }

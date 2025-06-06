import { Card, CardContent } from "@/components/ui/card";
import { house, map } from "@/assets/images";
import PropertyViewSkeleton from "@/components/animations/skeletonLoading/PropertyViewSkeleton";

interface PropertyViewProps {
  address: string;
  isLoading?: boolean;
}

function PropertyView({ address, isLoading = true }: PropertyViewProps) {
  // if (isLoading) {
  //   return <PropertyViewSkeleton />;
  // }

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl px-4 min-h-[100vh] items-center justify-center mx-auto">
      <div className="bg-[#B8D4FF] p-4 rounded-[25px] flex flex-col items-center w-full">
        <Card className="w-full">
          <CardContent className="p-0 overflow-hidden">
            <img
              src={house}
              alt="Property"
              className="w-full h-auto max-h-[60vh] object-contain rounded-3xl"
            />
            <div className="px-4 my-4 flex items-center justify-center text-[#1354B6] gap-2 font-[Geologica] font-light text-base text-center">
              <h3>Property Address:</h3>
              <p>{address}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-0 overflow-hidden">
            <img
              src={map}
              alt="Property location map"
              className="w-full h-auto max-h-[50vh] object-contain rounded-3xl"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PropertyView;
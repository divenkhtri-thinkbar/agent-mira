import { Card, CardContent } from "@/components/ui/card";
import { house } from "@/assets/images";
import CircularLoading from "../circularLoading";
import textData from "@/config/text.json";

function PropertyViewSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full px-4 h-[90vh] items-center justify-center">
      <div className="rounded-[25px] relative overflow-hidden">
        <Card className="">
          <CardContent className="p-0 bg">
            <img
              src={house}
              alt="Property"
              className="w-full h-[383px] object-contain rounded-3xl opacity-50"
            />
            <div className="px-4 flex items-center justify-center gap-2 h-8" />
          </CardContent>
        </Card>

        {/* Second Card */}
        <Card className="bg-black/10 animate-pulse">
          <CardContent className="p-0">
            <div className="h-[260px] w-full" />
          </CardContent>
        </Card>

        {/* Loading section */}
        <CircularLoading message={textData.step1Content.propertyViewLoadingMessage} />
      </div>
    </div>
  );
}

export default PropertyViewSkeleton;
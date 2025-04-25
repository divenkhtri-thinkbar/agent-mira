import CircularLoading from "../circularLoading";
import textData from '@/config/text.json'

export function FinalOfferStaggerCardSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] mb-4 text-center">
        Presenting the Recommended Offer
      </h1>

      <div className="overflow-visible bg-[#F4F4F4] relative">
        <div className="p-2 grid grid-cols-2 gap-2 items-start">
          <div className="relative overflow-visible bg-[#E9E9E9] rounded-[25px]">
            <div className="w-full h-[255px]" />
          </div>
          <div className="space-y-2 flex flex-col justify-start bg-[#E9E9E9] rounded-[25px]">
            <div className="w-full h-[255px]" />
          </div>
        </div>

        <div className="p-2 relative">
          <div className="relative bg-[#E9E9E9] w-full h-[200px] rounded-[25px]" />
        </div>

        <div className="px-2 py-2">
          <div className="grid grid-cols-2 gap-2"> 
            <div className="bg-[#E9E9E9] w-full h-[200px] rounded-[25px]" />
            <div className="bg-[#E9E9E9] w-full h-[200px] rounded-[25px]" />
          </div>
        </div>

        <div className="mt-2 bg-[#E9E9E9] w-full h-[50px] rounded-[25px]" />

        {/* Loading Component */}
        <CircularLoading 
          message={textData.step6Content.recommendedOfferLoadingMessage}
        />
      </div>
    </div>
  );
}
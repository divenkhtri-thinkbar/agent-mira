import { cn } from "@/lib/utils"


const BadgeButton = ({id,label,bgColor}) => {
    return (
      <div className={cn("py-4 px-6 rounded-full mb-1",bgColor)}>
        <div className="flex justify-between font-[Geologica] text-[12px] text-white items-center">
        <p className="bg-[#468FFE] h-6 w-6 rounded-full flex justify-center items-center">{id}</p>
        <p className="text-right">{label}</p>
        </div>
      </div>
    )
  }
  
  export default BadgeButton
  
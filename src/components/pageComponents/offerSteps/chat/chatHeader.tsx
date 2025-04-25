interface ChatHeaderProps {
  headerAddress?: string;
}

function ChatHeader({ headerAddress }: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center rounded-b-2xl rounded-t-none px-4 py-6 bg-[#5D9DFE] border-b border-gray-200">
      {/* Dynamic property address */}
      <span className="font-[ClashDisplay-Medium] text-base leading-[25.12px] text-white">
        {headerAddress}
      </span>
      <span className="font-[ClashDisplay-Regular] text-sm text-white">
        March 24, 2025
      </span>
    </div>
  );
}

export default ChatHeader;
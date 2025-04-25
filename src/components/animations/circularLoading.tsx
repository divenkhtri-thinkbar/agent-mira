interface CircularLoadingProps {
  message?: string;
}
function CircularLoading({ message }: CircularLoadingProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-8 border-black/5 bg-[#F4F4F4] rounded-full" />
        <div className="absolute inset-0 border-8 border-transparent border-t-green-500 rounded-full animate-spin" />
      </div>

      {/* Animated Text Below Loader */}
      <p className="text-[#343434] font-[ClashDisplay-Medium] text-base text-center max-w-[290px]">
        {message}
      </p>
    </div>
  );
}

export default CircularLoading;

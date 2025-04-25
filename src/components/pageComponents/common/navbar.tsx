const Navbar = () => {
  return (
    <nav className="flex justify-center items-center w-full">
      <div className="flex w-full max-w-7xl overflow-hidden  bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600">
        <div className="flex w-full">
          <div className="flex-1 px-4 py-2 rounded-r-full text-center text-white font-medium bg-[#468FFE]">
            Verifying Property Information
          </div>
          <div className="flex-1 px-4 py-2 rounded-r-full text-center text-white opacity-20 font-medium bg-[#468FFE]">
            Presenting Comparable Properties
          </div>
          <div className="flex-1 px-4 py-2 rounded-r-full text-center text-white font-medium bg-[#2F7CF2]">
            Analyzing Market Conditions
          </div>
          <div className="flex-1 px-4 py-2 rounded-r-full text-center text-white font-medium bg-blue-400">
            Property Condition Input
          </div>
          <div className="flex-1 px-4 py-2 rounded-r-full text-center text-white font-medium bg-blue-500">
            Personalizing The Offer
          </div>
          <div className="flex-1 px-4 py-2 rounded-r-full text-center text-white font-medium bg-blue-600">
            The Recommended Offer
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react'

const imageBoxMobile = ({src,title}) => {
  return (
    <div className={`bg-white p-4 rounded-[20px] mb-4 mt-[60px]`}>
      <img src={src} alt="" className={`w-full`}/>
      <p className={`font-[Geologica] text-[10px] text-center mt-2 font-regular`}>{title}</p>
    </div>
  )
}

export default imageBoxMobile

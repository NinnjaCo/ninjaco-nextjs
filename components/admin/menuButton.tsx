import Image from 'next/image'
import React from 'react'
const MenuButton: React.FC<{
  text: string
  icon: any
}> = ({ text, icon }) => {
  return (
    <div key={text} className="flex gap-3 hover:bg-brand-500 py-2 rounded">
      <Image src={icon} alt="image" />
      <button className="text-brand-300 font-semibold text-xs lg:text-sm">{text}</button>
    </div>
  )
}
export default MenuButton

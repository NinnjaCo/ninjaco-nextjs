import React from 'react'
import clsx from 'clsx'

const Chip = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div
      className={clsx(
        'flex gap-2 items-center justify-center bg-brand-100 rounded-2xl px-4 py-1',
        className
      )}
    >
      <p className="text-sm">{text}</p>
    </div>
  )
}

export default Chip

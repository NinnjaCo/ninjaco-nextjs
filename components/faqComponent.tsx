import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import React from 'react'
import clsx from 'clsx'

const FAQComponent: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className=" mt-4 peer-open://#endregion">
      <button
        className={clsx(
          'hover:shadow-xl w-3/4 mx-14 py-2 text-left bg-brand-100 rounded-lg ',
          isOpen && 'border-b-2 border-t-2 border-b-brand-400 border-t-brand-400',
          !isOpen && 'border-b-2 border-b-brand-300'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="text-base md:text-lg lg:text-xl ml-3 text-brand font-medium">
              {question}
            </div>
            <ChevronDownIcon
              className={clsx(
                'w-5 h-5 mr-3 text-brand transform transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </div>
          <div
            className={clsx(
              'ml-3 text-brand-400 text-sm md:text-base lg:text-lg font-medium ',
              isOpen && 'block',
              !isOpen && 'hidden'
            )}
          >
            {answer}
          </div>
        </div>
      </button>
    </div>
  )
}

export default FAQComponent

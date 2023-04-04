import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import clsx from 'clsx'

const FAQComponent: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="mt-4 peer-open://#endregion">
      <button
        className=" ml-14 flex justify-between w-3/4 px-4 py-2 text-left bg-brand-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-brand-700">{question}</span>
        <ChevronDownIcon
          className={clsx(
            'w-5 h-5 text-brand-700 transform transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={clsx(
          'w-3/4 pl-14 px-4 py-2 text-brand-700 transition-all duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {answer}
      </div>
    </div>
  )
}

export default FAQComponent

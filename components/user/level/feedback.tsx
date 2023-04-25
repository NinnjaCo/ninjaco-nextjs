import { useState } from 'react'

type FeedbackDialogProps = React.ComponentPropsWithRef<'div'> & {
  title: string
  open: boolean
  close: () => void
  submit: (rating: number, message: string) => void
  backButtonText?: string
  submitButtonText?: string
  className?: string
}

const StarRating = ({ rating, handleRating }) => {
  const stars = [...Array(5)].map((_, i) => {
    // when the first start is clicked, set rating to 0
    const starValue = i + 1
    const starClass = rating >= starValue ? 'text-yellow-400' : 'text-brand-400'
    return (
      <svg
        key={i}
        className={`w-6 h-6 ${starClass}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        onClick={() => handleRating(starValue)}
      >
        <path d="M12 2L15.09 8.24L22 9.27L17 14.18L18.18 21L12 17.77L5.82 21L7 14.18L2 9.27L8.91 8.24L12 2Z" />
      </svg>
    )
  })

  return <div className="flex items-center">{stars}</div>
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  title,
  open,
  close,
  submit,
  backButtonText = 'Cancel',
  submitButtonText = 'Submit',
  className,
}: FeedbackDialogProps) => {
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const handleRating = (rating: number) => {
    setRating(rating)
  }
  const handleMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }
  const handleCancel = () => {
    close()
  }
  const handleSubmit = () => {
    close()
    submit(rating, message)
  }

  return open ? (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <div
          className={`bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-brand-300 px-4 py-3">
            <h3 className="text-xl font-medium text-brand-700" id="modal-headline">
              {title}
            </h3>
          </div>
          <div className="bg-brand-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <label className="leading-loose text-brand-700 text-lg">Rating</label>
                <StarRating rating={rating} handleRating={handleRating} />
              </div>
              <div className="flex flex-col mt-4">
                <label className="leading-loose text-brand-700 text-lg">Message</label>
                <textarea
                  className="h-24 py-2 px-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                  onChange={handleMessage}
                  value={message}
                />
              </div>
            </div>
          </div>
          <div className="bg-brand-300 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-5">
            <button
              className="bg-red-400 rounded-lg py-1 px-2 text-lg text-brand-900 font-medium hover:bg-red-500 transition-colors"
              onClick={handleSubmit}
            >
              {submitButtonText}
            </button>
            <button
              className="border-2 border-brand rounded-lg py-1 px-2 text-lg text-brand-900 font-medium hover:bg-brand-500 transition-colors"
              onClick={handleCancel}
            >
              {backButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

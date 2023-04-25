import { ChatBubbleLeftRightIcon, StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { FeedbackApi } from '@/utils/api/feedback/feedback.api'
import { StarIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import router from 'next/router'

type FeedbackDialogProps = React.ComponentPropsWithRef<'div'> & {
  title: string
  open: boolean
  close: () => void
  courseId: string
  missionId: string
  levelId: string
  userId: string
  backButtonText?: string
  submitButtonText?: string
  className?: string
}

const StarRating = ({ rating, handleRating }) => {
  const stars = [...Array(5)].map((_, i) => {
    // when the first start is clicked, set rating to 0
    const starValue = i + 1
    return rating >= starValue ? (
      <StarIcon
        key={i}
        className={`w-8 h-8 text-secondary hover:text-secondary-800 cursor-pointer`}
        onClick={() => handleRating(starValue)}
      />
    ) : (
      <StarIconOutline
        key={i}
        className={`w-8 h-8 text-brand-400 hover:text-brand-400 cursor-pointer`}
        onClick={() => handleRating(starValue)}
      />
    )
  })

  return <div className="flex items-center">{stars}</div>
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  title,
  open,
  close,
  courseId,
  missionId,
  levelId,
  userId,
  backButtonText = 'Go Back to Mission',
  submitButtonText = 'Submit',
  className,
}: FeedbackDialogProps) => {
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)

  const handleRating = (rating: number) => {
    setRating(rating)
  }
  const session = useSession()
  const handleMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }
  const handleCancel = () => {
    close()
  }
  const handleSubmit = async () => {
    if (!rating) {
      setErrorMessage('Please select a rating before submitting.')
      return
    }

    setSubmitButtonDisabled(true)

    try {
      await new FeedbackApi(session.data).create({
        courseId,
        userId,
        missionId,
        levelId,
        rating,
        ...(message && { message }),
      })
      router.push(`/app/${courseId}/${missionId}`)
    } catch (e) {
      setErrorMessage('Something went wrong. Please try again.')
      setSubmitButtonDisabled(false)
      console.log(e)
    }
  }

  return open ? (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-brand bg-opacity-50 transition-opacity"
          aria-hidden="true"
        />
        <div
          className={`bg-white rounded-md overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-brand px-4 py-3 border-b-2 border-b-secondary">
            <h3
              className="text-xl font-medium text-secondary flex gap-2 items-center"
              id="modal-headline"
            >
              {title}{' '}
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-secondary"></ChatBubbleLeftRightIcon>
            </h3>
          </div>
          <div className="bg-brand-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <label className="leading-loose text-brand text-lg font-semibold">
                  How would you rate this level?
                </label>
                <StarRating rating={rating} handleRating={handleRating} />
                <p className="text-error text-sm">{errorMessage}</p>
              </div>
              <div className="flex flex-col mt-4">
                <label className="leading-loose text-brand text-lg font-medium">
                  Optional Review
                </label>
                <textarea
                  className="h-24 py-2 px-3 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                  onChange={handleMessage}
                  value={message}
                  placeholder="Your review will remain anonymous."
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="bg-brand-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-5">
            <button
              className="btn btn-brand rounded-md disabled:bg-gray-500"
              onClick={handleSubmit}
              disabled={submitButtonDisabled}
            >
              {submitButtonText}
            </button>
            <button className="btn btn-secondary rounded-md" onClick={handleCancel}>
              {backButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

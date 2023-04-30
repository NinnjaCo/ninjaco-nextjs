import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

interface Props {
  images: string[]
  isLarge?: boolean
}

const MultiImageCarousel = ({ images, isLarge }: Props) => {
  const maxScrollWidth = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1)
    }
  }

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1)
    }
  }

  const isDisabled = (direction) => {
    if (direction === 'prev') {
      return currentIndex <= 0
    }

    if (direction === 'next' && carousel.current !== null) {
      return carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
    }

    return false
  }

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex
    }
  }, [currentIndex])

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0
  }, [])

  return (
    <div className="mx-auto">
      <div className="relative overflow-x-hidden">
        <div className="flex justify-between absolute top left w-full h-full items-center">
          <button
            onClick={movePrev}
            className="hover:bg-brand/75 bg-brand/30 text-brand hover:text-secondary w-12 h-12 flex items-center justify-center rounded-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('prev')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="sr-only">Prev</span>
          </button>
          <button
            onClick={moveNext}
            className="hover:bg-brand/75 bg-brand/30 text-brand hover:text-secondary w-12 h-12 flex items-center justify-center rounded-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('next')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="sr-only">Next</span>
          </button>
        </div>
        <div
          ref={carousel}
          className="relative flex gap-12 overflow-x-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0 items-center"
        >
          {images.map((image, index) => {
            return (
              <div
                key={index}
                className={clsx('text-center relative w-80 h-80 snap-start', {
                  'w-96 h-96': isLarge,
                })}
              >
                <div
                  className="h-full w-full aspect-square block bg-origin-padding bg-left-top bg-contain bg-no-repeat z-0"
                  style={{ backgroundImage: `url(${image || ''})`, backgroundSize: 'contain' }}
                >
                  <Image src={image} alt="image" className="w-full aspect-square hidden" fill />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MultiImageCarousel

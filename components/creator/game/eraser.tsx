import React from 'react'

/**
 *  Component for Eraser
 * @param color, a hex color
 * @param width, width of the svg
 * @param height, height of the svg
 *
 * @returns an svg of eraser
 */

const Eraser = ({ color, width, height }: { color: string; width: number; height: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.3599 1.6367L28.7849 9.45837C29.9549 10.7092 29.9549 12.7042 28.7849 13.955L14.9999 28.5059C13.8729 29.692 12.3464 30.3581 10.7549 30.3581C9.16342 30.3581 7.63687 29.692 6.5099 28.5059L1.2149 22.9167C0.0449024 21.6659 0.0449024 19.6709 1.2149 18.42L17.1149 1.6367C18.2999 0.401699 20.1899 0.401699 21.3599 1.6367ZM3.3299 20.6684L8.6399 26.2575C9.8099 27.5084 11.6999 27.5084 12.8849 26.2575L18.1799 20.6684L10.7549 12.8309L3.3299 20.6684Z"
        fill={color}
      />
    </svg>
  )
}

export default Eraser

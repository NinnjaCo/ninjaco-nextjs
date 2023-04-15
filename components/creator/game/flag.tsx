import React from 'react'

/**
 *  Component for Flag
 * @param color, a hex color
 * @param width, width of the svg
 * @param height, height of the svg
 *
 * @returns an svg of Flag
 */

const Flag = ({ color, width, height }: { color: string; width: number; height: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={width}
      height={height}
    >
      <path
        fillRule="evenodd"
        d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z"
        clipRule="evenodd"
        fill={color}
      />
    </svg>
  )
}

export default Flag

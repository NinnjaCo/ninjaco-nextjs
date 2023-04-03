import { useEffect, useState } from 'react'

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState<{
    x: number | undefined
    y: number | undefined
  }>({
    x: undefined,
    y: undefined,
  })

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleScroll() {
      // Set window width/height to state
      setScrollPosition((prev) => ({
        x: window.scrollX,
        y: window.scrollY,
      }))
    }

    // Add event listener
    window.addEventListener('scroll', handleScroll)

    // Call handler right away so state gets updated with initial window size
    handleScroll()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleScroll)
  }, []) // Empty array ensures that effect is only run on mount
  return scrollPosition
}

export default useScrollPosition

import { Button } from 'react-bootstrap'
// import { ComponentToPrint } from '../[courseId]/certificate'
import { ComponentToPrint } from '@/components/componentToPrint'
import { useEffect, useState } from 'react'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'

export default function PrintComponent() {
  const [showButton, setShowButton] = useState(true)
  const componentRef = useRef()

  useEffect(() => {
    setShowButton(false)
  }, [])

  useEffect(() => {
    if (!showButton) {
      window.print()
    }
  }, [showButton])

  return (
    <>
      <div>
        {!showButton && <ReactToPrint content={() => componentRef.current} />}
        {/* component to be printed */}
        <div>
          <ComponentToPrint ref={componentRef} />
        </div>
      </div>
    </>
  )
}

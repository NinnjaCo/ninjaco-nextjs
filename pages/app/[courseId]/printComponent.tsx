import { Button } from 'react-bootstrap'
// import { ComponentToPrint } from '../[courseId]/certificate'
import { ComponentToPrint } from '@/components/componentToPrint'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'

export default function PrintComponent() {
  let componentRef = useRef()

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <button onClick={() => window.print()}>
          <ReactToPrint
            trigger={() => <Button>Print your certificate!</Button>}
            content={() => componentRef.current}
          />
        </button>
        {/* component to be printed */}
        <div>
          <ComponentToPrint ref={(el) => (componentRef = el)} />
        </div>
      </div>
    </>
  )
}

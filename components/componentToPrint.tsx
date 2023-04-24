import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import React from 'react'
import logo_black from '@/images/logo_black.svg'

// eslint-disable-next-line react/display-name
export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { user, course } = props
  return (
    <div ref={ref}>
      <>
        <div className="hidden md:block w-full h-full border-[50px] border-brand bg-brand-50 p-10 relative">
          <div className="w-36 md:w-36 lg:w-52 h-24 absolute top-10 left-12 cursor-pointer">
            <Image src={logo_black} alt="Hero Image" fill priority></Image>
          </div>
          <div className="w-full flex flex-col gap-6 items-center justify-center h-full">
            <div className="text-center w-full text-3xl md:text-5xl font-medium font-serif">
              Certificate of Completion
            </div>
            <div className="text-center w-full text-xl md:text-2xl font-serif">
              This is to certify that
            </div>
            <div className="text-center w-full text-4xl font-semibold font-serif">
              {user.firstName + ' ' + user.lastName}
            </div>
            <div className="w-1/12 h-1 bg-secondary"></div>
            <div className="text-center w-full text-xl md:text-2xl font-serif">
              has successfully completed the course
            </div>
            <div className="text-center w-full text-4xl font-semibold font-serif">
              {course.course.title}
            </div>
            <div className="w-1/6 h-1 bg-secondary"></div>
          </div>
          <div className="w-full flex justify-between">
            <p>Issued on {new Date().toDateString()}</p>
            <p>Issued by NinjaCo</p>
          </div>
        </div>
      </>
    </div>
  )
})

export const getServerSideProps = async (context) => {
  const { query, req, res } = context
  const { courseId } = query

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination:
          (query.redirectTo as string | undefined) || '/auth/signup?error=Token%20Expired',
        permanent: false,
      },
    }
  }

  const course = await new CourseEnrollmentAPI(session).findByCourseId(courseId)

  if (!course || !course.payload || !('completed' in course.payload) || !course.payload.completed) {
    return {
      props: {
        redirect: {
          destination: '/app',
          permanent: false,
        },
      },
    }
  }

  return {
    props: {
      user: session.user,
      course: course.payload,
    },
  }
}

// export class ComponentToPrint extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2 style={{ color: 'green' }}>Attendance</h2>
//         <table>
//           <thead>
//             <th>S/N</th>
//             <th>Name</th>
//             <th>Email</th>
//           </thead>
//           <tbody>
//             <tr>
//               <td>1</td>
//               <td>Njoku Samson</td>
//               <td>samson@yahoo.com</td>
//             </tr>
//             <tr>
//               <td>2</td>
//               <td>Ebere Plenty</td>
//               <td>ebere@gmail.com</td>
//             </tr>
//             <tr>
//               <td>3</td>
//               <td>Undefined</td>
//               <td>No Email</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     )
//   }
// }

import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '../../api/auth/[...nextauth]'
import { exportAsImage } from '@/utils/exportAsImage'
import { getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import logo_black from '@/images/logo_black.svg'
import useTranslation from '@/hooks/useTranslation'

export default function UserCourseView({ user, course }: { user: User; course: CourseEnrollment }) {
  const t = useTranslation()
  const exportRef = useRef()

  function handleCapture() {
    const element = document.querySelector('#capture')
    if (element) {
      html2canvas(element as HTMLElement).then((canvas) => {
        document.body.appendChild(canvas)
      })
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4')
    const content = document.querySelector('#content') as HTMLElement
    if (content) {
      doc.html(content, {
        callback: function (pdf) {
          pdf.save('Certificate.pdf')
        },
      })
    }
  }

  return (
    <>
      <Head>
        <title>NinjaCo | View Course</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full h-screen">
        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-brand text-sm ">
            <span className="px-2 font-bold">
              Please Use Your Computer to Print the Certificate
            </span>
          </h1>
          <Link
            href={`/app/${course.course._id}`}
            className="self-start my-4 text-sm btn btn-brand"
          >
            {t.Creator.games.createGame.goBack}
          </Link>
        </div>
        <button onClick={() => handleCapture()}>Capture Image</button>

        <div
          id="content"
          className="hidden md:block w-full h-full border-[50px] border-brand bg-brand-50 p-10 relative"
        >
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
          <button onClick={generatePDF}>click to download</button>
        </div>
      </main>
    </>
  )
}

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

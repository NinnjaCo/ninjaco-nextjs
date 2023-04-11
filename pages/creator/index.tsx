import CoursesComponent from '@/components/creator/coursesComponent'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>NinjaCo | Creator Dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu />
        <CoursesComponent
          image={
            'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png'
          }
          name={'Robotics 101'}
          mission={'12'}
          age={'7 - 12'}
        />
        <CreatorMenu isOnCoursePage={true} />
      </main>
    </>
  )
}

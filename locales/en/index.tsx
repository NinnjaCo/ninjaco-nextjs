import { WebsiteTranslations } from '@/locales'

const englishTranslations: WebsiteTranslations = {
  Menu: {
    about: 'About',
    aboutDescription: 'Why choose our platform',
    courses: 'Courses',
    coursesDescription: 'Check all course offerings',
    startCoding: 'Start Coding',
    signIn: 'Sign In',
    register: 'Register',
  },
  fourOhFour: {
    headTitle: 'Ninja Co | Page Not Found',
    title: 'Page Not Found',
    goBackHome: 'Go back home',
  },
  LandingPage: {
    headTitle: 'Ninja Co | Start Coding',
    Hero: {
      title: (
        <>
          Empower Your Child&apos;s <br /> Future with NinjaCo
        </>
      ),
      description: (
        <>
          Discover the fun and excitement of robotics and coding with Ninja Co&apos;s online
          platform! Our step-by-step guide and interactive courses will help you unleash your inner
          ninja and master these essential skills from the comfort of your own home.
        </>
      ),
      getStarted: 'Get Started',
    },

    Testimonials: {
      title: 'What others say',
      reviews: {
        review1:
          "My son has always been interested in robots, but we don't live near any of the Ninja Co branches. Thanks to their new online platform, he can finally take classes and learn about robotics from the comfort of our own home.",
        review2:
          "I've been an instructor at Ninja Co for two years, and I was initially skeptical about the move to an online platform. However, I've been blown away by the capabilities of the new software.",
        review3:
          "I've always been fascinated by robots, but I never thought I could build one myself. Thanks to Ninja Co's online platform, I'm now able to take classes and learn how to create my own robot step-by-step!",
      },
    },
    About: {
      title: 'Why choose our platform?',
      courses: 'Courses',
      coursesDescription: 'All kind of courses tailored to your needs',
      playForms: 'Playful forms',
      playFormsDescription: 'We motivate children to study using visual programming',
      trophy: 'Trophy',
      trophyDescription: 'We reward children for their achievements',
      joinNow: 'Join Now',
    },
    Mission: {
      ourMission: 'Our Mission',
      ourMissionDescription:
        'Make STEM education fun and interactive for children and teens through the use of LEGO kits and iPad coding sessions. The company is committed to enhancing STEM education and providing top-grade opportunities for the youth of Lebanon to learn about robotics and programming.',
      soFar: 'So Far',
      soFarDescription:
        "Ninja Co has established over 20 education centers across Lebanon, offering an engaging and interactive curriculum in robotics that is constantly updated. The company's traditional in-person class model has proven successful, but to expand its reach and drive growth, We developed this online platform that will transform the company's offerings",
    },
  },
  Footer: {
    contactUs: 'Contact Us',
    FindUs: 'Find Us',
    aboutUs: 'About Us',
    Links: 'Links',
    Faq: 'FAQ',
    Terms: 'Privacy Policy',
  },
  Faq: {
    headTitle: 'Frequently Asked Questions',
    question1: 'Should I have previous knowledge in programming?',
    answer1:
      "No, previous knowledge in programming is not necessary to enroll in NinjaCo's courses or use the online platform. The platform will include a user-friendly interface with a step-by-step guide to building robots, allowing students to follow along at their own pace. The platform will also include visual programming and block coding options, making the learning process even more interactive.",
    question2: 'Do I need hardware parts?',
    answer2:
      'Yes, hardware parts are needed to build the robots. The on-site classes use arduino kits to build the robots, and the online platform will also provide a step-by-step guide for building robots using hardware parts. However, these hardware parts will not be included with the online platform and must be purchased separately by the user.',
    question3: 'Should I install any other software to connect to the Arduino?',
    answer3:
      'Since the online platform will include visual programming and block coding options, it is required to download an Arduino agent to program the Arduino board.',
    question4: 'Where can I register for the courses?',
    answer4:
      "You should be able to register for the courses on the website that offers the coding courses using visual blocks and Arduino. Look for a « Start coding » or « Get started » button/link on the website's landing page or navigation menu. Clicking on that button/link should take you to a registration page where you can provide your information and enroll in the courses.",
  },
}

export default englishTranslations

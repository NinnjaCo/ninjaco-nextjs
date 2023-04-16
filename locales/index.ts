import englishTranslations from '@/locales/en'
import frenchTranslations from '@/locales/fr'

export type translationElement = JSX.Element | string

export interface WebsiteTranslations {
  Menu: {
    about: translationElement
    aboutDescription: translationElement
    courses: translationElement
    coursesDescription: translationElement
    startCoding: translationElement
    signIn: translationElement
    register: translationElement
    signOut: translationElement
  }
  FourOhFour: {
    headTitle: translationElement
    title: translationElement
    goBackHome: translationElement
  }
  LandingPage: {
    headTitle: translationElement
    Hero: {
      title: translationElement
      description: translationElement
      getStarted: translationElement
    }

    Testimonials: {
      title: translationElement
      reviews: {
        review1: translationElement
        review2: translationElement
        review3: translationElement
      }
    }
    About: {
      title: translationElement
      courses: translationElement
      coursesDescription: translationElement
      playForms: translationElement
      playFormsDescription: translationElement
      trophy: translationElement
      trophyDescription: translationElement
      joinNow: translationElement
    }
    Mission: {
      ourMission: translationElement
      ourMissionDescription: translationElement
      soFar: translationElement
      soFarDescription: translationElement
    }
  }
  Copyright: {
    headTitle: translationElement
    privacy: translationElement
    updated: translationElement
    agreement: translationElement
    collectInformation: translationElement
    collect1: translationElement
    collect2: translationElement
    collect3: translationElement
    collect4: translationElement
    useInformation: translationElement
    use1: translationElement
    use2: translationElement
    use3: translationElement
    use4: translationElement
    shareInformation: translationElement
    share1: translationElement
    share2: translationElement
    share3: translationElement
    rights: translationElement
    right1: translationElement
    right2: translationElement
    right3: translationElement
    right4: translationElement
    right5: translationElement
    right6: translationElement
    security: translationElement
    childrenPrivacy: translationElement
    changes: translationElement
    questions: translationElement
  }
  Footer: {
    contactUs: translationElement
    FindUs: translationElement
    aboutUs: translationElement
    Links: translationElement
    Faq: translationElement
    Terms: translationElement
  }
  Faq: {
    headTitle: translationElement
    title: translationElement
    question1: translationElement
    answer1: translationElement
    question2: translationElement
    answer2: translationElement
    question3: translationElement
    answer3: translationElement
    question4: translationElement
    answer4: translationElement
  }
  Auth: {
    signin: {
      headTitle: translationElement
      email: translationElement
      password: translationElement
      signIn: translationElement
      forgotPassword: translationElement
      signUp: translationElement
    }
    forgetPassword: {
      title: translationElement
      invalidEmail: translationElement
      emailRequired: translationElement
      wrong: translationElement
      checkEmail: translationElement
      label: translationElement
      sendResetLink: translationElement
      backToHome: translationElement
      signIn: translationElement
    }
    resetPassword: {
      title: translationElement
      newPassword: translationElement
      password: translationElement
      confirmPassword: translationElement
      confirmPassword1: translationElement
      changePassword: translationElement
      backToHome: translationElement
      signIn: translationElement
    }
    signUp: {
      firstName: translationElement
      lastName: translationElement
      dateOfBirth: translationElement
      email: translationElement
      password: translationElement
      confirmPassword: translationElement
      signUp: translationElement
      backToHome: translationElement
      signIn: translationElement
    }
    verifyEmail: {
      code: translationElement
      verify: translationElement
      backToHome: translationElement
      signIn: translationElement
    }
  }
  Profile: {
    firstName: translationElement
    lastName: translationElement
    dateOfBirth: translationElement
    email: translationElement
    password: translationElement
    confirmPassword: translationElement
    profile: translationElement
    save: translationElement
    changePassword: translationElement
  }

  Admin: {
    Dashboard: {
      prophilePhoto: translationElement
      firstName: translationElement
      lastName: translationElement
      email: translationElement
      level: translationElement
      points: translationElement
      statistics: translationElement
      leaderboard: translationElement
    }
    Courses: {
      headerTitle: translationElement
      title: translationElement
      id: translationElement
      usersEnrolled: translationElement
      numberOfMissions: translationElement
      numberOfLevels: translationElement
      createdAt: translationElement
      updatedAt: translationElement
      entriesFound: translationElement
    }
    Users: {
      somethingWentWrong: translationElement
      createdSuccessfully: translationElement
      resetPassword: translationElement
      resetPasswordsent: translationElement
      resetPasswordError: translationElement
      resetPasswordSuccessfully: translationElement
      userDeletedSuccessfully: translationElement
      userDeletedError: translationElement
      message: translationElement
      notifyByEmail: translationElement
      newPassword: translationElement
      firstName: translationElement
      lastName: translationElement
      email: translationElement
      name: translationElement
      dateOfBirth: translationElement
      createdAt: translationElement
      updatedAt: translationElement
      action: translationElement
      addUsers: translationElement
      cancel: translationElement
      delete: translationElement
      deleteUser: translationElement
      send: translationElement
      title: translationElement
      entriesFound: translationElement
      password: translationElement
      confirmPassword: translationElement
      notify: translationElement
      users: translationElement
    }
    Creators: {
      somethingWentWrong: translationElement
      createdSuccessfully: translationElement
      resetPassword: translationElement
      resetPasswordsent: translationElement
      resetPasswordSuccessfully: translationElement
      errorResetingPassword: translationElement
      userDeletedSuccessfully: translationElement
      errorUpdatingProfile: translationElement
      notifyByEmail: translationElement
      newPassword: translationElement
      message: translationElement
      name: translationElement
      cancel: translationElement
      reset: translationElement
      delete: translationElement
      firstName: translationElement
      lastName: translationElement
      dateOfBirth: translationElement
      createdAt: translationElement
      updatedAt: translationElement
      action: translationElement
      addCreators: translationElement
      creators: translationElement
      entriesFound: translationElement
    }
  }
}

// Create locale type support en | fr
export type Locale = 'en' | 'fr'

export const getTranslations = (locale: Locale) => {
  switch (locale) {
    case 'en':
      return englishTranslations
    case 'fr':
      return frenchTranslations
    default:
      return englishTranslations
  }
}

export const isLocale = (locale: string): locale is Locale => {
  return locale === 'en' || locale === 'fr'
}

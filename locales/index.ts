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
    unauthorized: {
      headTitle: translationElement
      title: translationElement
      goBack: translationElement
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
      back: translationElement
      confirm: translationElement
      resetPass: translationElement
      notifyUser: translationElement
      deleteUser: translationElement
      editUser: translationElement
      password: translationElement
      confirmPassword: translationElement
      submit: translationElement
    }
    LogOutDialogue: {
      logout: translationElement
      logoutconfimarion: translationElement
      logoutMessage: translationElement
      cancel: translationElement
    }
    SideMenu: {
      dashboard: translationElement
      courses: translationElement
      users: translationElement
      creators: translationElement
    }
  }
  MenuCreator: {
    courses: translationElement
    games: translationElement
  }
  Forms: {
    imageUpload: {
      unacceptableImageType: translationElement
      unacceptableImageSize: translationElement
      lowResolutionImage: translationElement
      dropImageHere: translationElement
      removeImage: translationElement
      removeAllImages: translationElement
    }
  }
  Creator: {
    viewCourses: {
      courses: translationElement
      entries: translationElement
      createCourse: translationElement
      filter: translationElement
    }
    coursePage: {
      editCourse: translationElement
      courseType: translationElement
      coursePrerequisites: translationElement
      courseObjectives: translationElement
      ageRange: translationElement
      addMission: translationElement
      filter: translationElement
      missions: translationElement
      noMissions: translationElement
    }
    createCourse: {
      alerts: {
        imageAlert: translationElement
      }
      schema: {
        courseTypeRequired: translationElement
        courseTitleRequired: translationElement
        courseImageRequired: translationElement
        courseDescriptionRequired: translationElement
      }
      createCourse: translationElement
      courseType: translationElement
      courseImage: translationElement
      courseTitle: translationElement
      courseDescription: translationElement
      courseAgeRange: translationElement
      ageRangeHelper: translationElement
      coursePrerequisites: translationElement
      prerequisitesHelper: translationElement
      courseObjectives: translationElement
      objectivesHelper: translationElement
      cancel: translationElement
    }
    editCourse: {
      alerts: {
        wentWrong: translationElement
        error: translationElement
      }
      schema: {
        courseTypeRequired: translationElement
        courseTitleRequired: translationElement
        courseDescriptionRequired: translationElement
      }
      editCourse: translationElement
      courseType: translationElement
      courseImage: translationElement
      courseTitle: translationElement
      courseDescription: translationElement
      courseAgeRange: translationElement
      ageRangeHelper: translationElement
      coursePrerequisites: translationElement
      prerequisitesHelper: translationElement
      courseObjectives: translationElement
      objectivesHelper: translationElement
      cancel: translationElement
    }
    viewMissionPage: {
      editMission: translationElement
      missionCategory: translationElement
      levels: translationElement
      addLevel: translationElement
    }
    editMissionPage: {
      missionTitleRequired: translationElement
      missionDescriptionRequired: translationElement
      missionCategoryRequired: translationElement
      somethingWrong: translationElement
      noChangesMade: translationElement
      errorEditingMission: translationElement
      errorCreatingCategory: translationElement
      warning: translationElement
      cancel: translationElement
      editMission: translationElement
      missionTitle: translationElement
      missionBannerImage: translationElement
      missionDescription: translationElement
      missionCategory: translationElement
      createNewCategory: translationElement
      addCategory: translationElement
      newCategory: translationElement
    }
    createMissionPage: {
      missionTitleRequired: translationElement
      missionImageRequired: translationElement
      missionDescriptionRequired: translationElement
      missionCategoryRequired: translationElement
      somethingWrong: translationElement
      pleaseUploadImage: translationElement
      errorCreatingGame: translationElement
      errorCreatingCategory: translationElement
      createMission: translationElement
      missionTitle: translationElement
      missionBannerImage: translationElement
      missionDescription: translationElement
      missionCategory: translationElement
      selectACategory: translationElement
      createNewCategory: translationElement
      warning: translationElement
      addCategory: translationElement
      newCategory: translationElement
      cancel: translationElement
    }
    createLevelPage: {
      creatingLevel: translationElement
      onlyTenBuildingParts: translationElement
      onlyTenStepByStep: translationElement
      imageIsNotValid: translationElement
      imageIsTooBig: translationElement
      errorUploadingImage: translationElement
      errorCreatingLevel: translationElement
      creatingLevelNumber: translationElement
      buildingPartImages: translationElement
      stepByStepImages: translationElement
      cancel: translationElement
      createLevel: translationElement
      websitePreviewImage: translationElement
      oneImageIsNotValid: translationElement
      oneImageIsTooBig: translationElement
    }
    editLevelPage: {
      atLeastOneImage: translationElement
      noChangesMade: translationElement
      onlyTenBuildingParts: translationElement
      onlyTenStepByStep: translationElement
      imageIsNotValid: translationElement
      imageIsTooBig: translationElement
      errorUploadingImage: translationElement
      errorUpdatingLevel: translationElement
      editLevel: translationElement
      editLevelNumber: translationElement
      buildingPartImages: translationElement
      stepByStepImages: translationElement
      cancel: translationElement
      websitePreviewImage: translationElement
      oneImageIsNotValid: translationElement
      oneImageIsTooBig: translationElement
    }
    games: {
      viewGames: {
        headTitle: translationElement
        title: translationElement
        createGame: translationElement
        entries: translationElement
        filter: {
          newest: translationElement
          oldest: translationElement
          recentlyUpdated: translationElement
          NameAZ: translationElement
          NameZA: translationElement
          SizeOfGame: translationElement
        }
      }
      createGame: {
        headTitle: translationElement
        mobileError: translationElement
        goBack: translationElement
        title: translationElement
        gameTitle: translationElement
        sizeOfTheGrid: translationElement
        toggleLimitedBlocks: translationElement
        limitedNumberOfBlocks: translationElement
        saveGame: translationElement
        resetGrid: translationElement
        toolbox: {
          title: translationElement
          description: translationElement
          player: translationElement
          goal: translationElement
          wall: translationElement
          eraseAll: translationElement
        }
        alerts: {
          pleaseSelectATool: translationElement
          pleaseSetAPlayer: translationElement
          pleaseSetAGoal: translationElement
          pleaseEnterAGameTitle: translationElement
          pleaseUploadAnImage: translationElement
          gameCreatedSuccessfully: translationElement
          somethingWentWrong: translationElement
          errorCreatingGame: translationElement
        }
      }
      editGame: {
        headTitle: translationElement
        mobileError: translationElement
        goBack: translationElement
        title: translationElement
        gameTitle: translationElement
        sizeOfTheGrid: translationElement
        toggleLimitedBlocks: translationElement
        limitedNumberOfBlocks: translationElement
        saveGame: translationElement
        resetGrid: translationElement
        toolbox: {
          title: translationElement
          description: translationElement
          player: translationElement
          goal: translationElement
          wall: translationElement
          eraseAll: translationElement
        }
        alerts: {
          pleaseSelectATool: translationElement
          pleaseSetAPlayer: translationElement
          pleaseSetAGoal: translationElement
          pleaseEnterAGameTitle: translationElement
          pleaseUploadAnImage: translationElement
          gameCreatedSuccessfully: translationElement
          somethingWentWrong: translationElement
          errorCreatingGame: translationElement
        }
      }
    }
  }
  User: {
    viewCoursePage: {
      enrollCourse: translationElement
      dropCourse: translationElement
      courseCompleted: translationElement
      printCertificate: translationElement
      courseType: translationElement
      coursePrerequisites: translationElement
      courseObjectives: translationElement
      ageRange: translationElement
      filter: translationElement
      missions: translationElement
      noMissions: translationElement
      dropCourseTitle: translationElement
      dropCourseMessage: translationElement
      cancel: translationElement
      drop: translationElement
    }
  }
  Filter: {
    filter: translationElement
  }
  ServerError: {
    headTitle: translationElement
    title: translationElement
    goBackHome: translationElement
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

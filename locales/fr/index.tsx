import { WebsiteTranslations } from '@/locales'

const frenchTranslations: WebsiteTranslations = {
  Menu: {
    about: 'À propos',
    aboutDescription: 'Découvrez comment NinjaCo peut aider votre enfant à réussir',
    courses: 'Cours',
    coursesDescription: 'Découvrez tous les cours offerts',
    startCoding: 'Commencer à coder',
    signIn: 'Connecter',
    register: <>S&apos;inscrire</>,
  },
  fourOhFour: {
    headTitle: 'Ninja Co | Page introuvable',
    title: 'Page introuvable',
    goBackHome: <>Retourner à l&apos;accueil</>,
  },
  LandingPage: {
    headTitle: 'Ninja Co | Commencer à coder',
    Hero: {
      title: (
        <>
          Laissez NinjaCo aider
          <br /> votre enfant à réussir
        </>
      ),
      description: (
        <>
          Découvrez le plaisir et l&apos;excitation de la robotique et de la programmation avec la
          plateforme en ligne de Ninja Co ! Notre guide étape par étape et nos cours interactifs
          vous aideront à libérer votre ninja intérieur et à maîtriser ces compétences essentielles
          depuis le confort de votre propre domicile.
        </>
      ),
      getStarted: 'Commencer',
    },
    Testimonials: {
      title: 'Ce que disent les autres',
      reviews: {
        review1:
          "Mon fils a toujours été intéressé par les robots, mais nous ne vivons à proximité d'aucune des succursales de Ninja Co. Grâce à leur nouvelle plateforme en ligne, il peut enfin suivre des cours et s'initier à la robotique dans le confort de sa maison.",
        review2:
          "Je suis instructeur chez Ninja Co depuis deux ans et j'étais initialement sceptique quant au passage à une plateforme en ligne. Cependant, j'ai été époustouflé par les capacités du nouveau logiciel.",
        review3:
          "J'ai toujours été fasciné par les robots, mais je n'aurais jamais pensé pouvoir en construire un moi-même. Grâce à la plateforme en ligne de Ninja Co, je peux désormais suivre des cours et apprendre à créer pas à pas mon propre robot !",
      },
    },
  },
}

export default frenchTranslations

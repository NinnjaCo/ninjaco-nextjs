import { useRouter } from 'next/router'
import Image from 'next/image'
import React from 'react'
import darkBackgroundLogo from '@/images/logo_white.svg'
import facebook from '@/images/facebook.svg'
import instagram from '@/images/instagram.svg'
import linkedin from '@/images/linkedin.svg'
import twitter from '@/images/twitter.svg'
import useTranslation from '@/hooks/useTranslation'

const Footer = () => {
  const t = useTranslation()
  const router = useRouter()

  const handleSocialMediaIcon = (url: string) => {
    return {
      onClick: () => {
        window.open(url, '_blank')
      },
      tabIndex: 0,
      role: 'button',
      onKeyDown: () => {
        window.open(url, '_blank')
      },
    }
  }
  const socialMediaIcons = [
    {
      name: 'instagram',
      url: 'https://instagram.com',
      icon: instagram,
    },
    {
      name: 'facebook',
      url: 'https://facebook.com',
      icon: facebook,
    },
    {
      name: 'twitter',
      url: 'https://twitter.com',
      icon: twitter,
    },
    {
      name: 'linkedin',
      url: 'https://linkedin.com',
      icon: linkedin,
    },
  ]
  return (
    <footer className="bg-brand w-full px-6 md:px-12 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-start gap-8">
      <div
        className="w-24 md:w-36 lg:w-40 h-12 relative cursor-pointer"
        onClick={() => {
          router.push('/')
        }}
        tabIndex={0}
        role="button"
        onKeyDown={() => {
          router.push('/')
        }}
      >
        <Image src={darkBackgroundLogo} alt="Hero Image" fill></Image>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <p className="text-brand-50 font-bold text-sm md:text-base">{t.Footer.contactUs}</p>
        <div className="flex flex-col gap-0 text-xs md:text-base">
          <p className="text-brand-50">+961 71 464 624</p>
          <p className="text-brand-50">+961 71 370 811</p>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <p className="text-brand-50 font-bold text-sm md:text-base">{t.Footer.FindUs}</p>
        <div className="flex flex-col text-xs md:text-base">
          <p className="text-brand-50">Sarba, Lebanon</p>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <p className="text-brand-50 font-bold text-sm md:text-base">{t.Footer.Links}</p>
        <div className="flex flex-col text-xs md:text-base">
          <p className="text-brand-50">{t.Footer.Terms}</p>
          <p className="text-brand-50">{t.Footer.Faq}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {socialMediaIcons.map((icon, index) => {
          return (
            <div
              className="w-6 h-6 relative cursor-pointer"
              {...handleSocialMediaIcon(icon.url)}
              key={index}
            >
              <Image src={icon.icon} alt={icon.name} fill></Image>
            </div>
          )
        })}
      </div>
    </footer>
  )
}

export default Footer

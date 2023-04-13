import { User } from '@/models/crud'
import { useMemo } from 'react'
import fallbackProfilePicture from '@/images/fallbackProfilePicture.svg'
import getGeneratedAvatar from '../utils/shared/getGeneratedAvatar'

const useUserProfilePicture = (user: User) => {
  return useMemo(() => {
    if (user.profilePicture && user.profilePicture != '') {
      return { profilePic: user.profilePicture, nowGenerated: false }
    }
    if (user.firstName) {
      return {
        profilePic: getGeneratedAvatar(user),
        nowGenerated: true,
      }
    }
    return { profilePic: fallbackProfilePicture, nowGenerated: false }
  }, [user])
}

export default useUserProfilePicture

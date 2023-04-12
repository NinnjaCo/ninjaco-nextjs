import { User } from '@/models/crud'
import { adventurer } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

const getGeneratedAvatar = (user: User) => {
  return createAvatar(adventurer, {
    seed: user.firstName + ' ' + user.lastName,
    backgroundType: ['solid'],
    backgroundColor: ['b6e3f4'],
  }).toDataUriSync()
}

export default getGeneratedAvatar

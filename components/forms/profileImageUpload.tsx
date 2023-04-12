import { CameraIcon } from '@heroicons/react/24/solid'
import { User } from '@/models/crud'
import { adventurer } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import Image from 'next/image'
import ImageUploading, { ErrorsType, ImageListType, ImageType } from 'react-images-uploading'
import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import creator_profile from '@/images/creator_profile.svg'

interface ProfileImageUploadProps {
  user: User
  callbackOnNewImageSet: (image: ImageType) => void
}

const ProfileImageUpload = ({ user, callbackOnNewImageSet }: ProfileImageUploadProps) => {
  // Use array because the library forces an array of ImageType
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<ImageListType>([])

  const defaultProfilePhoto = useMemo(() => {
    if (user.profilePictureUrl) {
      return user.profilePictureUrl
    }
    if (user.firstName) {
      return createAvatar(adventurer, {
        seed: user.firstName + ' ' + user.lastName,
        backgroundType: ['solid'],
        backgroundColor: ['b6e3f4'],
      }).toDataUriSync()
    }
    return creator_profile
  }, [user])

  const onChange = async (imageList: ImageListType): Promise<void> => {
    setUploadedProfilePicture(imageList)
    callbackOnNewImageSet(imageList[0])
  }

  const getImageUploadErrorMessage = (error: ErrorsType) => {
    if (error?.acceptType) {
      return 'Unacceptable image type'
    }
    if (error?.maxFileSize) {
      return 'Max File Size Reached'
    }
    if (error?.resolution) {
      return 'Low Resolution'
    }
  }

  return (
    <ImageUploading multiple={false} value={uploadedProfilePicture} onChange={onChange}>
      {({ onImageUpload, onImageRemoveAll, isDragging, dragProps, errors }) => (
        <>
          <div
            {...dragProps}
            className={clsx('flex flex-col items-center justify-center gap-2 h-fit w-fit p-5', {
              'bg-brand-50 border-2 border-dashed border-gray-300':
                !isDragging && uploadedProfilePicture.length !== 0,
              'bg-brand-200': isDragging,
            })}
            {...dragProps}
          >
            {/* Avatar Photo */}
            <div
              className={clsx('flex flex-col relative cursor-pointer w-32 h-32', {
                'bg-brand-200 rounded-full': isDragging,
              })}
              onClick={(e) => {
                e.preventDefault()
                onImageUpload()
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                e.preventDefault()
                onImageUpload()
              }}
            >
              <Image
                className={clsx('rounded-full bg-white border-2 border-brand w-32 h-32', {
                  'opacity-40': isDragging,
                })}
                src={
                  uploadedProfilePicture.length !== 0
                    ? uploadedProfilePicture[0].dataURL
                    : defaultProfilePhoto
                }
                width={150}
                height={150}
                alt="PP"
              />
              <CameraIcon className="text-brand w-6 absolute bottom-1 right-2 bg-brand-50 rounded-full" />
            </div>
            {uploadedProfilePicture.length !== 0 && (
              <button className="text-xs text-error-dark font-bold" onClick={onImageRemoveAll}>
                Remove image
              </button>
            )}
            {errors && (
              <p className="text-xs text-error-dark font-bold">
                {getImageUploadErrorMessage(errors)}
              </p>
            )}
          </div>
        </>
      )}
    </ImageUploading>
  )
}

export default ProfileImageUpload

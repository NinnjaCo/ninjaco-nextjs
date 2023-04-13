import { CameraIcon } from '@heroicons/react/24/solid'
import { User } from '@/models/crud'
import Image from 'next/image'
import ImageUploading, { ErrorsType, ImageListType, ImageType } from 'react-images-uploading'
import React, { useState } from 'react'
import clsx from 'clsx'
import getGeneratedAvatar from '@/utils/shared/getGeneratedAvatar'
import useGeneratedAvatar from '@/utils/shared/getGeneratedAvatar'
import useUserProfilePicture from '@/hooks/useUserProfilePicture'

interface ProfileImageUploadProps {
  user: User
  callbackOnNewImageSet: (image: ImageType) => void
  callBackOnImageRemove: () => void
}

const ProfileImageUpload = ({
  user,
  callbackOnNewImageSet,
  callBackOnImageRemove,
}: ProfileImageUploadProps) => {
  // Use array because the library forces an array of ImageType
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<ImageListType>([])

  const [currentProfilePic, setCurrentProfilePic] = useState(useUserProfilePicture(user))

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
                    : currentProfilePic.profilePic
                }
                width={150}
                height={150}
                alt="PP"
                priority
              />
              <CameraIcon className="text-brand w-6 absolute bottom-1 right-2 bg-brand-50 rounded-full" />
            </div>
            {(uploadedProfilePicture.length !== 0 || !currentProfilePic.nowGenerated) && (
              <button
                className="text-xs text-error-dark font-bold"
                onClick={() => {
                  if (uploadedProfilePicture.length === 0) {
                    const generatedImage = getGeneratedAvatar(user)
                    setCurrentProfilePic({
                      nowGenerated: true,
                      profilePic: generatedImage,
                    })
                    callBackOnImageRemove()
                  }
                  onImageRemoveAll()
                }}
              >
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

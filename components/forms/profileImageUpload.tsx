import { CameraIcon } from '@heroicons/react/24/solid'
import { Control, Controller } from 'react-hook-form'
import { User } from '@/models/crud'
import Image from 'next/image'
import ImageUploading, { ErrorsType, ImageListType } from 'react-images-uploading'
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import getGeneratedAvatar from '@/utils/shared/getGeneratedAvatar'
import useTranslation from '@/hooks/useTranslation'

interface ProfileImageUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  rootClassName?: string
  defaultStartImage: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profilePic: any
    nowGenerated: boolean
  }
  user: User
}

const ProfileImageUpload = ({
  control,
  name,
  rootClassName,
  defaultStartImage,
  user,
}: ProfileImageUploadProps) => {
  // Use array because the library forces an array of ImageType
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<ImageListType>([])
  const [defaultImage, setDefaultImage] = useState(defaultStartImage)

  useEffect(() => {
    setDefaultImage(defaultStartImage)
  }, [defaultStartImage])

  const t = useTranslation()

  const getImageUploadErrorMessage = (error: ErrorsType) => {
    if (error?.acceptType) {
      return t.Forms.imageUpload.unacceptableImageType as string
    }
    if (error?.maxFileSize) {
      return t.Forms.imageUpload.unacceptableImageSize as string
    }
    if (error?.resolution) {
      return t.Forms.imageUpload.lowResolutionImage as string
    }
  }

  return (
    <div className={rootClassName}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ImageUploading
            multiple={false}
            value={field.value?.image || undefined}
            onChange={(imageList: ImageListType) => {
              setUploadedProfilePicture(imageList)
              field.onChange({ image: imageList[0], didRemove: false })
            }}
          >
            {({ onImageUpload, onImageRemoveAll, isDragging, dragProps, errors }) => (
              <>
                <div
                  {...dragProps}
                  className={clsx(
                    'flex flex-col items-center justify-center gap-2 h-fit w-fit p-5',
                    {
                      'bg-brand-50 border-2 border-dashed border-gray-300':
                        !isDragging && uploadedProfilePicture.length !== 0,
                      'bg-brand-200': isDragging,
                    }
                  )}
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
                        uploadedProfilePicture.length !== 0 && uploadedProfilePicture[0].dataURL
                          ? uploadedProfilePicture[0].dataURL
                          : defaultImage.profilePic
                      }
                      placeholder="blur"
                      blurDataURL={
                        uploadedProfilePicture.length !== 0 && uploadedProfilePicture[0].dataURL
                          ? uploadedProfilePicture[0].dataURL
                          : defaultImage.profilePic
                      }
                      style={{
                        objectFit: 'contain',
                      }}
                      fill
                      alt="PP"
                      sizes="(max-width: 768px) 40vw,
                      (max-width: 1200px) 50vw,
                      60vw"
                    />
                    <CameraIcon className="text-brand w-6 absolute bottom-1 right-2 bg-brand-50 rounded-full" />
                  </div>
                  {(uploadedProfilePicture.length !== 0 || !defaultImage.nowGenerated) && (
                    <button
                      className="text-xs text-error-dark font-bold"
                      onClick={() => {
                        onImageRemoveAll()
                        field.onChange({
                          image: null,
                          didRemove: true,
                        })
                        const generatedImage = getGeneratedAvatar(user)
                        setDefaultImage({
                          nowGenerated: true,
                          profilePic: generatedImage,
                        })
                      }}
                    >
                      {t.Forms.imageUpload.removeImage}
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
        )}
      />
    </div>
  )
}

export default ProfileImageUpload

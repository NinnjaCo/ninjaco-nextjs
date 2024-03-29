import { Control, Controller } from 'react-hook-form'
import { translationElement } from '@/locales'
import Image from 'next/image'
import ImageUploading, { ErrorsType, ImageListType } from 'react-images-uploading'
import React, { useState } from 'react'
import clsx from 'clsx'
import imagePlaceHolder from '@/images/imagePlaceHolder.svg'
import useTranslation from '@/hooks/useTranslation'

interface SingleImageUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  isRequired?: boolean
  error?: string
  label?: string | translationElement
  rootClassName?: string
  defaultImage?: string
}

const SingleImageUpload = ({
  control,
  name,
  isRequired,
  label,
  error,
  rootClassName,
  defaultImage,
}: SingleImageUploadProps) => {
  // Use array because the library forces an array of ImageType
  const [uploadedPicture, setUploadedPicture] = useState<ImageListType>([])
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
    <div className={clsx('flex flex-col gap-2 z-10', rootClassName)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-brand-500">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ImageUploading
            multiple={false}
            value={field.value || undefined}
            onChange={(imageList: ImageListType) => {
              setUploadedPicture(imageList)
              field.onChange(imageList[0])
            }}
          >
            {({ onImageUpload, onImageRemoveAll, isDragging, dragProps, errors }) => (
              <>
                <div
                  className={clsx(
                    'flex flex-col items-center justify-center gap-4 h-fit w-fit rounded p-2 bg-brand-50',
                    {
                      'bg-brand-200': isDragging,
                    }
                  )}
                  {...dragProps}
                >
                  <div
                    className="flex flex-col p-2 relative cursor-pointer w-52 h-32 rounded border-2 border-dashed border-brand-200"
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
                    {(uploadedPicture.length !== 0 && uploadedPicture[0].dataURL) ||
                    defaultImage ? (
                      <Image
                        className="bg-brand-200 border-2 border-brand-400 rounded w-52 h-32"
                        src={uploadedPicture[0]?.dataURL ?? defaultImage ?? imagePlaceHolder}
                        style={{
                          objectFit: 'contain',
                        }}
                        fill
                        alt="PP"
                        sizes="(max-width: 768px) 40vw,
                        (max-width: 1200px) 50vw,
                        60vw"
                        placeholder="blur"
                        blurDataURL={
                          uploadedPicture[0]?.dataURL ?? defaultImage ?? imagePlaceHolder
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                        <Image src={imagePlaceHolder} alt="Placeholder" />
                        <p className="text-xs">{t.Forms.imageUpload.dropImageHere}</p>
                      </div>
                    )}
                  </div>
                  {uploadedPicture.length !== 0 && (
                    <button
                      className="text-xs text-error-dark font-bold"
                      onClick={() => {
                        onImageRemoveAll()
                        field.onChange(null)
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
      ></Controller>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}

export default SingleImageUpload

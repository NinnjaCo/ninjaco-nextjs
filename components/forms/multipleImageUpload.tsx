import { Control, Controller } from 'react-hook-form'
import Image from 'next/image'
import ImageUploading, { ErrorsType, ImageListType, ImageType } from 'react-images-uploading'
import React, { useState } from 'react'
import clsx from 'clsx'
import imagePlaceHolder from '@/images/imagePlaceHolder.svg'

interface MultipleImageUploadProps {
  control: Control<any>
  name: string
  isRequired?: boolean
  error?: string
  label?: string
  rootClassName?: string
}

const MultipleImageUpload = ({
  control,
  name,
  isRequired,
  label,
  error,
  rootClassName,
}: MultipleImageUploadProps) => {
  // Use array because the library forces an array of ImageType
  const [uploadedPictures, setUploadedPictures] = useState<ImageListType>([])

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
            multiple={true}
            value={field.value || undefined}
            onChange={(imageList: ImageListType) => {
              setUploadedPictures(imageList)
              field.onChange(imageList)
            }}
          >
            {({
              onImageUpload,
              onImageRemoveAll,
              isDragging,
              onImageUpdate,
              dragProps,
              onImageRemove,
              errors,
            }) => (
              <>
                <div
                  {...dragProps}
                  className={clsx(
                    'flex flex-col items-center justify-center gap-4 h-fit w-fit rounded p-2 bg-brand-50',
                    {
                      'bg-brand-200': isDragging,
                    }
                  )}
                >
                  <div
                    className={clsx(
                      'flex flex-col p-2 relative cursor-pointer w-64 h-44 rounded border-2 border-dashed border-brand-200',
                      {
                        'bg-brand-300': isDragging,
                      }
                    )}
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
                    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                      <Image src={imagePlaceHolder} alt="Placeholder" />
                      <p className="text-xs">Drop image here | Click</p>
                    </div>
                  </div>
                  {uploadedPictures.length !== 0 && (
                    <button
                      className="text-xs text-error-dark font-bold"
                      onClick={() => {
                        onImageRemoveAll()
                        field.onChange(null)
                      }}
                    >
                      Remove All
                    </button>
                  )}
                  {errors && (
                    <p className="text-xs text-error-dark font-bold">
                      {getImageUploadErrorMessage(errors)}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 w-full flex-wrap">
                  {uploadedPictures.map((image: ImageType, index: number) => {
                    return (
                      image.dataURL && (
                        <div key={index} className="relative">
                          <Image
                            src={image.dataURL}
                            alt="Uploaded Image"
                            width={150}
                            height={150}
                            style={{
                              objectFit: 'cover',
                            }}
                            className="rounded"
                          />
                          <button
                            className="absolute top-1 left-1 p-1 rounded-full bg-error-dark text-white"
                            onClick={() => {
                              onImageRemove(index)
                              // remove only the deleted iamge from the array
                              field.onChange(
                                field.value?.filter((image: ImageType, i: number) => i !== index)
                              )
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-2 w-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )
                    )
                  })}
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

export default MultipleImageUpload

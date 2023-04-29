/* eslint-disable jsx-a11y/anchor-has-content */
import { Course } from '@/models/crud/course.model'
import { LevelEnrollment } from '@/models/crud/level-enrollment.model'
import { Mission } from '@/models/crud/mission.model'
import { Tab } from '@headlessui/react'
import { User } from '@/models/crud'
import { useState } from 'react'
import ArduinoBlockly from './arduinoBlockly'
import ArduinoBuildingParts from './arduinoBuildingParts'
import ArduinoStepByStepGuide from './arduinoStepByStepGuide'
import React from 'react'
import useTranslation from '@/hooks/useTranslation'

interface Props {
  course: Course
  level: LevelEnrollment
  mission: Mission
  user: User
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ArduinoLevel = ({ course, level, mission, user }: Props) => {
  const t = useTranslation()
  const [tabs] = useState([
    {
      name: t.User.arduinoLevel.buildingPart as string,
      component: () => (
        <ArduinoBuildingParts
          buildingPartsImages={level.level.buildingPartsImages ?? []}
        ></ArduinoBuildingParts>
      ),
    },
    {
      name: t.User.arduinoLevel.stepByStep as string,
      component: () => (
        <ArduinoStepByStepGuide
          stepByStepImages={level.level.stepGuideImages ?? []}
        ></ArduinoStepByStepGuide>
      ),
    },
    {
      name: 'Code',
      component: () => (
        <ArduinoBlockly
          level={level}
          course={course}
          mission={mission}
          user={user}
        ></ArduinoBlockly>
      ),
    },
  ])

  return (
    <div className="w-full h-full relative hidden lg:block overflow-hidden">
      <div className="w-full h-full flex flex-col items-center relative">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-lg bg-brand-50 p-1 gap-4 w-fit absolute top-2  z-40">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-1 text-xs font-medium leading-5 whitespace-nowrap',
                    selected
                      ? 'bg-white shadow p-2'
                      : 'bg-brand-50 hover:bg-brand-100 px-2 text-brand-500/50'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="w-full h-full">
            {tabs.map((tab) => (
              <Tab.Panel key={tab.name} className="w-full h-full">
                {tab.component()}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default ArduinoLevel

/* eslint-disable jsx-a11y/anchor-has-content */
import { Course } from '@/models/crud/course.model'
import { Level } from '@/models/crud/level.model'
import { Mission } from '@/models/crud/mission.model'
import { Tab } from '@headlessui/react'
import { useState } from 'react'
import ArduinoBlockly from './arduinoBlockly'
import ArduinoBuildingParts from './arduinoBuildingParts'
import ArduinoStepByStepGuide from './arduinoStepByStepGuide'
import React from 'react'

interface Props {
  course: Course
  level: Level
  mission: Mission
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ArduinoLevel = ({ course, level, mission }: Props) => {
  const [tabs] = useState([
    {
      name: 'Building Parts',
      component: () => (
        <ArduinoBuildingParts
          buildingPartsImages={level.buildingPartsImages ?? []}
        ></ArduinoBuildingParts>
      ),
    },
    {
      name: 'Step by Step Guide',
      component: () => (
        <ArduinoStepByStepGuide
          stepByStepImages={level.stepGuideImages ?? []}
        ></ArduinoStepByStepGuide>
      ),
    },
    {
      name: 'Code',
      component: () => (
        <ArduinoBlockly level={level} course={course} mission={mission}></ArduinoBlockly>
      ),
    },
  ])

  return (
    <div className="w-full h-full relative hidden lg:block">
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

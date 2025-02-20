'use client'

import Image from 'next/image'
import { achievements } from '@/data/achievement'
import type { Achievement } from '@/types/types'

export default function Achievements() {
  return (
    <>
      <div className='flex flex-col gap-4'>
        <h2>実績</h2>
        <div className='flex gap-4'>
          {achievements.map((achievement: Achievement) => (
            <div
              key={achievement.id}
              className='rounded border-2 border-gray-200 bg-muted p-4'
            >
              <div className='relative aspect-video w-60 rounded-sm border-2 border-muted'>
                <Image
                  src={achievement.imageSrc}
                  alt={achievement.alt}
                  fill
                  className='rounded-sm object-cover object-top'
                />
              </div>
              <div className='my-2 text-sm font-semibold'>
                {achievement.title}
              </div>
              <div className='font-mono text-xs'>{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

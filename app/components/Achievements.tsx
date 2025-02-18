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
            <div className='aspect-video rounded-sm'>
              <Image
                src={achievement.imageSrc}
                alt={achievement.alt}
                width={240}
                height={240}
                className='rounded-sm' 
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

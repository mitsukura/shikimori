'use client'

import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'
import { Avatar, AvatarFallback, AvatarImage } from './Avatoar'
import { IconUser } from '@tabler/icons-react'

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent(current + 1)
      }
    }, 4000)
  }, [api, current])

  return (
    <div className='w-full py-10 lg:py-20'>
      <div className='mx-auto'>
        <div className='flex flex-col gap-10'>
          <h2 className='mx-auto text-center text-3xl font-bold tracking-tighter md:text-5xl lg:max-w-3xl px-10'>
            多くの市民の方々から、もう一度お願いしたいというご希望も寄せられています
          </h2>
          <Carousel setApi={setApi} className='w-full'>
            <CarouselContent>
              {Array.from({ length: 15 }).map((_, index) => {
                const uniqueKey = `testimonial-${index}-${Math.random().toString(36).substring(2, 9)}`
                return (
                  <CarouselItem className='lg:basis-1/2' key={uniqueKey}>
                    <div className='flex aspect-video h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2'>
                      <IconUser className='h-8 w-8 stroke-1' />
                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-col'>
                          <h3 className='text-xl tracking-tight'>丁寧な仕事</h3>
                          <p className='max-w-xs text-base text-muted-foreground'>
                            定期的な駐車場除雪と、施設内除草をお願いしています。時間通りに丁寧な仕事に感謝しております。
                          </p>
                        </div>
                        <p className='flex flex-row items-center gap-2 text-sm'>
                          <span className='text-muted-foreground'>By</span>{' '}
                          <Avatar className='h-6 w-6'>
                            <AvatarImage src='https://github.com/shadcn.png' />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <span>株式会社雪草 秋田営業所 所長 山田 花子</span>
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  )
}

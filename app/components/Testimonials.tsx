"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatoar";
import { IconUser } from "@tabler/icons-react";

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);
  }, [api, current]);

  return (
    <div className="w-full py-10 lg:py-20">
      <div className="mx-auto">
        <div className="flex flex-col gap-10">
          <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-bold text-center mx-auto">
            多くの市民からまたお願いしたいと希望されています
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {Array.from({ length: 15 }).map((_, index) => {
                // ユニークなキーを生成
                const uniqueKey = `testimonial-${index}-${Math.random().toString(36).substring(2, 9)}`;
                return (
                <CarouselItem className="lg:basis-1/2" key={uniqueKey}>
                  <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-video flex justify-between flex-col">
                    <IconUser className="w-8 h-8 stroke-1" />
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl tracking-tight">
                          丁寧な仕事
                        </h3>
                        <p className="text-muted-foreground max-w-xs text-base">
                          定期的な駐車場除雪と、施設内除草をお願いしています。時間通りに丁寧な仕事に感謝しております。
                        </p>
                      </div>
                      <p className="flex flex-row gap-2 text-sm items-center">
                        <span className="text-muted-foreground">By</span>{" "}
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span>株式会社雪草 秋田営業所 所長 山田 花子</span>
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

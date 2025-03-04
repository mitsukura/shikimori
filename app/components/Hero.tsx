'use client'

export default function Hero() {
  return (
    <>
      <div className='flex flex-col justify-center gap-4'>
        <h2 className='text-lg font-bold'>四季守メニュー</h2>
        <div className=''>
          <div className='group flex gap-4 rounded-xl border-2 border-green-200/30 bg-muted p-6 shadow-sm duration-500 hover:border-green-300 hover:shadow-lg'>
            <div className='flex aspect-square h-20 w-20 items-center justify-center rounded-md border-2 border-primary-foreground bg-green-200 transition-all duration-500 hover:bg-muted/50 hover:text-muted-foreground group-hover:rotate-[10deg] group-hover:scale-[110%]'>
              画像
            </div>
            <div className='flex flex-col justify-center gap-2'>
              <h2 className='text-md font-bold'>
                ローダー除雪とダンプ排雪サービス
              </h2>
              <p className='text-sm text-muted-foreground'>
                四季守では、秋田県内の、ローダー除雪、排雪の予約ができます。
              </p>
              <p className='text-xs text-muted-foreground'>
                実施期間：2024年10月1日〜2025年03月31日
              </p>
              <p className='text-xs text-muted-foreground'>
                料金：¥50,000〜/hour( 要お見積り)
              </p>
              <p className='text-xs text-muted-foreground'>募集：受付中</p>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='group flex gap-4 rounded-xl border bg-muted p-6 shadow-sm duration-500 hover:shadow-lg'>
            <div className='flex aspect-square h-20 w-20 items-center justify-center rounded-md border-2 border-primary-foreground bg-green-200 transition-all duration-500 hover:bg-primary hover:text-primary-foreground group-hover:rotate-[10deg] group-hover:scale-[105%]'>
              画像
            </div>
            <div className='flex flex-col justify-center gap-2'>
              <h2 className='text-md font-bold'>重機での草刈り(準備中)</h2>
              <p className='text-sm text-muted-foreground'>
                四季守では、秋田県内の、重機での草刈りの予約ができます。
              </p>
              <p className='text-xs text-muted-foreground'>
                実施期間：2025年4月1日〜2025年10月31日
              </p>
              <p className='text-xs text-muted-foreground'>
                料金：¥50,000〜/hour( 要お見積り)
              </p>
              <p className='text-xs text-muted-foreground'>
                募集：2025年3月から予約受け付け予定
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

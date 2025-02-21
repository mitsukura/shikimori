export default function Page() {
  return (
    <div className='container mx-auto'>
      <div className='flex flex-col items-center justify-center gap-4 p-4 mt-10'>
        <div className='w-full max-w-2xl min-h-[721px]'>
          <iframe
            src='https://docs.google.com/forms/d/e/1FAIpQLScowb6DWlv0-vd6dkzcpeQaPmMoIP6rq601Q4x14CHgt4TxNQ/viewform?embedded=true'
            className='w-full h-full min-h-[721px]'
            title='お問い合わせフォーム'
            style={{ border: 'none' }}
          >
            読み込んでいます…
          </iframe>
        </div>
      </div>
    </div>
  )
}
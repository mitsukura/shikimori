export default function Procedure() {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold mb-2'>雪かき、草刈りサービスの利用方法</h2>
      <ol className='list-decimal list-inside space-y-4'>
        <li>
          <span className='font-bold'>サービスを選ぶ</span>
          <p className='ml-6 mt-1'>まず、雪かき（冬期間）か草刈り（夏期間）のどちらをお願いしたいか選びます。</p>
        </li>
        <li>
          <span className='font-bold'>ユーザー登録</span>
          <p className='ml-6 mt-1'>サービスを選んだら、初めのみお名前や住所、作業場所などを登録します。これは、あなたのお家や連絡先を教えてもらうためです。</p>
        </li>
        <li>
          <span className='font-bold'>注文と支払い</span>
          <p className='ml-6 mt-1'>住所の登録が終わったら、雪かきや草刈りをしてほしい日時を選びます。日時が決まったら、料金を支払います。現在は。クレジットカードのみです。</p>
        </li>
        <li>
          <span className='font-bold'>サービス当日</span>
          <p className='ml-6 mt-1'>予約した日時に、専門の業者があなたの家に来て、雪かきや草刈りをしてくれます。</p>
        </li>
        <li>
          <span className='font-bold'>完了</span>
          <p className='ml-6 mt-1'>作業が終わったら、確認をして完了となります。</p>
        </li>
      </ol>
      <h2 className='text-2xl font-bold mb-2'>ポイント</h2>
      <ul className='list-disc list-inside space-y-4'>
        <li>登録や注文は、スマホやパソコンから簡単にできます。</li>
        <li>わからないことがあれば、いつでも質問できます。</li>
      </ul>
      <h2 className='text-2xl font-bold mb-2'>注意事項</h2>
      <ul className='list-disc list-inside space-y-4'>
        <li>雪かきや草刈りの料金は、予約日によって変わる場合があります。</li>
        <li>予約が込み合っている場合は、希望の日時に予約できないことがあります。</li>
      </ul>
    </div>
  )
}
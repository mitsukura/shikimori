export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">特定商取引法に基づく表記</h1>

      <div className="space-y-8">
        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">事業者の名称</h2>
          <p>株式会社シキモリ</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">代表者名</h2>
          <p>代表取締役 山田 太郎</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">所在地</h2>
          <p>〒100-0001</p>
          <p>東京都千代田区千代田1-1-1</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">お問い合わせ先</h2>
          <p>電話番号：03-1234-5678</p>
          <p>メールアドレス：shikimori@gmail.jp</p>
          <p>受付時間：平日9:00〜18:00（土日祝日・年末年始を除く）</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">提供するサービス</h2>
          <ul className="list-disc ml-6">
            <li>除雪サービス</li>
            <li>除草サービス</li>
          </ul>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">料金</h2>
          <p className="mb-2">除雪サービス：</p>
          <ul className="list-disc ml-6 mb-4">
            <li>基本料金：5,000円（税込）/ 1時間</li>
            <li>深夜料金（22:00〜5:00）：7,500円（税込）/ 1時間</li>
            <li>最低料金：5,000円（税込）</li>
          </ul>
          <p className="mb-2">除草サービス：</p>
          <ul className="list-disc ml-6">
            <li>基本料金：4,000円（税込）/ 1時間</li>
            <li>最低料金：4,000円（税込）</li>
          </ul>
          <p className="mt-4 text-sm">※面積や状況により料金が変動する場合がございます。</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">支払方法</h2>
          <ul className="list-disc ml-6">
            <li>クレジットカード決済（VISA, MasterCard, JCB, American Express）</li>
            <li>銀行振込</li>
            <li>現金払い</li>
          </ul>
          <p className="mt-2 text-sm">※銀行振込の場合、振込手数料はお客様負担となります。</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">サービス提供時期</h2>
          <p className="mb-2">除雪サービス：</p>
          <ul className="list-disc ml-6 mb-4">
            <li>原則として、降雪後24時間以内に作業を開始</li>
            <li>緊急対応は別途料金にて24時間受付</li>
          </ul>
          <p className="mb-2">除草サービス：</p>
          <ul className="list-disc ml-6">
            <li>ご予約日の指定時間に作業を実施</li>
            <li>荒天時は、お客様と相談の上で日程を変更</li>
          </ul>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">キャンセルポリシー</h2>
          <ul className="list-disc ml-6">
            <li>前日までのキャンセル：無料</li>
            <li>当日キャンセル：料金の50%</li>
            <li>作業開始後のキャンセル：料金の100%</li>
          </ul>
        </div>

        <div className="border-b pb-4">
          <h2 className="font-semibold mb-2">返品・返金について</h2>
          <p>サービスの性質上、返品は承っておりません。</p>
          <p>作業内容に不備があった場合は、無償で補修対応いたします。</p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">その他の特記事項</h2>
          <ul className="list-disc ml-6">
            <li>作業に必要な電気・水道は、お客様のものを使用させていただきます。</li>
            <li>特殊な作業や機材が必要な場合は、別途料金が発生する場合があります。</li>
            <li>当社が責任を負うべき事由により損害が生じた場合、実際に生じた直接の損害に限り補償いたします。</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
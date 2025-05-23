import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシー・ポリシー | 四季守',
  description: '当社のプライバシー・ポリシーを説明します。',
};

export default function Page() {

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 prose prose-sm dark:prose-invert">
      <h1 className="heading2">プライバシー・ポリシー</h1>
      
      <div>
        <section>
          <h2>1. 個人情報の取得について</h2>
          <p>当社は、サービスの提供にあたり、以下の個人情報を取得いたします：</p>
          <ul>
            <li>氏名</li>
            <li>メールアドレス</li>
            <li>電話番号</li>
            <li>住所</li>
            <li>写真データ</li>
          </ul>
        </section>

        <section>
          <h2>2. 個人情報の利用目的</h2>
          <p>取得した個人情報は、以下の目的で利用いたします：</p>
          <ul>
            <li>サービスの提供および運営</li>
            <li>ご本人確認</li>
            <li>お問い合わせへの対応</li>
            <li>サービスの品質向上</li>
            <li>重要なお知らせの送信</li>
          </ul>
        </section>

        <section>
          <h2>3. 個人情報の管理</h2>
          <p>当社は、お客様の個人情報を適切に管理し、以下を徹底します：</p>
          <ul>
            <li>個人情報への不正アクセス防止のための措置</li>
            <li>個人情報の紛失、破壊、改ざん防止のための措置</li>
            <li>その他の安全管理措置</li>
          </ul>
        </section>

        <section>
          <h2>4. 個人情報の共有</h2>
          <p>当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません：</p>
          <ul>
            <li>お客様の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要な場合</li>
          </ul>
        </section>

        <section>
          <h2>5. 個人情報の開示・訂正・削除・停止</h2>
          <p>お客様は、当社が保有する個人情報について、開示、訂正、削除を請求することができます。その場合は、当社所定の方法にてご連絡ください。</p>
        </section>

        <section>
          <h2>6. お問い合わせ窓口</h2>
          <p>個人情報の取扱いに関するお問い合わせは、以下の窓口までご連絡ください：</p>
          <div>
            <p>メールアドレス：[shikimori@gmail.jp]</p>
            <p>受付時間：平日9:00〜18:00（土日祝日・年末年始を除く）</p>
          </div>
        </section>

        <section>
          <h2>7. プライバシーポリシーの変更</h2>
          <p>当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更した場合は、当ウェブサイトでお知らせいたします。</p>
        </section>

        <div>
          <p>制定日：2025年2月20日</p>
        </div>
      </div>
    </div>
  )
}
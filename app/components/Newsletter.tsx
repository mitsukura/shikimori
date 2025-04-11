import { NewsletterForm } from "./Newsletter-form";

export default function Newsletter() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center"> 
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              最新情報をお届けします
            </h2>
            <p className="max-w-[768px] text-muted-foreground md:text-sm/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
              四季守の最新ニュースや季節のお知らせ、地域情報などをお届けします。
              いつでも登録解除できます。
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
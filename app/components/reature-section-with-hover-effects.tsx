import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "法人顧客向け",
      description:
        "法人顧客向けの専門的な管理・コンサルティングサービス",
      icon: <IconTerminal2 />,
    },
    {
      title: "大規模施設向け",
      description:
        "大規模施設の管理に特化",
      icon: <IconEaseInOut />,
    },
    {
      title: "環境保全",
      description:
        "環境保全に配慮した庭園管理とエコフレンドリーな手法の導入",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "エコフレンドリー",
      description: "自然志向の顧客ニーズに対応したサービス展開",
      icon: <IconCloud />,
    },
    {
      title: "個人宅向け",
      description: "個人宅向けの定期的な管理サービスと生活支援サービスとの連携",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "会員制サービス",
      description:
        "会員制サービスによる継続的な顧客関係の構築",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "季節に応じたケア",
      description: "季節に応じた細やかなケアと暮らしのトータルサポート",
      icon: <IconHeart />,
    },
  ];
  return (
    <div className="container mx-auto px-10 mt-40">
      <h2 className="text-5xl font-bold tracking-tighter text-center">サービスの特徴</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature dark:border-neutral-800",
        "w-full", // モバイルで全幅
        "lg:w-auto lg:border-r", // デスクトップでは元のスタイル
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/ja'; // 日本語ロケールのFakerを使用

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- ユーザーデータの生成と挿入 ---
  const usersData: Prisma.UserCreateInput[] = [];
  for (let i = 1; i <= 30; i++) {
    const isAdmin = i <= 3; // 最初の3人を管理者とする
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(); // 一意性を高めるため小文字に
    const clerkId = `user_test_${String(i).padStart(3, '0')}`;

    usersData.push({
      // id: Prismaが自動生成 (UUID)
      clerkId: clerkId,
      isAdmin: isAdmin,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: Math.random() < 0.7 ? `090-${faker.string.numeric(4)}-${faker.string.numeric(4)}` : undefined, // 約70%で電話番号を設定
      bio: Math.random() < 0.5 ? faker.lorem.sentence() : undefined, // 約50%でBioを設定
      address: Math.random() < 0.6 ? faker.location.streetAddress(true) : undefined, // 約60%で住所を設定
      // createdAt, updatedAt: Prismaが自動設定
    });
  }

  // createManyで一括挿入 (エラーがあればスキップ)
  // 注意: email/clerkIdが重複するとエラーになる可能性あり。シーケンスで生成しているので通常は問題ないはず。
  console.log(`Seeding ${usersData.length} users...`);
  const createdUsers = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true, // 重複エラーをスキップする場合（開発初期に便利）
  });
  console.log(`Seeded ${createdUsers.count} users.`);


  // --- 商品データの生成と挿入 ---
  const itemCategories = ['除雪', '排雪', '草刈り', '剪定', 'その他'];
  const itemsData: Prisma.ItemCreateInput[] = [];
  for (let i = 1; i <= 30; i++) {
    const category = faker.helpers.arrayElement(itemCategories);
    let name = '';
    switch (category) {
      case '除雪': name = faker.helpers.arrayElement(['標準ローダー除雪', '広範囲除雪', '屋根雪下ろし']); break;
      case '排雪': name = faker.helpers.arrayElement(['軽トラック排雪', '2tダンプ排雪', '4tダンプ排雪']); break;
      case '草刈り': name = faker.helpers.arrayElement(['庭 草刈り', '空き地 草刈り', '法面 草刈り']); break;
      case '剪定': name = faker.helpers.arrayElement(['低木剪定', '高木剪定', '生垣剪定']); break;
      default: name = faker.commerce.productName(); break;
    }
    name += ` (${faker.number.int({ min: 1, max: 5 })}時間)`; // 例として時間を追加

    const isAvailable = i <= 25; // 最初の25件を販売可能に

    itemsData.push({
      // id: Prismaが自動生成 (UUID)
      name: name,
      description: Math.random() < 0.7 ? faker.lorem.paragraph() : undefined, // 約70%で説明を設定
      price: new Prisma.Decimal(faker.commerce.price({ min: 1000, max: 50000, dec: 0 })), // Decimal型で価格を設定
      imageUrl: Math.random() < 0.6 ? faker.image.urlLoremFlickr({ category: 'nature' }) : undefined, // 約60%で画像URL設定
      category: category,
      isAvailable: isAvailable,
      stock: isAvailable ? faker.number.int({ min: 0, max: 50 }) : 0,
      // createdAt, updatedAt: Prismaが自動設定
    });
  }

  console.log(`Seeding ${itemsData.length} items...`);
  const createdItems = await prisma.item.createMany({
    data: itemsData,
    skipDuplicates: true, // 商品名等で重複する可能性は低いが念のため
  });
  console.log(`Seeded ${createdItems.count} items.`);


  console.log("Seeding finished.");
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

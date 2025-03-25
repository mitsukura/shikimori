-- サンプルデータ挿入SQL

-- usersテーブルのサンプルデータ
INSERT INTO users (is_admin, first_name, last_name, email, phone) VALUES
(TRUE, '太郎', '山田', 'taro.yamada@example.com', '090-1234-5678'),
(FALSE, '花子', '佐藤', 'hanako.sato@example.com', '080-8765-4321'),
(FALSE, '一郎', '鈴木', 'ichiro.suzuki@example.com', '070-2345-6789');

-- itemsテーブルのサンプルデータ
INSERT INTO items (name, description, price, image_url, category, is_available, stock) VALUES
('ローダー除雪サービス', '四季守では、秋田県内の、ローダー除雪、排雪の予約ができます。', 50000.00, '/images/snow-removal.jpg', '除雪', TRUE, 10),
('ダンプ排雪サービス', '積もった雪をダンプで効率的に排雪します。', 75000.00, '/images/snow-dumping.jpg', '除雪', TRUE, 5),
('庭木の剪定', 'プロによる庭木の剪定サービスです。', 30000.00, '/images/garden-pruning.jpg', '庭園', TRUE, 20),
('草刈りサービス', '広い敷地の草刈りを効率的に行います。', 25000.00, '/images/grass-cutting.jpg', '庭園', TRUE, 15),
('害虫駆除', '家屋や庭の害虫を安全に駆除します。', 35000.00, '/images/pest-control.jpg', '害虫', TRUE, 8);

-- mapsテーブルのサンプルデータ
INSERT INTO maps (address, name, image) VALUES
('秋田県秋田市中央1-1-1', '秋田市中央公園', '/images/map1.jpg'),
('秋田県横手市横手町1-2-3', '横手市役所前', '/images/map2.jpg'),
('秋田県大仙市大曲上栄町1-3-5', '大曲駅前広場', '/images/map3.jpg');

-- paymentsテーブルのサンプルデータ
INSERT INTO payments (method, status, stripe_intent_id, stripe_authorized_amount) VALUES
('credit_card', 'completed', 'pi_1234567890', 50000.00),
('bank_transfer', 'pending', NULL, 75000.00),
('credit_card', 'completed', 'pi_0987654321', 30000.00);

-- ordersテーブルのサンプルデータ
-- 注意: payment_idとmap_idは後で更新する必要があります
INSERT INTO orders (user_id, status) VALUES
(1, 'completed'),
(2, 'pending'),
(3, 'processing');

-- 外部キーの更新
UPDATE orders SET payment_id = 1, map_id = 1 WHERE id = 1;
UPDATE orders SET payment_id = 2, map_id = 2 WHERE id = 2;
UPDATE orders SET payment_id = 3, map_id = 3 WHERE id = 3;

-- paymentsテーブルの外部キー更新
UPDATE payments SET order_id = 1 WHERE id = 1;
UPDATE payments SET order_id = 2 WHERE id = 2;
UPDATE payments SET order_id = 3 WHERE id = 3;

-- order_itemsテーブルのサンプルデータ
INSERT INTO order_items (order_id, item_id, quantity, price_at_order) VALUES
(1, 1, 1, 50000.00),
(2, 2, 1, 75000.00),
(3, 3, 2, 30000.00),
(1, 4, 1, 25000.00);

-- refundsテーブルのサンプルデータ
INSERT INTO refunds (payment_id, amount) VALUES
(1, 10000.00);

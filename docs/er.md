## ER図

```mermaid
erDiagram

%% エンティティ定義
users ||--o{ orders : "注文"
orders ||--|| map_info : "作業場所"
orders ||--|| payments : "支払い"

%% エンティティ詳細
users {
  int id PK
  boolean is_admin
  string first_name
  string last_name
  string email
  string phone
  date created_at
  date updated_at
}

orders {
  int id PK
  int user_id FK
  int map_id FK
  int payment_id FK
  date order_date
  string status
  date created_at
  date updated_at
}

map_info {
  int id PK
  int order_id FK
  string address
  string map_name
  string site_image
  float latitude
  float longitude
  date created_at
  date updated_at
}

payments {
  int id PK
  int order_id FK
  string payment_method
  float amount
  date payment_date
  date created_at
  date updated_at
}
```
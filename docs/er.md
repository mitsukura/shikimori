## ER 図

```mermaid
erDiagram

%% エンティティ定義
users ||--o{ orders : "注文"
orders ||--|| maps : "作業場所"
orders ||--|| payments : "支払い"
payments ||--|| refunds : "返金"

%% エンティティ詳細
users {
  int id PK
  boolean is_admin
  string first_name
  string last_name
  string email
  string phone
  date createdAt
  date updatedAt
}

orders {
  int id PK
  int user_id FK
  int map_id FK
  int payment_id FK
  date order_date
  enum status
  date createdAt
  date updatedAt
}

maps{
  int id PK
  int order_id FK
  string address
  string name
  string image
  date createdAt
  date updatedAt
}

refunds {
  int id PK
  int order_id FK
  number amount
  date refundAt
  date createdAt
  date updatedAt
}


payments {
  int id PK
  int order_id FK
  enum method
  enum status
  string stripe_intent_id
  number stripe_authorized_amount
  string stripe_authorizer_id
  number stripe_captured_amount
  string stripe_capturedAt
  date createdAt
  date updatedAt
}

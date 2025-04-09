import ItemTableWrapper from './components/ItemTableWrapper';

export default function AdminItemsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">商品管理</h1>
      <ItemTableWrapper />
    </div>
  );
}

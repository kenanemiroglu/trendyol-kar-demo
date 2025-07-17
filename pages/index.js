import { useState, useEffect } from "react";

export default function Home() {
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [commission, setCommission] = useState(20);
  const [shipping, setShipping] = useState(0);
  const [cost, setCost] = useState(0);
  const [products, setProducts] = useState([]);

  const ciro = price * quantity;
  const komisyon = (ciro * commission) / 100;
  const kargo = shipping * quantity;
  const maliyet = cost * quantity;
  const netKar = ciro - komisyon - kargo - maliyet;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.content || []);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-4">Trendyol Kâr Hesaplama</h1>
        <div className="grid gap-3">
          <Input label="Satış Fiyatı (TL)" value={price} onChange={setPrice} />
          <Input label="Satış Adedi" value={quantity} onChange={setQuantity} />
          <Input label="Komisyon (%)" value={commission} onChange={setCommission} />
          <Input label="Kargo Ücreti (TL)" value={shipping} onChange={setShipping} />
          <Input label="Ürün Maliyeti (TL)" value={cost} onChange={setCost} />
        </div>
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <Result label="Ciro" value={ciro} />
          <Result label="Komisyon" value={komisyon} />
          <Result label="Kargo Gideri" value={kargo} />
          <Result label="Toplam Maliyet" value={maliyet} />
          <Result label="Net Kâr" value={netKar} highlight />
        </div>
        <div className="mt-6">
          <h2 className="font-medium mb-2">Demo Ürünler</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm">
            {products.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block text-sm">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full px-3 py-2 rounded border border-gray-300"
      />
    </label>
  );
}

function Result({ label, value, highlight }) {
  return (
    <div className={highlight ? "font-bold text-green-600 flex justify-between" : "flex justify-between"}>
      <span>{label}</span>
      <span>{value.toFixed(2)} TL</span>
    </div>
  );
}

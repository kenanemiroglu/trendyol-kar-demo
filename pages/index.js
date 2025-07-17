<<<<<<< HEAD

// pages/index.js
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [form, setForm] = useState({
    productName: "",
    salePrice: "",
    costPrice: "",
    commissionRate: "",
    shippingCost: "",
    dailySales: ""
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("profitHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("profitHistory", JSON.stringify(history));
  }, [history]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calcResults = () => {
    const sale = parseFloat(form.salePrice);
    const cost = parseFloat(form.costPrice);
    const commission = parseFloat(form.commissionRate);
    const shipping = parseFloat(form.shippingCost);
    const qty = parseInt(form.dailySales);

    if (isNaN(sale) || isNaN(cost) || isNaN(commission) || isNaN(shipping) || isNaN(qty)) {
      return null;
    }

    const commissionCost = (sale * commission) / 100;
    const netProfit = sale - cost - commissionCost - shipping;
    const totalProfit = netProfit * qty;
    const totalCost = (commissionCost + shipping + cost) * qty;
    const profitMargin = (netProfit / sale) * 100;

    return {
      netProfit: netProfit.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      qty
    };
  };

  const handleSave = () => {
    const result = calcResults();
    if (result) {
      setHistory([...history, { date: new Date().toLocaleDateString(), totalProfit: result.totalProfit }]);
    }
  };

  const result = calcResults();

  const chartData = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        label: "Günlük Kâr (₺)",
        data: history.map((h) => h.totalProfit),
        fill: false,
        borderColor: "#4caf50",
        tension: 0.1
      }
    ]
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20, fontFamily: "Arial" }}>
      <h1>Trendyol Kâr Hesaplama</h1>
      <input name="productName" placeholder="Ürün Adı" onChange={handleChange} value={form.productName} />
      <input name="salePrice" placeholder="Satış Fiyatı (₺)" onChange={handleChange} value={form.salePrice} />
      <input name="costPrice" placeholder="Alış Fiyatı (₺)" onChange={handleChange} value={form.costPrice} />
      <input name="commissionRate" placeholder="Komisyon Oranı (%)" onChange={handleChange} value={form.commissionRate} />
      <input name="shippingCost" placeholder="Kargo Ücreti (₺)" onChange={handleChange} value={form.shippingCost} />
      <input name="dailySales" placeholder="Günlük Satış Adedi" onChange={handleChange} value={form.dailySales} />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleSave}>Hesapla ve Kaydet</button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Sonuçlar</h2>
        {result ? (
          <ul>
            <li>Net Kâr / Adet: ₺{result.netProfit}</li>
            <li>Günlük Toplam Kâr: ₺{result.totalProfit}</li>
            <li>Toplam Gider: ₺{result.totalCost}</li>
            <li>Kâr Oranı: %{result.profitMargin}</li>
          </ul>
        ) : (
          <p>Lütfen tüm alanları doldurun.</p>
        )}
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>Günlük Kâr Geçmişi</h2>
          <Line data={chartData} />
        </div>
      )}
=======
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
>>>>>>> a29b1cb796cb7a075b7425ca4b77248bc6a19066
    </div>
  );
}

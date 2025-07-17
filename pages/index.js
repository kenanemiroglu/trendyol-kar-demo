
// pages/index.js
// Son güncelleme: Deploy hatası düzeltildi

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
    </div>
  );
}

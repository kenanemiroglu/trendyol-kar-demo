export default function handler(req, res) {
  const mockProducts = [
    { id: 1, title: "Tişört - Beyaz" },
    { id: 2, title: "Kot Pantolon - Mavi" },
    { id: 3, title: "Sneaker Ayakkabı" }
  ];
  res.status(200).json({ content: mockProducts });
}

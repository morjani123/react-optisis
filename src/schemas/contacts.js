export default {
  key: 'contacts',
  title: 'Lentilles de contact',
  columns: [
    { key: 'brand', label: 'Marque principale', type: 'text', required: true },
    { key: 'subBrand', label: 'Sous-marque', type: 'text' },
    { key: 'ctype', label: 'Type', type: 'select', options: ['Toric','Spheric'] },
    { key: 'material', label: 'Matériau', type: 'text' },
    { key: 'duration', label: 'Durée de port', type: 'text' },
    { key: 'buyPrice', label: "Prix d'achat (unité/boîte)", type: 'number' },
    { key: 'sellPrice', label: 'Prix de vente (unité/boîte)', type: 'number' }
  ],
  searchBy: ['brand','subBrand','ctype','material','duration']
}

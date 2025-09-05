export default {
  key: 'frames',
  title: 'Montures',
  columns: [
    { key: 'ref', label: 'Référence', type: 'text', required: true },
    { key: 'brand', label: 'Marque', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['Optique','Solaire'] },
    { key: 'buyPrice', label: "Prix d'achat", type: 'number' },
    { key: 'sellPrice', label: 'Prix de vente', type: 'number' }
  ],
  searchBy: ['ref','brand','type']
}

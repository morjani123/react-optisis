export default {
  key: 'lensPricing',
  title: 'Tarifs des verres',
  columns: [
    { key: 'brand', label: 'Marque du verre', type: 'text', required: true },
    { key: 'vtype', label: 'Type', type: 'select', options: ['Progressif','Unifocal'] },
    { key: 'material', label: 'Matériau', type: 'select', options: ['Minéral','Organique'] },
    { key: 'index', label: 'Indice', type: 'select', options: ['1.5','1.6','1.67','1.74'] },
    { key: 'coating', label: 'Traitement', type: 'select', options: ['Anti-reflet','Anti-rayures','BlueProtect'] },
    { key: 'buyPrice', label: "Prix d'achat", type: 'number', hideInTable: true },
    { key: 'sellPrice', label: 'Prix de vente', type: 'number' }
  ],
  searchBy: ['brand','vtype','material','index','coating']
}

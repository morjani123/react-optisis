export default {
  key: 'orders',
  title: 'Commandes',
  columns: [
    { key: 'orderNo', label: 'N° commande', type: 'auto:order' },
    { key: 'clientId', label: 'Client', type: 'rel:clients', required: true },
    { key: 'orderDate', label: 'Date commande', type: 'date', required: true },
    { key: 'readyDate', label: 'Date de sortie', type: 'date' },
    { key: 'productType', label: 'Type produit', type: 'select', options: ['Monture','Verres','Lentilles','Solaire'] },
    { key: 'brand', label: 'Marque', type: 'text' },
    { key: 'ref', label: 'Référence', type: 'text' },
    { key: 'supplierId', label: 'Fournisseur', type: 'rel:suppliers' },
    { key: 'buyPrice', label: "Prix d'achat", type: 'number', hideInTable: true },
    { key: 'sellPrice', label: 'Prix de vente', type: 'number' },
    { key: 'deposit', label: 'Acompte', type: 'number' },
    { key: 'rest', label: 'Reste', type: 'number' },
    { key: 'paymentStatus', label: 'Statut paiement', type: 'select', options: ['Payé','Acompte','Impayé'] }
  ],
  searchBy: ['orderNo','productType','brand','ref']
}

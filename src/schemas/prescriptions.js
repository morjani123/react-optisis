export default {
  key: 'prescriptions',
  title: 'Ordonnances / Optométrie',
  columns: [
    { key: 'clientId', label: 'Client', type: 'rel:clients', required: true },
    { key: 'visitDate', label: 'Date visite', type: 'date', required: true },
    { key: 'odSph', label: 'OD Sph', type: 'number' },
    { key: 'odCyl', label: 'OD Cyl', type: 'number' },
    { key: 'odAxis', label: 'OD Axe', type: 'number' },
    { key: 'ogSph', label: 'OG Sph', type: 'number' },
    { key: 'ogCyl', label: 'OG Cyl', type: 'number' },
    { key: 'ogAxis', label: 'OG Axe', type: 'number' },
    { key: 'addition', label: 'Add', type: 'number' },
    { key: 'correctionType', label: 'Type de correction', type: 'select', options: ['Loin','Près','Lentilles de contact'] },
    { key: 'notes', label: 'Notes', type: 'textarea' }
  ],
  searchBy: ['correctionType','notes']
}

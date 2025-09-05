export default {
  key: 'suppliers',
  title: 'Fournisseurs',
  columns: [
    { key: 'name', label: 'Nom', type: 'text', required: true },
    { key: 'phone', label: 'Téléphone', type: 'tel' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'address', label: 'Adresse', type: 'text' }
  ],
  searchBy: ['name','phone','email','address']
}

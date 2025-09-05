export default {
  key: 'clients',
  title: 'Clients',
  columns: [
    { key: 'firstName', label: 'Prénom', type: 'text', required: true },
    { key: 'lastName', label: 'Nom', type: 'text', required: true },
    { key: 'phone', label: 'Téléphone', type: 'tel', required: true },
    { key: 'address', label: 'Adresse', type: 'text' },
    { key: 'gender', label: 'Sexe', type: 'select', options: ['Homme','Femme'] },
    { key: 'age', label: 'Âge', type: 'number' },
    { key: 'email', label: 'Email', type: 'email' },
  ],
  searchBy: ['firstName','lastName','phone','email','address']
}

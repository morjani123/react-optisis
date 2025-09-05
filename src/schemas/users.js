export default {
  key: 'users',
  title: 'Utilisateurs',
  columns: [
    { key: 'name', label: 'Nom complet', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'role', label: 'Rôle', type: 'select', options: ['Admin','Employé'], required: true },
    { key: 'password', label: 'Mot de passe', type: 'password', hideInTable: true }
  ],
  searchBy: ['name','email','role']
}

import { useState } from 'react';
import { Pencil, Trash, Key } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import { User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    branches: [{ id: '1', name: 'Main Branch' }],
    roles: [{ id: '1', code: 'ADMIN', name: 'Administrator' }],
  },
  // Add more mock users as needed
];

export default function Users() {
  const columns: Column<User>[] = [
    { key: 'username', title: 'Usuario', sortable: true },
    { key: 'name', title: 'Nombre', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    {
      key: 'roles',
      title: 'Roles',
      render: (roles) => roles.map((role: any) => role.name).join(', '),
    },
    {
      key: 'id',
      title: 'Acciones',
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-1 text-blue-600 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleChangePassword(user)}
            className="p-1 text-yellow-600 hover:text-yellow-700"
          >
            <Key className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    // Implement add user logic
    console.log('Add user');
  };

  const handleEdit = (user: User) => {
    // Implement edit user logic
    console.log('Edit user:', user);
  };

  const handleChangePassword = (user: User) => {
    // Implement change password logic
    console.log('Change password for user:', user);
  };

  const handleDelete = (user: User) => {
    // Implement delete user logic
    console.log('Delete user:', user);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
      
      <DataTable
        data={mockUsers}
        columns={columns}
        onAdd={handleAdd}
        addLabel="REGISTRAR USUARIO"
        filename="usuarios"
      />
    </div>
  );
}
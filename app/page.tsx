'use client';

import { useState, useEffect } from 'react';

import { fetchUsers, createUser, updateUser, deleteUser } from './action/users';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {

  const [users, setUsers] = useState<User[]>([]); 

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [editingUser, setEditingUser] = useState<User | null>(null);


  useEffect(() => {

    async function loadUsers() {

      const users = await fetchUsers();

      setUsers(users);
    }

    loadUsers();
  }, []);



  const handleCreateUser = async () => {

    if (!name.trim() || !email.trim()) {

      alert('Both name and email are required.');
      return;


    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

      alert('Please enter a valid email address.');
      return;


    }

    const namePattern = /^[A-Za-z\s]+$/;

    if (!namePattern.test(name)) {

      alert('Please enter a valid name (letters and spaces only)');
      return;


    }

    if (name.length > 20 ) {

      alert('Name cannot be longer than 20 characters');
      return;

    }

    if (email.length > 25 ) {

      alert('Email cannot be longer than 25 characters');
      return;

    }



    try {

      const newUser = await createUser(name, email);

      setUsers([...users, newUser]);
      setName('');
      setEmail('');

    } catch (error) {

      alert('Error creating user');

    }
  };

  const handleUpdateUser = async () => {

    if (!editingUser) return;

    try {

      const updatedUser = await updateUser(editingUser.id, name, email);

      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      alert('User updated successfully.');
      setName('');
      setEmail('');
      setEditingUser(null);

    } catch (error) {
      
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');

    if (!isConfirmed) {
      return;
    }


    try {

      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));

    } catch (error) {

      alert('Error deleting user');
    }
  };

  const handleEditUser = (user: User) => {

    setName(user.name);
    setEmail(user.email);
    setEditingUser(user);

  };

  return (


  <div className="container mx-auto p-4 bg-gray-50 min-h-screen">

    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Management</h1>


    <div className="bg-white shadow-md rounded-lg p-6 mb-6">

      <div className="flex mb-4">

        <input
          type="text"
          placeholder="Name"

          value={name}
          onChange={(e) => setName(e.target.value)}

          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />


        <input
          type="email"
          placeholder="Email"

          value={email}
          onChange={(e) => setEmail(e.target.value)}

          className="flex-1 p-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

        />

      </div>


      {editingUser ? (

        <button

          onClick={handleUpdateUser}

          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"


        >
          Update User
        </button>


      ) : (


        <button
          onClick={handleCreateUser}

          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"

        >
          Create User

        </button>


      )}

    </div>


    <ul className="bg-white shadow-md rounded-lg p-6 space-y-4">

      {users.map((user) => (

        <li key={user.id} className="flex items-center justify-between p-4 border-b border-gray-200">

          <span className="font-medium text-gray-700">{user.name}</span> 

          <span className="text-gray-500">({user.email})</span>

          <div className="flex space-x-2">


            <button

              onClick={() => handleEditUser(user)}
              className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-300"

            >
              Edit
            </button>


            <button

              onClick={() => handleDeleteUser(user.id)}

              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"

            >
              Delete
            </button>


          </div>

        </li>

      ))}

    </ul>

  </div>
  
);

}

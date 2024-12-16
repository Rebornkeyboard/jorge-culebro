"use client";
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage({onNavigate}) {
  const [userName, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //login request to API
      const response = await axios.get(`http://localhost:3000/api/users/auth/${userName}/${pass}`);
      //save user id
      localStorage.setItem('userID', response.data.id);
      //save token from server
      localStorage.setItem('token', response.data.token);
      //show dashboard after login
      onNavigate("/dashboard")
    } catch (err) {
      console.log(err);
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center ">
        <div className="mb-12 sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="truck logo"
            src="/truck.svg"
            className="mx-auto h-24 w-auto"
          />
        </div>
      
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input 
                  type="text"
                  value={userName} 
                  onChange={(e) => setUser(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password" 
                  value={pass} 
                  onChange={(e) => setPass(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

        </div>
      </div>
      </div>
    </>
  )
}

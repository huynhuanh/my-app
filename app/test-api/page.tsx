'use client';

import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState<any>(null);

  const testGetAll = async () => {
    try {
      const response = await fetch('/api/keys');
      const data = await response.json();
      setResult({ operation: 'GET /api/keys', data });
    } catch (error) {
      setResult({ operation: 'GET /api/keys', error: error.message });
    }
  };

  const testCreate = async () => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test API Key',
          description: 'Created for testing',
        }),
      });
      const data = await response.json();
      setResult({ operation: 'POST /api/keys', data });
    } catch (error) {
      setResult({ operation: 'POST /api/keys', error: error.message });
    }
  };

  const testUpdate = async () => {
    try {
      const response = await fetch('/api/keys/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated Test API Key',
          description: 'Updated for testing',
          isActive: false,
        }),
      });
      const data = await response.json();
      setResult({ operation: 'PUT /api/keys/1', data });
    } catch (error) {
      setResult({ operation: 'PUT /api/keys/1', error: error.message });
    }
  };

  const testDelete = async () => {
    try {
      const response = await fetch('/api/keys/1', {
        method: 'DELETE',
      });
      const data = await response.json();
      setResult({ operation: 'DELETE /api/keys/1', data });
    } catch (error) {
      setResult({ operation: 'DELETE /api/keys/1', error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={testGetAll}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            GET All
          </button>
          <button
            onClick={testCreate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            CREATE
          </button>
          <button
            onClick={testUpdate}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            UPDATE
          </button>
          <button
            onClick={testDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            DELETE
          </button>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{result.operation}</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiKey } from '@/lib/api-keys-store';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    key: '',
    isActive: true,
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({
    type: 'success',
    message: '',
    show: false,
  });

  // Fetch API keys
  const fetchApiKeys = async () => {
    try {
      console.log('fetchApiKeys - Fetching API keys...');
      const response = await fetch('/api/keys');
      if (response.ok) {
        const data = await response.json();
        console.log('fetchApiKeys - Received data:', data);
        setApiKeys(data);
      } else {
        console.error('fetchApiKeys - Response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Helper function to show notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Create new API key
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchApiKeys();
        setFormData({ name: '', description: '', key: '', isActive: true });
        setShowCreateForm(false);
        showNotification('success', 'API key created successfully!');
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.error || 'Failed to create API key');
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      showNotification('error', 'Network error. Please try again.');
    }
  };

  // Update API key
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey) return;

    console.log('handleUpdate - Editing key:', editingKey);
    console.log('handleUpdate - Form data:', formData);
    console.log('handleUpdate - API URL:', `/api/keys/${editingKey.id}`);

    try {
      const response = await fetch(`/api/keys/${editingKey.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchApiKeys();
        setEditingKey(null);
        setFormData({ name: '', description: '', key: '', isActive: true });
        showNotification('success', 'API key updated successfully!');
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.error || 'Failed to update API key');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
      showNotification('error', 'Network error. Please try again.');
    }
  };

  // Delete API key
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    console.log('handleDelete - Deleting key with ID:', id);
    console.log('handleDelete - API URL:', `/api/keys/${id}`);

    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchApiKeys();
        showNotification('success', 'API key deleted successfully!');
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.error || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      showNotification('error', 'Network error. Please try again.');
    }
  };

  // Toggle API key status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchApiKeys();
        showNotification('success', `API key ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.error || 'Failed to update API key status');
      }
    } catch (error) {
      console.error('Error toggling API key status:', error);
      showNotification('error', 'Network error. Please try again.');
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const startEdit = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      description: key.description,
      key: key.key,
      isActive: key.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setFormData({ name: '', description: '', key: '', isActive: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading API Keys</h3>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-3">API Keys Dashboard</h1>
              <p className="text-lg text-gray-600">Manage your API keys and access tokens with style</p>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">{apiKeys.length} API Keys</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{apiKeys.filter(key => key.isActive).length} Active</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/test-api"
                className="group inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test API
              </Link>
            <Link
              href="/"
                className="group inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300 transform hover:-translate-y-1"
            >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </Link>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className="mb-6 notification-enter">
            <div className={`relative rounded-xl p-4 flex items-center space-x-3 ${
              notification.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.type === 'success' ? 'Success!' : 'Error!'}
                </h3>
                <p className={`text-sm ${
                  notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className={`p-1 rounded-full hover:bg-opacity-20 transition-colors duration-200 ${
                  notification.type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Progress bar */}
              <div className="notification-progress"></div>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || editingKey) && (
          <div className="mb-8 card p-8 animate-slide-in">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingKey ? 'Edit API Key' : 'Create New API Key'}
                </h2>
                <p className="text-gray-600">
                  {editingKey ? 'Update your API key details' : 'Generate a new API key for your application'}
                </p>
              </div>
            </div>
            {/* Current Data Display (only when editing) */}
            {editingKey && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Current API Key Data
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">API Key</label>
                    <div className="text-sm text-blue-700 font-mono bg-blue-100 px-3 py-2 rounded">
                      {editingKey.key}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Current Status</label>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${editingKey.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${editingKey.isActive ? 'text-green-700' : 'text-red-700'}`}>
                        {editingKey.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={editingKey ? handleUpdate : handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Key Name *
                    {editingKey && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Current: {editingKey.name})
                      </span>
                    )}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder={editingKey ? `Current: ${editingKey.name}` : "Enter a descriptive name"}
                  required
                />
              </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                  Description
                    {editingKey && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Current: {editingKey.description || 'No description'})
                      </span>
                    )}
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                    className="input resize-none"
                    placeholder={editingKey ? `Current: ${editingKey.description || 'No description'}` : "Optional description for this API key"}
                  />
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700">
                  API Key *
                  {editingKey && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Current: {editingKey.key})
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="apiKey"
                    value={formData.key || ''}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="input font-mono text-sm"
                    placeholder={editingKey ? `Current: ${editingKey.key}` : "Enter your API key (e.g., sk-...)"}
                    required
                  />
                  {!editingKey && (
                    <button
                      type="button"
                      onClick={() => {
                        const generatedKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        setFormData({ ...formData, key: generatedKey });
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Generate
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {editingKey ? 'Update the API key value' : 'Enter your API key or click Generate to create one'}
                </p>
              </div>
              
              {/* Status Toggle */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                    Active Status
                    {editingKey && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Current: {editingKey.isActive ? 'Active' : 'Inactive'})
                      </span>
                    )}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="custom-checkbox"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${(formData.isActive || false) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {(formData.isActive || false) ? 'This API key is active and can be used' : 'This API key is inactive and cannot be used'}
                  </span>
                </div>
                {editingKey && editingKey.isActive !== formData.isActive && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    <strong>Status Change:</strong> {editingKey.isActive ? 'Active' : 'Inactive'} → {formData.isActive ? 'Active' : 'Inactive'}
                  </div>
                )}
              </div>

              {/* Changes Summary (only when editing) */}
              {editingKey && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Changes Summary</h4>
                  <div className="space-y-2 text-sm">
                    {editingKey.name !== formData.name && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Name:</span>
                        <span className="text-gray-500 line-through">{editingKey.name}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900 font-medium">{formData.name}</span>
                      </div>
                    )}
                    {editingKey.description !== formData.description && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Description:</span>
                        <span className="text-gray-500 line-through">{editingKey.description || 'No description'}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900 font-medium">{formData.description || 'No description'}</span>
                      </div>
                    )}
                    {editingKey.key !== formData.key && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">API Key:</span>
                        <span className="text-gray-500 line-through font-mono text-xs">{editingKey.key.substring(0, 20)}...</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900 font-medium font-mono text-xs">{formData.key.substring(0, 20)}...</span>
                      </div>
                    )}
                    {editingKey.isActive !== formData.isActive && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${editingKey.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {editingKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className={`px-2 py-1 rounded text-xs ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    )}
                    {editingKey.name === formData.name && 
                     editingKey.description === formData.description && 
                     editingKey.key === formData.key &&
                     editingKey.isActive === formData.isActive && (
                      <div className="text-gray-500 italic">No changes detected</div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{editingKey ? 'Update' : 'Create'} API Key</span>
                </button>
                <button
                  type="button"
                  onClick={editingKey ? cancelEdit : () => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Button */}
        {!showCreateForm && !editingKey && (
          <div className="mb-8 animate-fade-in">
            <button
              onClick={() => setShowCreateForm(true)}
              className="group btn-primary flex items-center space-x-3 text-lg px-8 py-4"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New API Key</span>
            </button>
          </div>
        )}

        {/* API Keys List */}
        <div className="animate-fade-in">
          {apiKeys.length === 0 ? (
            <div className="card text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No API Keys Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first API key to get started with your application integration</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                Create Your First API Key
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiKeys.map((key, index) => (
                <div key={key.id} className="card p-6 group hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{key.name}</h3>
                      </div>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(key.id, key.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                            key.isActive
                          ? 'status-active'
                          : 'status-inactive'
                          }`}
                        >
                          {key.isActive ? 'Active' : 'Inactive'}
                        </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {key.description || 'No description provided'}
                  </p>

                  {/* API Key */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono text-gray-700 truncate flex-1 mr-2">
                        {key.key.substring(0, 16)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                      >
                        {copiedKey === key.key ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(key)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                        >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(key.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                        </button>
                  </div>
                </div>
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Shared in-memory storage for API keys
// In production, you would use a database like PostgreSQL, MongoDB, etc.

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  description: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

// In-memory storage
let apiKeys: ApiKey[] = [
  // Add some sample data for testing
  {
    id: '1',
    name: 'Sample API Key',
    key: 'sk-sample1234567890abcdef1234567890abcdef1234567890',
    description: 'This is a sample API key for testing',
    createdAt: new Date().toISOString(),
    isActive: true,
  }
];

// Generate a random API key
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'sk-';
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API Key operations
export const apiKeyStore = {
  // Get all API keys
  getAll(): ApiKey[] {
    return [...apiKeys];
  },

  // Get API key by ID
  getById(id: string): ApiKey | undefined {
    return apiKeys.find(key => key.id === id);
  },

  // Create new API key
  create(data: Omit<ApiKey, 'id' | 'createdAt' | 'isActive'>): ApiKey {
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      ...data,
    };
    apiKeys.push(newApiKey);
    return newApiKey;
  },

  // Update API key
  update(id: string, updates: Partial<Omit<ApiKey, 'id' | 'createdAt'>>): ApiKey | null {
    console.log('apiKeyStore.update - Looking for ID:', id);
    console.log('apiKeyStore.update - Available IDs:', apiKeys.map(k => k.id));
    
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    console.log('apiKeyStore.update - Found index:', keyIndex);
    
    if (keyIndex === -1) {
      console.log('apiKeyStore.update - API key not found');
      return null;
    }

    apiKeys[keyIndex] = { ...apiKeys[keyIndex], ...updates };
    console.log('apiKeyStore.update - Updated API key:', apiKeys[keyIndex]);
    return apiKeys[keyIndex];
  },

  // Delete API key
  delete(id: string): boolean {
    console.log('apiKeyStore.delete - Looking for ID:', id);
    console.log('apiKeyStore.delete - Available IDs:', apiKeys.map(k => k.id));
    
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    console.log('apiKeyStore.delete - Found index:', keyIndex);
    
    if (keyIndex === -1) {
      console.log('apiKeyStore.delete - API key not found');
      return false;
    }

    apiKeys.splice(keyIndex, 1);
    console.log('apiKeyStore.delete - API key deleted successfully');
    return true;
  },
};

import { NextRequest, NextResponse } from 'next/server';
import { apiKeyStore } from '@/lib/api-keys-store';

// GET /api/keys - Fetch all API keys
export async function GET() {
  try {
    const apiKeys = apiKeyStore.getAll();
    console.log('GET /api/keys - All API keys:', apiKeys);
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('GET /api/keys - Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, key } = body;

    console.log('POST /api/keys - Body:', body);

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!key) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 400 }
      );
    }

    const newApiKey = apiKeyStore.create({
      name,
      description: description || '',
      key,
    });

    console.log('POST /api/keys - Created API key:', newApiKey);
    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error) {
    console.error('POST /api/keys - Error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

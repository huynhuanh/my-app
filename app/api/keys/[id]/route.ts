import { NextRequest, NextResponse } from 'next/server';
import { apiKeyStore } from '@/lib/api-keys-store';

// GET /api/keys/[id] - Fetch a specific API key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKey = apiKeyStore.getById(id);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

// PUT /api/keys/[id] - Update a specific API key
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, key, isActive } = body;

    // Debug logging
    console.log('PUT /api/keys/[id] - ID:', id);
    console.log('PUT /api/keys/[id] - Body:', body);
    console.log('PUT /api/keys/[id] - All API keys:', apiKeyStore.getAll());

    const updatedApiKey = apiKeyStore.update(id, {
      name,
      description,
      key,
      isActive,
    });

    if (!updatedApiKey) {
      console.log('PUT /api/keys/[id] - API key not found for ID:', id);
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    console.log('PUT /api/keys/[id] - Updated API key:', updatedApiKey);
    return NextResponse.json(updatedApiKey);
  } catch (error) {
    console.error('PUT /api/keys/[id] - Error:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/keys/[id] - Delete a specific API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = apiKeyStore.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'API key deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

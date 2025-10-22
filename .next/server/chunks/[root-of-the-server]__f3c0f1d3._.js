module.exports = [
"[project]/.next-internal/server/app/api/keys/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/api-keys-store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared in-memory storage for API keys
// In production, you would use a database like PostgreSQL, MongoDB, etc.
__turbopack_context__.s([
    "apiKeyStore",
    ()=>apiKeyStore,
    "generateApiKey",
    ()=>generateApiKey
]);
// In-memory storage
let apiKeys = [
    // Add some sample data for testing
    {
        id: '1',
        name: 'Sample API Key',
        key: 'sk-sample1234567890abcdef1234567890abcdef1234567890',
        description: 'This is a sample API key for testing',
        createdAt: new Date().toISOString(),
        isActive: true
    }
];
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk-';
    for(let i = 0; i < 40; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const apiKeyStore = {
    // Get all API keys
    getAll () {
        return [
            ...apiKeys
        ];
    },
    // Get API key by ID
    getById (id) {
        return apiKeys.find((key)=>key.id === id);
    },
    // Create new API key
    create (data) {
        const newApiKey = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            isActive: true,
            ...data
        };
        apiKeys.push(newApiKey);
        return newApiKey;
    },
    // Update API key
    update (id, updates) {
        console.log('apiKeyStore.update - Looking for ID:', id);
        console.log('apiKeyStore.update - Available IDs:', apiKeys.map((k)=>k.id));
        const keyIndex = apiKeys.findIndex((key)=>key.id === id);
        console.log('apiKeyStore.update - Found index:', keyIndex);
        if (keyIndex === -1) {
            console.log('apiKeyStore.update - API key not found');
            return null;
        }
        apiKeys[keyIndex] = {
            ...apiKeys[keyIndex],
            ...updates
        };
        console.log('apiKeyStore.update - Updated API key:', apiKeys[keyIndex]);
        return apiKeys[keyIndex];
    },
    // Delete API key
    delete (id) {
        console.log('apiKeyStore.delete - Looking for ID:', id);
        console.log('apiKeyStore.delete - Available IDs:', apiKeys.map((k)=>k.id));
        const keyIndex = apiKeys.findIndex((key)=>key.id === id);
        console.log('apiKeyStore.delete - Found index:', keyIndex);
        if (keyIndex === -1) {
            console.log('apiKeyStore.delete - API key not found');
            return false;
        }
        apiKeys.splice(keyIndex, 1);
        console.log('apiKeyStore.delete - API key deleted successfully');
        return true;
    }
};
}),
"[project]/app/api/keys/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$keys$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-keys-store.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const apiKeys = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$keys$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiKeyStore"].getAll();
        console.log('GET /api/keys - All API keys:', apiKeys);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(apiKeys);
    } catch (error) {
        console.error('GET /api/keys - Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch API keys'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { name, description, key } = body;
        console.log('POST /api/keys - Body:', body);
        if (!name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Name is required'
            }, {
                status: 400
            });
        }
        if (!key) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'API Key is required'
            }, {
                status: 400
            });
        }
        const newApiKey = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$keys$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiKeyStore"].create({
            name,
            description: description || '',
            key
        });
        console.log('POST /api/keys - Created API key:', newApiKey);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newApiKey, {
            status: 201
        });
    } catch (error) {
        console.error('POST /api/keys - Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create API key'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f3c0f1d3._.js.map
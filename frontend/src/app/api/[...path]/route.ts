import { NextRequest } from "next/server";

export const maxDuration = 60; // Increase max duration for Vercel/Next.js if applicable

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, await params);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, await params);
}

async function handleProxy(request: NextRequest, params: { path: string[] }) {
  const path = params.path.join("/");
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  const url = new URL(request.url);
  const targetUrl = `${backendUrl}/api/${path}${url.search}`;

  try {
    const headers = new Headers(request.headers);
    headers.delete("host"); // Let fetch set the correct host
    headers.delete("expect"); // Not supported by undici fetch

    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: "manual",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const body = await request.arrayBuffer();
      init.body = body;
    }

    const response = await fetch(targetUrl, init);

    // Create a new response with the backend's data
    const responseHeaders = new Headers(response.headers);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Proxy error for /api/${path}:`, error);
    return new Response(
      JSON.stringify({ detail: "Backend proxy error or connection refused." }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

import { QueryClient } from "@tanstack/react-query";

// API base URL - this should point to your deployed API
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://the-derra-marketplace.vercel.app";

// This is used for making API requests
export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  // Prepend API_BASE_URL to the path if it's an API route
  const url = path.startsWith("/api") 
    ? `${API_BASE_URL}${path}`
    : path;

  console.log("Making API request to:", url);
  return fetch(url, options);
}

// This is used by TanStack Query as the default fetcher
async function defaultQueryFn(context: any) {
  const { queryKey } = context;
  const path = queryKey[0];
  if (!path.startsWith("/api")) {
    throw new Error(`Invalid query key: ${path}`);
  }

  const url = `${API_BASE_URL}${path}`;
  
  console.log("Query request:", path);
  
  const response = await fetch(url, {
    credentials: "include",
  });

  console.log("Query response:", path, "- Status:", response.status);

  // For 401 responses, return null instead of throwing an error
  if (response.status === 401) {
    return null;
  }

  // For 204 responses (no content), return undefined
  if (response.status === 204) {
    return undefined;
  }

  // For other error responses, throw an error
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  // For successful responses with content, parse the JSON
  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
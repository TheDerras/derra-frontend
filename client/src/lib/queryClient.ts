import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    console.log(`Making API request: ${method} ${url}`, data ? 'with data' : 'without data');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (data) {
      headers['Content-Type'] = 'application/json';
    }
    
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Important for session cookies
    });

    console.log(`API response received: ${method} ${url} - Status: ${res.status}`);
    
    // Special handling for authentication endpoints
    if ((url === '/api/login' || url === '/api/register' || url === '/api/logout' || url === '/api/me')) {
      // Clone the response before consuming it
      const resClone = res.clone();
      const responseText = await res.text();
      let errorMessage = res.statusText;
      let responseData = null;
      
      try {
        // Try to parse as JSON
        if (responseText) {
          responseData = JSON.parse(responseText);
          console.log(`Parsed ${url} response:`, responseData);
        }
        
        // If the response is not OK, handle the error
        if (!resClone.ok) {
          errorMessage = responseData?.message || errorMessage;
          console.error(`Auth error (${method} ${url}): ${errorMessage}`);
          throw new Error(errorMessage);
        }
        
        // If successful, return a new response with the parsed data
        return new Response(responseText, {
          status: resClone.status,
          statusText: resClone.statusText,
          headers: resClone.headers
        });
      } catch (e) {
        if (!resClone.ok) {
          // If can't parse as JSON or other error with not-OK response
          console.error(`Auth error (${method} ${url}) [parse failed]: ${errorMessage}`);
          throw new Error(errorMessage || 'Authentication error');
        }
        
        // If response is OK but parsing failed, return the cloned response
        return resClone;
      }
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API request failed (${method} ${url}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    console.log(`Query request: ${url}`);
    
    try {
      const res = await fetch(url, {
        credentials: "include", // Important for session cookies
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`Query response: ${url} - Status: ${res.status}`);

      // Handle 401 Unauthorized based on the provided behavior
      if (res.status === 401) {
        if (unauthorizedBehavior === "returnNull") {
          console.log(`Auth check (${url}): Not authenticated, returning null`);
          return null;
        } else {
          // Clone response before consuming it with text()
          const clonedRes = res.clone();
          try {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Authentication required');
          } catch (e) {
            // If parsing failed, use the status text
            throw new Error(clonedRes.statusText || 'Authentication required');
          }
        }
      }

      // Handle other errors
      if (!res.ok) {
        // Clone response before consuming it with text()
        const clonedRes = res.clone();
        try {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
        } catch (e) {
          // If parsing failed, use the status text
          throw new Error(`Error ${clonedRes.status}: ${clonedRes.statusText}`);
        }
      }
      
      // If all good, parse and return the data
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Query error (${url}):`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

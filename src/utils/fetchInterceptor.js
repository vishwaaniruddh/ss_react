/**
 * Global Fetch Interceptor for Sri Shringaar Client
 * ───────────────────────────────────────────────────────────────────────────
 * Intercepts all fetch requests to log request metadata, successful completions,
 * and detailed error bodies (including PHP error traces) on 500/failed requests.
 */

const originalFetch = window.fetch;

window.fetch = async function (input, init) {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input?.url || String(input);
  const method = init?.method || 'GET';

  console.log(`[Fetch Request] ${method} ${url}`, init);

  try {
    const response = await originalFetch(input, init);

    if (!response.ok) {
      // Clone response to read text body without consuming the original stream
      const clone = response.clone();
      let responseText = '';
      try {
        responseText = await clone.text();
        if (responseText.length > 5000) {
          responseText = responseText.slice(0, 5000) + '\n... [Truncated for readability]';
        }
      } catch (e) {
        responseText = `(Could not read body: ${e.message})`;
      }

      console.error(
        `%c[Fetch Error ${response.status}] ${method} ${url}\n` +
        `Response Body:\n${responseText}`,
        'color: #ff3333; font-weight: bold; font-size: 12px;'
      );
    } else {
      console.log(`[Fetch Success ${response.status}] ${method} ${url}`);
    }

    return response;
  } catch (error) {
    console.error(
      `%c[Fetch Network/CORS Error] Failed for ${method} ${url}\n` +
      `Error Message: ${error.message}`,
      'color: #ffaa00; font-weight: bold; font-size: 12px;',
      error
    );
    throw error;
  }
};

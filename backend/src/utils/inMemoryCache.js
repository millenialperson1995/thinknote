const cache = {};

/**
 * Armazena um valor no cache com TTL (em segundos)
 */
export const set = (key, value, ttlSeconds) => {
  const now = Date.now();
  const item = {
    value,
    expiry: ttlSeconds ? now + ttlSeconds * 1000 : null,
  };
  cache[key] = item;
};

/**
 * Busca um valor no cache (retorna null se expirado ou inexistente)
 */
export const get = (key) => {
  const item = cache[key];
  if (!item) return null;

  const now = Date.now();
  if (item.expiry && now > item.expiry) {
    delete cache[key]; // remove se expirado
    return null;
  }

  return item.value;
};

/**
 * Remove um item do cache
 */
export const del = (key) => {
  delete cache[key];
};
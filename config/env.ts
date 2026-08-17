const resolved = process.env.BASE_URL ?? 'https://todo.qacart.com';

if (!resolved.startsWith('http')) {
  throw new Error(
    `BASE_URL must be an absolute URL, got: "${resolved}". ` +
    `Set it in .env or pass at runtime: BASE_URL=https://... npm test`
  );
}

export const BASE_URL = resolved; 
import * as jose from 'jose';
import { HEADER_PROXY_TOKEN } from './config';
interface Env {
  PROXY_SECRET: string;
} 
export const onRequest: PagesFunction<Env> = async (context) => {
  const request: Request = context.request;
  const url = new URL(request.url);
  const path = url.pathname;
  const pathParams = path.split('/');
  const [proxyDomain, ...pathStr] = pathParams;
  const proxyPath = pathStr && pathStr.length > 0 ? pathStr.join('/') : '';
  
  const headers = new Headers(request.headers);
  const secret = context.env.PROXY_SECRET;
  if (secret) {
    const proxyToken = headers.get(HEADER_PROXY_TOKEN) || url.searchParams?.get(HEADER_PROXY_TOKEN);
    if (!proxyToken) {
      return new Response('NOT ALLOWED', {
        status: 401,
      });
    }

    try {
      const { payload } = await jose.jwtVerify(
        proxyToken, 
        new TextEncoder().encode(secret)
      );
      console.log(payload);
    } catch (error) {
      return new Response('PERMISSION DENIED', {
        status: 403,
      });
    }
    headers.delete(HEADER_PROXY_TOKEN);
  }
  const proxyUrl = `${url.protocol}//${proxyDomain}${proxyPath}${url.search}`;
  console.log('proxy url', proxyUrl);
  const res = await fetch(proxyUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
  });

  return res;
};
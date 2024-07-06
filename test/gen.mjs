import * as jose from 'jose';
import process from 'node:process';
const secret = new TextEncoder().encode(
    process.env.SECRET,
  );
  const alg = 'HS256';
  
  const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    // .setIssuer('urn:example:issuer')
    // .setAudience('urn:example:audience')
    .setExpirationTime('2years')
    .sign(secret);
  
  console.log(jwt);
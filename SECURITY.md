# Security Implementation

This document outlines the security measures implemented in the Schedule Timeline application.

## Frontend Security

### Security Headers
The application sets the following HTTP security headers:
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **X-Frame-Options: DENY** - Prevents clickjacking/framing attacks
- **X-XSS-Protection: 1; mode=block** - XSS protection (legacy)
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Restricts browser features (geolocation, microphone, camera)

### Storage
- Data in localStorage (`timeline:segments`) is client-side only
- No sensitive information stored in localStorage
- Passwords are never transmitted

## Backend Security

### API Protection

#### 1. Rate Limiting
- **30 requests per minute** per IP address
- Prevents API abuse and DDoS attacks
- Returns 429 (Too Many Requests) when limit exceeded
- Resets every 60 seconds

#### 2. Input Validation
- **Segments validation**: Checks type, structure, and length
  - `id`: max 50 characters
  - `timestamp`: max 50 characters
  - `title`: max 500 characters
  - All required fields must be present
  
- **Payload size limit**: Max 1MB per request
  - Prevents large file uploads and memory exhaustion
  
- **Parameter validation**: All query/body parameters validate type and length

#### 3. Error Handling
- Generic error messages to prevent information leakage
- Detailed errors only in server logs (not returned to client)
- Graceful fallback when database unavailable

### Database Security

#### Row Level Security (RLS)
Supabase RLS prevents unauthorized data access:
- **Anonymous users**: READ ONLY
  - Can view timeline data
  - Cannot modify, insert, or delete
  
- **Authenticated users**: FULL ACCESS
  - Can create, read, update, delete their data
  - Requires login
  
- **API server** (with SERVICE_KEY): BYPASS RLS
  - Full administrative access
  - Used only for server-side operations

#### Data Encryption
- All data in transit: HTTPS/TLS (Supabase)
- Database at rest: Encrypted by Supabase (included in free tier)

## Secrets Management

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Public (shared in frontend)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public (limited permissions via RLS)
- `SUPABASE_SERVICE_KEY`: Secret (server-only, never exposed to client)

```env
# .env.local (local development only)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx
```

### On Vercel
- Set environment variables in **Project Settings** → **Environment Variables**
- Never commit `.env.local` to GitHub (`.gitignore` handles this)
- Service key kept secret on server only

## Deployment Checklist

- [ ] All environment variables set on Vercel
- [ ] RLS policies enabled on Supabase
- [ ] Rate limiting functioning (test with rapid requests)
- [ ] .env files not in Git history
- [ ] HTTPS enabled on custom domain (Vercel default)
- [ ] Supabase project set to production (not development)

## Testing Security

### Test Rate Limiting
```bash
# Rapid requests - should fail after 30
for i in {1..35}; do curl http://localhost:3000/api/segments; done
```

### Test Input Validation
```bash
# Invalid payload
curl -X POST http://localhost:3000/api/segments \
  -H "Content-Type: application/json" \
  -d '{"segments": "not-an-array"}'  # Should fail
```

### Test RLS
- Anonymous user tries to modify data via browser → Blocked
- Read access via browser → Works (if user authenticated or public read allowed)

## Incident Response

If security issue is discovered:
1. Disable affected service
2. Check server logs in Supabase
3. Rotate credentials (API keys)
4. Review recent data changes
5. Audit user activity

## Future Security Enhancements

- [ ] Add Supabase Auth (email/password login)
- [ ] Implement audit logging (who changed what, when)
- [ ] Add IP whitelist for editing endpoints
- [ ] Enable Supabase MFA
- [ ] Regular security audits
- [ ] CORS configuration (if sharing API)

## References

- [Supabase Security Documentation](https://supabase.com/docs/guides/platform/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/architecture/security-considerations)

# 🔐 Security Migration Guide: localStorage → httpOnly Cookies

## ⚠️ Current Security Issue

**Problem:** Trenutno admin panel koristi `localStorage` za čuvanje JWT tokena, što je ranjivo na XSS (Cross-Site Scripting) napade.

**Solution:** Prebaciti na httpOnly cookies sa CSRF zaštitom.

---

## 📋 Migration Checklist

### Backend Promjene (luminor-backend)

#### 1. Instalacija Paketa
```bash
cd luminor-backend
npm install cookie-parser csurf
```

#### 2. Dodati Middleware u server.js
```javascript
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// After helmet, before routes
app.use(cookieParser());

// CSRF protection for state-changing operations
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});
```

#### 3. Modifikovati routes/auth.js

**Login Endpoint:**
```javascript
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        // ... existing validation and user finding ...

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token to database
        user.refresh_token = refreshToken;
        await user.save();

        // SECURITY: Set httpOnly cookies instead of sending tokens in response
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
                // No tokens in response body!
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
```

**Logout Endpoint:**
```javascript
router.post('/logout', auth, async (req, res) => {
    try {
        // Clear refresh token from database
        await User.update({ refresh_token: null }, { where: { id: req.user.id } });

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
```

#### 4. Modifikovati middleware/auth.js
```javascript
const auth = async (req, res, next) => {
    try {
        // Get token from cookie instead of Authorization header
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            error: 'Token is not valid'
        });
    }
};
```

---

### Frontend Promjene (luminor-admin)

#### 1. Modifikovati app/login/page.tsx
```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include', // VAŽNO: Šalje cookies
            body: JSON.stringify({ email, password }),
        });

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.error || "Login failed");
        }

        // Tokeni su sada u httpOnly cookies, samo čuvamo user info
        localStorage.setItem("user", JSON.stringify(responseData.data.user));

        router.push("/dashboard");
    } catch (err: any) {
        setError(err.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};
```

#### 2. Kreirati lib/api-client.ts (Helper za API pozive)
```typescript
export const apiClient = {
    async get(endpoint: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            credentials: 'include', // Send cookies
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    },

    async post(endpoint: string, data: any) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async put(endpoint: string, data: any) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async delete(endpoint: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    }
};
```

#### 3. Zamijeniti sve fetch pozive sa apiClient
Umjesto:
```typescript
const res = await fetch(`${API_URL}/api/blog`, {
    headers: { Authorization: `Bearer ${token}` }
});
```

Koristiti:
```typescript
const data = await apiClient.get('/api/blog');
```

#### 4. Aktivirati Middleware u middleware.ts
```typescript
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    const token = request.cookies.get('accessToken')?.value;

    // SECURITY: Redirect to login if no token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const response = NextResponse.next();
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
}
```

---

## 🧪 Testing Checklist

- [ ] Login functionality radi
- [ ] Cookies se postavljaju nakon logina (provjeri Developer Tools → Application → Cookies)
- [ ] Protected routes zahtijevaju token
- [ ] Logout briše cookies
- [ ] Refresh token flow radi
- [ ] CORS postavke dozvoljavaju credentials
- [ ] CSRF zaštita ne blokira legitimne requestove
- [ ] Admin panel radi u development i production modu

---

## 🚀 Deployment Notes

### Environment Variables
Dodati u `.env`:
```
# Cookie Settings
COOKIE_SECRET=your-super-secret-cookie-key-change-in-production
```

### CORS Update
Osigurati da CORS dozvoljava credentials:
```javascript
const corsOptions = {
    origin: function (origin, callback) {
        // ... existing origin check ...
    },
    credentials: true, // ✅ Već postoji
    // ...
};
```

---

## 📊 Security Benefits

✅ **XSS Protection** - httpOnly cookies nisu dostupni JavaScript-u
✅ **CSRF Protection** - SameSite=Strict + CSRF tokens
✅ **Secure Flag** - Cookies se šalju samo preko HTTPS u production
✅ **Server-Side Validation** - Next.js middleware provjerava token prije renderovanja

---

## ⏱️ Estimated Migration Time

- Backend changes: ~2 hours
- Frontend changes: ~3 hours
- Testing: ~2 hours
- **Total: ~7 hours**

---

**Status:** 📋 Documentation prepared, implementation pending

Za implementaciju, slijedi korake iz ovog dokumenta redom. Testiraj svaki korak prije nego što pređeš na sljedeći.

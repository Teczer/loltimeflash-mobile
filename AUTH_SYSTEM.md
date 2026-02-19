# LANEGAP - Système d'Authentification

> Documentation du système d'auth web pour portage mobile.

---

## 🔐 Principe Fondamental

**Un compte non vérifié = Pas d'accès.**

L'utilisateur ne peut PAS se connecter tant que son email n'est pas vérifié via OTP.

---

## 📊 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PocketBase    │ ←── │   API Routes    │ ←── │   Auth Store    │
│   (Backend)     │     │   (Next.js)     │     │   (Zustand)     │
│                 │     │                 │     │                 │
│ • users         │     │ • send-otp      │     │ • login()       │
│ • otp_codes     │     │ • verify-otp    │     │ • register()    │
└─────────────────┘     └─────────────────┘     │ • logout()      │
                                                └─────────────────┘
```

---

## 📦 Collections PocketBase

### `users` (collection auth native)

| Champ      | Type     | Description         |
| ---------- | -------- | ------------------- |
| `id`       | string   | ID unique (auto)    |
| `email`    | string   | Email unique        |
| `password` | string   | Password hashé      |
| `name`     | string   | Nom d'affichage     |
| `avatar`   | file     | Avatar optionnel    |
| `verified` | boolean  | **Email vérifié ?** |
| `created`  | datetime | Date création       |

### `otp_codes`

| Champ     | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `id`      | string   | ID unique (auto)                |
| `email`   | string   | Email concerné                  |
| `code`    | string   | Code 6 chiffres                 |
| `used`    | boolean  | Déjà utilisé ?                  |
| `created` | datetime | Date création (pour expiration) |

---

## 🔄 Flow 1 : Inscription

```
┌──────────────┐
│  REGISTER    │
│  Form        │
│  (name,      │
│  email, pwd) │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  1. pb.collection('users').create()  │
│     → Crée le user avec verified=false│
└──────┬───────────────────────────────┘
       │
       │ Si email déjà pris → Erreur "email_already_used"
       │
       ▼
┌──────────────────────────────────────┐
│  2. POST /api/auth/send-otp          │
│     → Génère code 6 chiffres         │
│     → Stocke dans otp_codes          │
│     → Envoie email via Resend        │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────┐
│  OTP Screen  │
│  (6 digits)  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  3. POST /api/auth/verify-otp        │
│     → Vérifie code + expiration 5min │
│     → Mark otp_codes.used = true     │
│     → Mark users.verified = true     │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  4. Auto-login après vérification    │
│     → pb.authWithPassword()          │
│     → Redirection Home               │
└──────────────────────────────────────┘
```

---

## 🔄 Flow 2 : Connexion (compte vérifié)

```
┌──────────────┐
│  LOGIN       │
│  Form        │
│  (email,pwd) │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  pb.collection('users')              │
│    .authWithPassword(email, pwd)     │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Check: user.verified === true ?     │
└──────┬───────────────┬───────────────┘
       │               │
      YES              NO
       │               │
       ▼               ▼
┌──────────────┐  ┌──────────────────────────┐
│  ✅ SUCCESS   │  │  ❌ BLOCK LOGIN           │
│  → Set state │  │  → pb.authStore.clear()  │
│  → Redirect  │  │  → throw "email_not_     │
│    Home      │  │       verified"          │
└──────────────┘  └──────────────────────────┘
```

---

## 🔄 Flow 3 : Connexion (compte NON vérifié)

```
┌──────────────────────────────────────┐
│  Erreur "email_not_verified" catchée │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  1. POST /api/auth/send-otp          │
│     → Envoie nouveau code            │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  2. Stocker email + password         │
│     en mémoire (pour auto-login)     │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  3. Afficher écran OTP               │
│     + Message "Vérifie ton email"    │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  4. Après verify-otp réussi          │
│     → Auto-login avec pwd stocké     │
│     → Clear password de la mémoire   │
│     → Redirect Home                  │
└──────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### `POST /api/auth/send-otp`

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (success):**

```json
{
  "success": true,
  "message": "OTP code sent"
}
```

**Logic:**

1. Invalide tous les anciens codes non-utilisés pour cet email (`used = true`)
2. Génère code 6 chiffres : `Math.floor(100000 + Math.random() * 900000)`
3. Crée record dans `otp_codes`
4. Envoie email via Resend

---

### `POST /api/auth/verify-otp`

**Request:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (success):**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Response (error):**

```json
{
  "error": "Invalid or expired code"
}
```

**Logic:**

1. Cherche `otp_codes` où `email = X && code = Y && used = false`
2. Vérifie expiration : `(now - created) < 5 minutes`
3. Si valide → `otp_codes.used = true`
4. Update `users.verified = true` (nécessite auth admin PocketBase)

---

## 🗂️ Structure User (Interface)

```typescript
interface IUser {
  id: string
  email: string
  name: string
  avatar?: string
  verified: boolean // ← Clé du système
  created: string
}
```

---

## ⚠️ Gestion des Erreurs

| Erreur               | Quand                         | Action UI                        |
| -------------------- | ----------------------------- | -------------------------------- |
| `email_already_used` | Register avec email existant  | "Cet email est déjà utilisé"     |
| `email_not_verified` | Login avec compte non vérifié | Envoie OTP + affiche écran OTP   |
| `loginError`         | Mauvais email/password        | "Email ou mot de passe invalide" |
| `sendOtpError`       | Échec envoi email             | "Échec de l'envoi du code"       |
| OTP invalide/expiré  | Code faux ou > 5 min          | "Code invalide ou expiré"        |

---

## 🔑 Points Clés

1. **`verified` est le gardien** - Sans `verified: true`, pas d'accès au compte

2. **Auth PocketBase annulée si non vérifié** - On fait `pb.authStore.clear()` immédiatement

3. **Auto-login après OTP** - On stocke temporairement le password pour login auto

4. **Codes OTP invalidés** - Chaque nouveau send-otp invalide les anciens codes

5. **Expiration 5 minutes** - Calculée côté serveur sur `created` du code

6. **OAuth bypass** - Les connexions Google/Discord sont auto-vérifiées (pas d'OTP)

---

## 📱 Adaptation Mobile

Pour Expo, tu devras :

- Gérer le deep linking si tu veux supporter OAuth mobile

---

_Dernière mise à jour : Janvier 2026_

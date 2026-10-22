# Hari Om International School — Admission Form + Supabase

## Folder structure

```text
hariom-admission/
  public/
    admission.html
    admission.css
    admission.js
  server.js
  schema.sql
  package.json
  .env.example
  .gitignore
```

## Step 1: Supabase table banao
1. Supabase project open karo.
2. SQL Editor > New query kholo.
3. `schema.sql` ka poora SQL paste karke Run karo.
4. Table Editor mein `admission_applications` table check karo.

## Step 2: Credentials set karo
1. Project ke root folder mein `.env.example` ki copy banao aur us copy ka naam `.env` rakho.
2. Supabase Project URL aur server-side secret key `.env` mein daalo.
3. Key sirf backend `.env` mein rahegi. `public/` ke andar kabhi mat rakhna aur GitHub par `.env` upload mat karna.

`.env` example:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVER_SIDE_SECRET_KEY
PORT=3000
```

Dashboard mein agar `secret key` aur `service_role` key ke labels alag dikh rahe hon, to current Supabase guidance ke mutabik server-side secret key use karo. Secret key browser mein expose nahi honi chahiye.

## Step 3: Node.js install/check karo
Terminal mein:

```bash
node -v
npm -v
```

Agar commands nahi chalti, pehle Node.js LTS install karo.

## Step 4: Dependencies aur server run karo
VS Code terminal mein `hariom-admission` folder ke andar:

```bash
npm install
npm start
```

Browser mein kholo:

- `http://localhost:3000/admission.html`
- `http://localhost:3000/api/health`

Form test karne ke baad Supabase > Table Editor > `admission_applications` mein row check karo.

## Important limitations and privacy
- Existing admission form ka CSS design same rakha gaya hai; HTML mein sirf form ID, class field name, status text aur JS connection add hua hai.
- Is starter version mein student/parent form text database mein save hota hai. Document picker abhi file upload nahi karta. Aadhaar/student documents ko live collect karne se pehle private Storage bucket, authorization, retention/deletion process, and access controls configure karna zaroori hai.
- Login/admin page abhi is endpoint ko protect nahi karta. Public endpoint par spam ka risk hai; rate limit aur validation basic protections hain, complete production security nahi.
- Real student/minor data use karne se pehle authenticated admission workflow, admin-only reads, data minimization, consent and privacy review configure karo.
- `.env` and secret keys never share or commit. `.gitignore` already excludes `.env`.

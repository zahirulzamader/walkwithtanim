# 🌍 Walk With Tanim — Travel Portfolio

A personal travel & vlog portfolio site for Md Zahirul Islam (Tanim).  
Built with **Next.js 16**, **Tailwind CSS**, **Prisma + PostgreSQL**, and **AWS S3**.

Live site: [https://walkwithtanim.vercel.app/](https://walkwithtanim.vercel.app/)

---

## ✨ Features

- Hero section with Bangladesh photo slideshow (brightness adjustable)
- Travel journal with admin-only story creation & photo uploads
- Gallery, Skills, About, Contact, and Vlog sections
- Newsletter subscription
- Admin passcode-protected "Write Your Story" panel
- Contact form (saves to database, email notification optional)

---

## 🚀 Deploy on Vercel (Free)

### Step 1 — Get a free PostgreSQL database
Sign up at **[neon.tech](https://neon.tech)** (free tier).  
Create a project → copy the connection string (it looks like `postgresql://...`).

### Step 2 — Import to Vercel
1. Go to **[vercel.com](https://vercel.com)** → Sign Up (free)
2. Click **Add New Project** → **Import Git Repository**
3. Connect your GitHub and select `zahirulzamader/walkwithtanim`
4. Click **Deploy** — Vercel will ask for Environment Variables first

### Step 3 — Set Environment Variables in Vercel
In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `JOURNAL_PASSCODE` | Any password you want (for the Write Your Story feature) |
| `AWS_ACCESS_KEY_ID` | Your AWS access key (for photo uploads) |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
| `AWS_REGION` | e.g. `us-east-1` |
| `AWS_BUCKET_NAME` | Your S3 bucket name |
| `AWS_FOLDER_PREFIX` | e.g. `walkwithtanim/` |

> **No AWS?** You can skip the AWS variables — the site works without them, but journal photo uploads won't function until you add them.

### Step 4 — Run database migrations
After first deploy, open **Vercel → your project → Functions → Terminal** (or use Vercel CLI):
```bash
npx prisma migrate deploy
```
Or let Prisma generate tables automatically on first run.

### Step 5 — Add images
The photos in `public/bangladesh/` and `public/destinations/` are not in this repo (binary files).  
Download them from the live site and upload to this GitHub repo under the same folder paths:
- `public/bangladesh/bandarban.jpg`
- `public/bangladesh/coxsbazar.jpg`
- `public/bangladesh/saintmartin.jpg`
- `public/bangladesh/sajek.jpg`
- `public/bangladesh/sundarbans.jpg`
- `public/bangladesh/sylhet.jpg`
- `public/destinations/kaunas.jpg`
- `public/destinations/madrid.jpg`
- `public/logo.png`
- `public/og-image.png`

You can upload them directly on GitHub: go to the `public/` folder → click **Add file → Upload files**.

---

## 💻 Run Locally

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in your values in .env

# Push database schema
npx prisma db push

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Admin Access

To sign in as admin on any deployment:
1. Scroll to the footer → click the small 🔒 lock icon
2. Enter your `JOURNAL_PASSCODE`
3. You'll see the **Write Your Story** button appear in the Journal section

---

## 📁 Project Structure

```
app/
  components/     # Page sections (Hero, Journal, Gallery, etc.)
  api/            # API routes (admin, contact, journal, upload)
lib/              # Auth, database, S3, utilities
prisma/           # Database schema
public/           # Static assets (add images here)
```

---

*Built with ❤️ by Md Zahirul Islam*

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/16b0ac81-470d-4dda-85ad-c9fbfb24b00a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/16b0ac81-470d-4dda-85ad-c9fbfb24b00a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/16b0ac81-470d-4dda-85ad-c9fbfb24b00a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Environment setup

Create a Supabase project and copy your API credentials.

1. Create a `.env` file at project root from the example below
2. Start the dev server

```bash
npm run dev
```

### .env example

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### Fixing auth CORS errors

If you see a CORS error when signing up or logging in (e.g. calling `https://<something>.supabase.co/auth/v1/signup` from `http://localhost:5173` or `http://localhost:8080`), configure both your local env and Supabase project:

1) Local `.env` must point to your Supabase project

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

2) Supabase Dashboard settings

- Auth > URL Configuration:
  - Site URL: set to your local dev URL (e.g. `http://localhost:5173`)
  - Additional Redirect URLs: include `http://localhost:5173`, `http://localhost:8080` if you use both
- Auth > Providers > Email: ensure enabled
- Auth > Settings > Allowed CORS Origins: add your dev origins (e.g. `http://localhost:5173`, `http://localhost:8080`)

Notes:
- The Supabase URL must be the exact project URL ending with `.supabase.co` or `.supabase.net`.
- The anon key should be the public (anon) key, not the service role key.
- After updating `.env`, fully restart the dev server.

## Auth and database

This app uses Supabase for auth and database.
- Client: `src/lib/supabaseClient.ts`
- Auth context: `src/components/AuthProvider.tsx`

Routes added:
- `/signup`, `/login` for email/password auth
- `/dashboard` protected page
- Feature placeholders: `/chatbot`, `/booking`, `/groups`, `/assessment`, `/journal`, `/resources`
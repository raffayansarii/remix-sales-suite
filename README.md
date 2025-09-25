# CRM React App

## Project info

## How can I edit this code?

You can edit your application using your preferred IDE or directly in GitHub.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

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

## Authentication & Supabase Integration

- Uses Supabase Auth (email/password) for secure authentication.
- Environment variables required in `.env` (placed in `ui/` directory):
  ```env
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
- If these keys are missing or invalid, the app will log an error but continue running.

## State Management & Data Fetching

- Uses Redux Toolkit and RTK Query for state management and API calls.
- RTK Query baseApi is set up in `src/api/baseApi.ts` and ready for endpoint injection.
- Redux store is configured in `src/api/store.ts`.

## Routing & Layout

- Routing is handled with `react-router-dom`.
- The `/login` page is rendered outside of the main layout (`AppLayout`).
- All other routes are wrapped with `AppLayout` and use `<Outlet />` for nested content.

## How to Run the App

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file in the `ui/` directory with the required Supabase keys.
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Visit `/login` to access the authentication page.

## Notes
- If environment variables are missing, the app will not crash but Supabase features will be disabled.
- You can inject RTK Query endpoints in separate files using `baseApi.injectEndpoints`.

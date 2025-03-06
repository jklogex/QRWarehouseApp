# QR Warehouse App

A React Native application for managing warehouse entry and exit using QR codes.

## Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access**: Different interfaces for drivers, supervisors, and security personnel
- **QR Code Generation**: Drivers can generate QR codes for warehouse exit
- **QR Code Scanning**: Security personnel can scan and verify driver QR codes
- **Driver Management**: Supervisors can manage driver clearance status

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jklogex/QRWarehouseApp.git
   cd QRWarehouseApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Set up the database tables:

   Create a `users` table with the following columns:
   ```sql
   create table users (
     id uuid references auth.users on delete cascade not null primary key,
     email text not null,
     role text not null,
     display_name text not null,
     status text not null,
     created_at timestamp with time zone default now(),
     last_updated timestamp with time zone
   );

   -- Enable Row Level Security
   alter table users enable row level security;

   -- Create policies
   create policy "Users can view their own data" on users
     for select using (auth.uid() = id);

   create policy "Users can update their own data" on users
     for update using (auth.uid() = id);

   create policy "Supervisors can view all drivers" on users
     for select using (
       auth.uid() in (
         select id from users where role = 'supervisor'
       ) and role = 'driver'
     );

   create policy "Supervisors can update driver status" on users
     for update using (
       auth.uid() in (
         select id from users where role = 'supervisor'
       ) and role = 'driver'
     );

   create policy "Security can view all drivers" on users
     for select using (
       auth.uid() in (
         select id from users where role = 'security'
       ) and role = 'driver'
     );
   ```

4. Configure authentication:
   - Go to Authentication > Settings
   - Enable Email/Password sign-in method

5. Get your Supabase URL and anon key:
   - Go to Project Settings > API
   - Copy the URL and anon key

6. Update the Supabase configuration in `src/services/supabase.ts`:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

### Running the App

#### Android

```bash
npm run android
```

#### iOS

```bash
npm run ios
```

## Project Structure

- `/src`: Source code
  - `/assets`: Images, fonts, and other static assets
  - `/components`: Reusable UI components
  - `/navigation`: Navigation configuration
  - `/screens`: Application screens
    - `/auth`: Authentication screens
    - `/driver`: Driver-specific screens
    - `/supervisor`: Supervisor-specific screens
    - `/security`: Security-specific screens
  - `/services`: API and service functions

## License

MIT
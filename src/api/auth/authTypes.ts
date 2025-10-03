export interface IUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email_verified: boolean;
    full_name: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  identities: any; // or null, or a more specific type if known
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}
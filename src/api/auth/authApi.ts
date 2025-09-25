import { LoginResponse } from "@/components/auth/authTypes";
import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "https://c2p-crm-auth.jollytree-b86081c8.westus.azurecontainerapps.io/token?grant_type=password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

// Example usage in a React component:
// const [login, { data, error, isLoading }] = useLoginMutation();
// const { data: userProfile, error: profileError } = useFetchUserProfileQuery();

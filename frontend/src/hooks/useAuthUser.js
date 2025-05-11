import { useQuery } from '@tanstack/react-query'
import { getauthUser } from '../lib/api.js'
export default function useAuthUser() {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getauthUser,
    retry: false
  });
  return {isLoading: authUser?.isLoading, isError: authUser?.isError, authData: authUser.data?.user};
}

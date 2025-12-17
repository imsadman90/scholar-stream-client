import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role,
    isLoading: roleLoading,
    error,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/users/role/${user?.email}`);
        return res.data.role;
      } catch (err) {
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    onError: (error) => {
    },
  });

  // Calculate combined loading state
  const isRoleLoading = authLoading || (roleLoading && !role);

  const finalRole = !isRoleLoading && !role ? "student" : role;

  return [finalRole, isRoleLoading];
};

export default useRole;

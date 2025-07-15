import { useQuery } from '@tanstack/react-query';
import UseAuth from './UseAuth';
import UseAxios from './UseAxios';



const useUserRole = () => {
  const { user, loading: authLoading } = UseAuth();
  const axiosSecure = UseAxios();

  const { 
    data: role = 'Employee', 
    isLoading: roleLoading, 
    refetch 
  } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error('User email not found');
      const res = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}/role`);
      return res.data.role ?? 'user';
    },
    enabled: !authLoading && !!user?.email,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;

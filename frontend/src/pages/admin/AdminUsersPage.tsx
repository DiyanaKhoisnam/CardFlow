import React, { useState } from 'react';
import { useAdminUsersQuery, useUpdateUserStatusMutation } from '../../hooks/useAdminData';
import { UsersTable } from '../../components/admin/UsersTable';

export const AdminUsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<any>('');

  const { data, isLoading } = useAdminUsersQuery({
    page,
    limit: 10,
    search,
    role,
  });

  const updateUserStatusMutation = useUpdateUserStatusMutation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System User Management</h1>
        <p className="text-sm text-slate-400">View user accounts, monitor roles, suspend or activate customer access.</p>
      </div>

      <UsersTable
        users={data?.users || []}
        pagination={data?.pagination}
        searchQuery={search}
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
        selectedRole={role}
        onRoleChange={(r) => { setRole(r); setPage(1); }}
        onPageChange={(p) => setPage(p)}
        onToggleSuspend={(userId, isSuspended) => updateUserStatusMutation.mutate({ userId, isSuspended })}
        isUpdating={updateUserStatusMutation.isPending}
        isLoading={isLoading}
      />
    </div>
  );
};

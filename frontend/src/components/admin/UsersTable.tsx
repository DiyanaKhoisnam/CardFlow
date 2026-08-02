import React from 'react';
import { AdminUser } from '../../types/admin.types';
import { UserRole } from '../../types/auth.types';
import { Pagination } from '../../types/customer.types';
import { Search, ChevronLeft, ChevronRight, UserX, UserCheck } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface UsersTableProps {
  users: AdminUser[];
  pagination?: Pagination;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: UserRole | '';
  onRoleChange: (role: UserRole | '') => void;
  onPageChange: (page: number) => void;
  onToggleSuspend: (userId: string, currentSuspendedState: boolean) => void;
  isUpdating?: boolean;
  isLoading?: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  pagination,
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  onPageChange,
  onToggleSuspend,
  isUpdating = false,
  isLoading = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden space-y-4">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole | '')}
            className="bg-white border border-slate-300 rounded-md text-xs px-2.5 py-2 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="enterprise-table-header">User</th>
              <th className="enterprise-table-header">Role</th>
              <th className="enterprise-table-header">Status</th>
              <th className="enterprise-table-header">Registered</th>
              <th className="enterprise-table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="enterprise-table-row">
                  <td className="px-4 py-3.5 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <div>{user.firstName} {user.lastName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{user.email}</div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {user.role === 'ADMIN' ? (
                      <Badge variant="info">ADMINISTRATOR</Badge>
                    ) : (
                      <Badge variant="neutral">CUSTOMER</Badge>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {user.isSuspended ? (
                      <Badge variant="danger">SUSPENDED</Badge>
                    ) : (
                      <Badge variant="success">ACTIVE</Badge>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    {user.role !== 'ADMIN' && (
                      <Button
                        variant={user.isSuspended ? 'secondary' : 'danger'}
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => onToggleSuspend(user.id, !user.isSuspended)}
                      >
                        {user.isSuspended ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Activate
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5" /> Suspend
                          </>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalCount} users)
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.currentPage + 1)}
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

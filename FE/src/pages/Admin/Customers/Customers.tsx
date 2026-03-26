import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { toast } from 'react-toastify'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'

export default function AdminCustomers() {
  const queryClient = useQueryClient()
  const { can } = usePermission()
  const [searchTerm, setSearchTerm] = useState('')

  // Check permissions
  const canCreate = can(Permission.USER_CREATE)
  const canDelete = can(Permission.USER_DELETE)
  const canManageRoles = can(Permission.USER_MANAGE_ROLES)

  // Fetch users/customers
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers()
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success('Xóa khách hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Xóa khách hàng thất bại')
    }
  })

  const users = usersData?.data.data || []

  const filteredCustomers = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${userName}"?`)) {
      deleteUserMutation.mutate(userId)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-earth'>Quản lý khách hàng</h1>
          <p className='mt-2 text-cement-dark'>Tổng cộng {users.length} khách hàng</p>
        </div>
        {canCreate && (
          <button className='rounded-lg bg-brick px-4 py-2 font-semibold text-white transition-colors hover:bg-brick-dark'>
            + Thêm khách hàng
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='space-y-4 rounded-lg bg-white p-4 md:p-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-medium text-earth'>Tìm kiếm</label>
            <input
              type='text'
              placeholder='Tên hoặc email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className='overflow-hidden rounded-lg bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-cement-dark'>Đang tải...</div>
            </div>
          ) : (
            <table className='w-full'>
              <thead className='bg-cream-light'>
                <tr>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-earth md:px-6'>Tên</th>
                  <th className='hidden px-4 py-3 text-left text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Email
                  </th>
                  <th className='hidden px-4 py-3 text-left text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Số điện thoại
                  </th>
                  <th className='hidden px-4 py-3 text-center text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Vai trò
                  </th>
                  <th className='px-4 py-3 text-center text-sm font-semibold text-earth md:px-6'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-cement-light'>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className='hover:bg-cream-light/50'>
                      <td className='px-4 py-4 md:px-6'>
                        <div className='flex items-center gap-3'>
                          {customer.avatar && (
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className='h-10 w-10 rounded-full object-cover'
                            />
                          )}
                          <div>
                            <p className='font-medium text-earth'>{customer.name || 'Chưa cập nhật'}</p>
                            <p className='text-xs text-cement-dark md:hidden'>{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className='hidden px-4 py-4 text-earth md:table-cell md:px-6'>{customer.email}</td>
                      <td className='hidden px-4 py-4 text-earth md:table-cell md:px-6'>
                        {customer.phone || 'Chưa có'}
                      </td>
                      <td className='hidden px-4 py-4 text-center md:table-cell md:px-6'>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            customer.roles.includes('Admin')
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {customer.roles.includes('Admin') ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className='px-4 py-4 text-center md:px-6'>
                        <div className='flex items-center justify-center gap-2'>
                          <button className='rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-200'>
                            Xem
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteUser(customer._id, customer.name || customer.email)}
                              className='rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-200'
                              disabled={deleteUserMutation.isLoading || customer.roles.includes('Admin')}
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className='px-4 py-8 text-center text-sm text-cement-dark'>
                      Không tìm thấy khách hàng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

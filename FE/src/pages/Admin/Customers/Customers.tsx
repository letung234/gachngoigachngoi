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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    roles: ['User'],
    phone: '',
    address: ''
  })

  // Check permissions
  const canCreate = can(Permission.USER_CREATE)
  const canUpdate = can(Permission.USER_UPDATE)
  const canDelete = can(Permission.USER_DELETE)
  const canManageRoles = can(Permission.USER_MANAGE_ROLES)

  // Fetch users/customers
  const { data: usersData, isLoading: isPending } = useQuery({
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

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: any) => adminApi.createUser(data),
    onSuccess: () => {
      toast.success('Thêm khách hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsModalOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Thêm khách hàng thất bại')
    }
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      toast.success('Cập nhật khách hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsModalOpen(false)
      setSelectedUser(null)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Cập nhật khách hàng thất bại')
    }
  })

  const users = usersData?.data.data?.users || []

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

  const handleAddUser = () => {
    setSelectedUser(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      name: user.name || '',
      password: '',
      roles: user.roles || ['User'],
      phone: user.phone || '',
      address: user.address || ''
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      roles: ['User'],
      phone: '',
      address: ''
    })
  }

  const handleSubmit = () => {
    // Enhanced form validation
    if (!formData.email || formData.email.trim().length === 0) {
      toast.error('Email là trường bắt buộc')
      return
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(formData.email.trim())) {
      toast.error('Email không đúng định dạng')
      return
    }

    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Tên phải có ít nhất 2 ký tự')
      return
    }

    // Validate phone format if provided
    if (formData.phone && formData.phone.trim()) {
      const phonePattern = /^(0[3-9]\d{8})$|^(\+84[3-9]\d{8})$/
      if (!phonePattern.test(formData.phone.trim())) {
        toast.error('Số điện thoại không đúng định dạng')
        return
      }
    }

    if (selectedUser) {
      // Update existing user
      const updateData = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        ...(formData.password && formData.password.length >= 6 && { password: formData.password })
      }
      updateUserMutation.mutate({ id: selectedUser._id, data: updateData })
    } else {
      // Create new user
      if (!formData.password || formData.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự')
        return
      }

      const createData = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        roles: formData.roles
      }
      createUserMutation.mutate(createData)
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
          <button
            onClick={handleAddUser}
            className='rounded-lg bg-brick px-4 py-2 font-semibold text-white transition-colors hover:bg-brick-dark'
          >
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
          {isPending ? (
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
                          {canUpdate && (
                            <button
                              onClick={() => handleEditUser(customer)}
                              className='rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-200'
                            >
                              Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteUser(customer._id, customer.name || customer.email)}
                              className='rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-200'
                              disabled={deleteUserMutation.isPending || customer.roles.includes('Admin')}
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

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6'>
            <div>
              <h2 className='text-2xl font-bold text-earth'>
                {selectedUser ? 'Chỉnh sửa khách hàng' : 'Tạo khách hàng mới'}
              </h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Email *</label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!!selectedUser}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:bg-gray-100'
                  placeholder='user@example.com'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Tên *</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Tên khách hàng'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Số điện thoại</label>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='0123456789'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Địa chỉ</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Địa chỉ khách hàng'
                  rows={3}
                />
              </div>

              {!selectedUser && (
                <div>
                  <label className='block text-sm font-semibold text-earth mb-2'>Mật khẩu *</label>
                  <input
                    type='password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                    placeholder='Tối thiểu 6 ký tự'
                  />
                </div>
              )}

              {canManageRoles && (
                <div>
                  <label className='block text-sm font-semibold text-earth mb-2'>Quyền</label>
                  <select
                    value={formData.roles[0]}
                    onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  >
                    <option value='User'>User</option>
                    <option value='Editor'>Editor</option>
                    <option value='Admin'>Admin</option>
                    <option value='SuperAdmin'>SuperAdmin</option>
                  </select>
                </div>
              )}
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedUser(null)
                  resetForm()
                }}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50'
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className='flex-1 bg-brick text-white hover:bg-brick-dark rounded-lg font-semibold py-2 transition-colors disabled:opacity-50'
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
              >
                {createUserMutation.isPending || updateUserMutation.isPending
                  ? 'Đang xử lý...'
                  : selectedUser
                  ? 'Cập nhật'
                  : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

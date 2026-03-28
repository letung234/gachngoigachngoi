import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { User } from 'src/types/user.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'
import Button from 'src/components/Button'

export default function Users() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    roles: ['Admin']
  })

  const { can } = usePermission()
  const canCreate = can(Permission.USER_CREATE)
  const canUpdate = can(Permission.USER_UPDATE)
  const canDelete = can(Permission.USER_DELETE)

  // Fetch users
  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', page, searchTerm],
    queryFn: () =>
      adminApi.getUsers({
        page,
        limit: 10,
        search: searchTerm || undefined
      })
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: any) => adminApi.createUser(data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      resetForm()
      alert('Tạo người dùng thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi tạo người dùng')
    }
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateUser(selectedUser!._id, data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      setSelectedUser(null)
      resetForm()
      alert('Cập nhật người dùng thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi cập nhật người dùng')
    }
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      refetch()
      setShowDeleteConfirm(null)
      alert('Xóa người dùng thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi xóa người dùng')
    }
  })

  // Update user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: string[] }) =>
      adminApi.updateUserRole(id, roles),
    onSuccess: () => {
      refetch()
      alert('Cập nhật quyền thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi cập nhật quyền')
    }
  })

  // Toggle user status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'disabled' }) =>
      adminApi.toggleUserStatus(id, status),
    onSuccess: () => {
      refetch()
      alert('Cập nhật trạng thái thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi cập nhật trạng thái')
    }
  })

  const handleAddUser = () => {
    setSelectedUser(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      name: user.name || '',
      password: '',
      roles: user.roles
    })
    setIsModalOpen(true)
  }

  const handleDeleteUser = (id: string) => {
    if (showDeleteConfirm === id) {
      deleteUserMutation.mutate(id)
    } else {
      setShowDeleteConfirm(id)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      roles: ['Admin']
    })
  }

  const handleSubmit = () => {
    if (!formData.email || !formData.name) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (selectedUser) {
      updateUserMutation.mutate({
        email: formData.email,
        name: formData.name,
        ...(formData.password && { password: formData.password })
      })
    } else {
      if (!formData.password || formData.password.length < 6) {
        alert('Mật khẩu phải tối thiểu 6 ký tự')
        return
      }
      createUserMutation.mutate(formData)
    }
  }

  const users = usersData?.data.users || []

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-earth'>Quản lý người dùng</h1>
          <p className='mt-2 text-gray-600'>Tổng cộng {users.length} người dùng</p>
        </div>
        {canCreate && (
          <button
            onClick={handleAddUser}
            className='rounded-lg bg-brick px-6 py-3 font-semibold text-white transition-all hover:bg-brick-dark hover:shadow-lg active:scale-95 flex items-center gap-2'
          >
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
            </svg>
            Thêm người dùng
          </button>
        )}
      </div>

      {/* Search */}
      <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-100'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Tìm kiếm</label>
          <input
            type='text'
            placeholder='Nhập email hoặc tên người dùng...'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-brick focus:ring-2 focus:ring-brick/10'
          />
        </div>
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'>
        <div className='overflow-x-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brick mb-4'></div>
                <div className='text-gray-600 font-medium'>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : (
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Email</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Tên</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Quyền</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Trạng thái</th>
                  <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className='hover:bg-gray-50 transition-colors duration-200'>
                      <td className='px-6 py-5 font-medium text-gray-900'>{user.email}</td>
                      <td className='px-6 py-5 text-gray-700'>{user.name || '—'}</td>
                      <td className='px-6 py-5'>
                        <div className='flex gap-2 flex-wrap'>
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className='inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200'
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <button
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: user._id,
                              status: user.status === 'active' ? 'disabled' : 'active'
                            })
                          }
                          className={`inline-flex rounded-full px-4 py-2 text-xs font-bold border transition-colors ${
                            user.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        </button>
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          {canUpdate && (
                            <button
                              onClick={() => handleEditUser(user)}
                              className='rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors'
                            >
                              ✏️ Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className='rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-700 border border-red-200 hover:bg-red-100 transition-colors'
                            >
                              {showDeleteConfirm === user._id ? '✓ Xác nhận' : '🗑️ Xóa'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className='px-6 py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <span className='text-3xl'>👤</span>
                        <span className='text-gray-500 font-medium'>Không tìm thấy người dùng nào</span>
                      </div>
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
                {selectedUser ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
              </h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Email</label>
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
                <label className='block text-sm font-semibold text-earth mb-2'>Tên</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Tên người dùng'
                />
              </div>

              {!selectedUser && (
                <div>
                  <label className='block text-sm font-semibold text-earth mb-2'>Mật khẩu</label>
                  <input
                    type='password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                    placeholder='Tối thiểu 6 ký tự'
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Quyền</label>
                <select
                  multiple
                  value={formData.roles}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roles: Array.from(e.target.selectedOptions, (option) => option.value)
                    })
                  }
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                >
                  <option value='User'>User</option>
                  <option value='Editor'>Editor</option>
                  <option value='Admin'>Admin</option>
                  <option value='SuperAdmin'>SuperAdmin</option>
                </select>
              </div>
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
              <Button
                onClick={handleSubmit}
                className='flex-1 bg-brick text-white hover:bg-brick-dark rounded-lg font-semibold py-2 transition-colors'
                isLoading={createUserMutation.isPending || updateUserMutation.isPending}
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
              >
                {selectedUser ? 'Cập nhật' : 'Tạo'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

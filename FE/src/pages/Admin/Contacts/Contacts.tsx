import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import adminApi from 'src/apis/admin.api'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: 'Mới', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800' },
  done: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
}

export default function AdminContacts() {
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', page, filterStatus, searchText],
    queryFn: () => adminApi.getContacts({
      page,
      limit: 10,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      search: searchText || undefined,
    }),
  })

  const { data: statsData } = useQuery({
    queryKey: ['admin-contact-stats'],
    queryFn: () => adminApi.getContactStats(),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      adminApi.updateContactStatus(id, { status, note }),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-contact-stats'] })
      setSelectedContact(null)
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteContact(id),
    onSuccess: () => {
      toast.success('Xóa liên hệ thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-contact-stats'] })
    },
    onError: () => toast.error('Xóa thất bại'),
  })

  const contactList = data?.data?.data?.contacts || []
  const pagination = data?.data?.data?.pagination || { page: 1, totalPages: 1, totalItems: 0 }
  const stats = statsData?.data?.data

  const handleExportExcel = async () => {
    try {
      const res = await adminApi.exportContacts(filterStatus !== 'all' ? filterStatus : undefined)
      const exportData = res.data.data || []

      const wsData = exportData.map((c: any, i: number) => ({
        STT: i + 1,
        'Họ tên': c.name,
        Email: c.email,
        'SĐT': c.phone,
        'Chủ đề': c.subject,
        'Nội dung': c.message,
        'Trạng thái': STATUS_MAP[c.status]?.label || c.status,
        'Ghi chú': c.note || '',
        'Ngày gửi': new Date(c.createdAt).toLocaleString('vi-VN'),
      }))

      const ws = XLSX.utils.json_to_sheet(wsData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Liên hệ')
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      saveAs(blob, 'lien-he_' + new Date().toISOString().slice(0, 10) + '.xlsx')
      toast.success('Xuất Excel thành công')
    } catch {
      toast.error('Xuất Excel thất bại')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-earth md:text-3xl'>Quản lý liên hệ</h1>
          <p className='mt-1 text-sm text-cement-dark'>Xem và xử lý các yêu cầu liên hệ từ khách hàng</p>
        </div>
        <button
          onClick={handleExportExcel}
          className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
          Xuất Excel
        </button>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-lg bg-white p-4 shadow-sm'>
            <p className='text-sm text-cement-dark'>Tổng liên hệ</p>
            <p className='mt-1 text-2xl font-bold text-earth'>{stats.total}</p>
          </div>
          <div className='rounded-lg bg-blue-50 p-4 shadow-sm'>
            <p className='text-sm text-blue-600'>Mới</p>
            <p className='mt-1 text-2xl font-bold text-blue-800'>{stats.new}</p>
          </div>
          <div className='rounded-lg bg-yellow-50 p-4 shadow-sm'>
            <p className='text-sm text-yellow-600'>Đang xử lý</p>
            <p className='mt-1 text-2xl font-bold text-yellow-800'>{stats.processing}</p>
          </div>
          <div className='rounded-lg bg-green-50 p-4 shadow-sm'>
            <p className='text-sm text-green-600'>Hoàn thành</p>
            <p className='mt-1 text-2xl font-bold text-green-800'>{stats.done}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className='flex flex-col gap-3 sm:flex-row'>
        <input
          type='text'
          placeholder='Tìm kiếm theo tên, email, SĐT...'
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setPage(1) }}
          className='flex-1 rounded-lg border border-cement-light px-4 py-2 text-sm outline-none focus:border-brick'
        />
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
          className='rounded-lg border border-cement-light px-4 py-2 text-sm outline-none focus:border-brick'
        >
          <option value='all'>Tất cả trạng thái</option>
          <option value='new'>Mới</option>
          <option value='processing'>Đang xử lý</option>
          <option value='done'>Hoàn thành</option>
        </select>
      </div>

      {/* Contact table */}
      <div className='overflow-x-auto rounded-lg bg-white shadow-sm'>
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-brick border-t-transparent' />
          </div>
        ) : contactList.length === 0 ? (
          <div className='py-12 text-center text-sm text-cement-dark'>Không có liên hệ nào</div>
        ) : (
          <table className='w-full text-left text-sm'>
            <thead className='border-b bg-cream-light text-xs uppercase text-cement-dark'>
              <tr>
                <th className='px-4 py-3'>Họ tên</th>
                <th className='px-4 py-3'>Email</th>
                <th className='px-4 py-3'>SĐT</th>
                <th className='px-4 py-3'>Chủ đề</th>
                <th className='px-4 py-3'>Trạng thái</th>
                <th className='px-4 py-3'>Ngày</th>
                <th className='px-4 py-3'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contactList.map((contact: any) => (
                <tr key={contact._id} className='border-b hover:bg-cream-light/50'>
                  <td className='px-4 py-3 font-medium text-earth'>{contact.name}</td>
                  <td className='px-4 py-3 text-cement-dark'>{contact.email}</td>
                  <td className='px-4 py-3 text-cement-dark'>{contact.phone || '-'}</td>
                  <td className='px-4 py-3 text-cement-dark'>{contact.subject || '-'}</td>
                  <td className='px-4 py-3'>
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${STATUS_MAP[contact.status]?.color || 'bg-gray-100'}`}>
                      {STATUS_MAP[contact.status]?.label || contact.status}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-cement-dark text-xs'>
                    {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className='rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100'
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Xác nhận xóa?')) deleteMutation.mutate(contact._id)
                        }}
                        className='rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100'
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded px-3 py-1 text-sm ${page === p ? 'bg-brick text-white' : 'bg-white text-earth hover:bg-cream'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedContact && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded-xl bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-earth'>Chi tiết liên hệ</h3>
              <button onClick={() => setSelectedContact(null)} className='text-cement-dark hover:text-earth'>
                ✕
              </button>
            </div>
            <div className='space-y-3 text-sm'>
              <div><span className='font-medium text-earth'>Tên:</span> {selectedContact.name}</div>
              <div><span className='font-medium text-earth'>Email:</span> {selectedContact.email}</div>
              <div><span className='font-medium text-earth'>SĐT:</span> {selectedContact.phone || '-'}</div>
              <div><span className='font-medium text-earth'>Chủ đề:</span> {selectedContact.subject || '-'}</div>
              <div>
                <span className='font-medium text-earth'>Nội dung:</span>
                <p className='mt-1 rounded bg-cream-light p-3 text-earth'>{selectedContact.message}</p>
              </div>
              <div>
                <span className='font-medium text-earth'>Ghi chú:</span>
                <textarea
                  defaultValue={selectedContact.note || ''}
                  id='contact-note'
                  className='mt-1 w-full rounded border border-cement-light px-3 py-2 text-sm outline-none focus:border-brick'
                  rows={2}
                />
              </div>
              <div className='flex items-center gap-3'>
                <span className='font-medium text-earth'>Trạng thái:</span>
                <div className='flex gap-2'>
                  {Object.entries(STATUS_MAP).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => {
                        const noteEl = document.getElementById('contact-note') as HTMLTextAreaElement
                        updateStatusMutation.mutate({
                          id: selectedContact._id,
                          status: key,
                          note: noteEl?.value,
                        })
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedContact.status === key
                          ? val.color + ' ring-2 ring-offset-1'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

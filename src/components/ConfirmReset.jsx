import { TriangleAlert } from 'lucide-react'
import { Modal, btn } from './ui.jsx'

export function ConfirmReset({ onCancel, onConfirm }) {
  return (
    <Modal label="Xác nhận đặt lại" onClose={onCancel} className="w-3xl">
      <div className="flex flex-col gap-6 p-10">
        <div className="flex items-center gap-4">
          <TriangleAlert aria-hidden="true" className="size-14 shrink-0 text-crimson-300" />
          <h2 className="text-4xl font-extrabold">Đặt lại bảng số?</h2>
        </div>
        <p className="text-balance text-2xl font-semibold leading-snug text-mist">
          Tất cả các số đã khoanh sẽ bị xóa và bảng số quay về trạng thái ban đầu. Không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-4">
          {/* focus starts on the safe choice */}
          <button type="button" data-autofocus onClick={onCancel} className={btn.ghost}>
            Hủy
          </button>
          <button type="button" onClick={onConfirm} className={btn.danger}>
            Đặt lại
          </button>
        </div>
      </div>
    </Modal>
  )
}

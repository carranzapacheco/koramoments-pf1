type Props = {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  show,
  message,
  onConfirm,
  onCancel,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#F5F1EC] border border-[#C2A46D] p-6 rounded-lg shadow-lg w-80">
        <p className="mb-4 text-[#2E2E2E] font-medium">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-[#F5F1EC] border border-[#C2A46D] text-[#2E22E] font-medium hover:bg-[#e6dfd4]"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-[#C48B9F] text-white font-medium hover:bg-[#b8738f]"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
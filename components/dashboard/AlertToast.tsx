type AlertType = "success" | "error" | "info";

type Props = {
  alert: { type: AlertType; message: string } | null;
};

export default function AlertToast({ alert }: Props) {
  if (!alert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {alert.type === "success" && (
        <div className="bg-[#C48B9F] text-white px-4 py-3 rounded-lg shadow-lg">
          ✓ {alert.message}
        </div>
      )}

      {alert.type === "error" && (
        <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">
          ✖ {alert.message}
        </div>
      )}

      {alert.type === "info" && (
        <div className="bg-[#F5F1EC] border border-[#C2A46D] text-[#2E2E2E] px-4 py-3 rounded-lg shadow-lg">
          ℹ {alert.message}
        </div>
      )}
    </div>
  );
}
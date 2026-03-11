type Props = {
  bioStatus: "idle" | "saving" | "success" | "error";
};

export default function BioToast({ bioStatus }: Props) {
  if (bioStatus === "idle") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {bioStatus === "saving" && (
        <div className="bg-[#F5F1EC] border border-[#C2A46D]
                        text-[#2E2E2E]
                        px-4 py-3 rounded-lg shadow-lg">
          💾 Guardando biografía…
        </div>
      )}

      {bioStatus === "success" && (
        <div className="bg-[#C48B9F] text-white
                        px-4 py-3 rounded-lg shadow-lg">
          ✓ Biografía actualizada
        </div>
      )}

      {bioStatus === "error" && (
        <div className="bg-red-600 text-white
                        px-4 py-3 rounded-lg shadow-lg">
          ✖ Error al guardar la biografía
        </div>
      )}
    </div>
  );
}
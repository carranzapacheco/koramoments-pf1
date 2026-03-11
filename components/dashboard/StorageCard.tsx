type Props = {
  usedMB: string;
  totalMB: string;
  percentage: number;
};

export default function StorageCard({ usedMB, totalMB, percentage }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow transition hover:shadow-lg">
      <p className="text-sm mb-2 font-medium">
        Almacenamiento usado: {usedMB} MB / {totalMB} MB
      </p>

      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor:
              percentage < 70
                ? "#C48B9F"
                : percentage < 90
                ? "#C2A46D"
                : "#dc2626",
          }}
        />
      </div>

      {percentage >= 90 && (
        <p className="text-sm text-red-600 mt-2 animate-pulse">
          ⚠️ Estás cerca del límite de almacenamiento
        </p>
      )}
    </div>
  );
}
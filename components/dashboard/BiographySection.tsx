type Props = {
  biography: string;
  setBiography: (v: string) => void;
  saveBiography: () => void;
  bioMax: number;
};

export default function BiographySection({
  biography,
  setBiography,
  saveBiography,
  bioMax,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Biografía</h2>

      <textarea
        value={biography}
        onChange={(e) =>
          setBiography(e.target.value.slice(0, bioMax + 10))
        }
        className={`w-full min-h-[140px] rounded-md border p-3
          focus:outline-none focus:ring-2
          ${
            biography.length > bioMax
              ? "border-red-500 focus:ring-red-300"
              : "focus:ring-[#C48B9F]"
          }`}
      />

      <p
        className={`text-sm mt-1 ${
          biography.length > bioMax
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {biography.length} / {bioMax} caracteres
      </p>

      <button
        onClick={saveBiography}
        disabled={biography.length > bioMax}
        className={`mt-3 px-4 py-2 rounded-md text-white transition
          ${
            biography.length > bioMax
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#C48B9F] hover:bg-[#C2A46D]"
          }`}
      >
        Guardar
      </button>
    </div>
  );
}
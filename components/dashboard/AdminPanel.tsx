type Props = {
  isAdmin: boolean;
  limpiarTodo: () => void;
};

export default function AdminPanel({ isAdmin, limpiarTodo }: Props) {
  if (!isAdmin) return null;

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-red-200">
      <button
        onClick={limpiarTodo}
        className="bg-red-600 text-white px-4 py-2 rounded-md
                   transition hover:bg-red-700 hover:scale-[1.02]"
      >
        Limpiar todo el almacenamiento
      </button>

      <p className="text-sm text-gray-500 mt-2">
        ⚠️ Acción solo para administrador. Elimina todos los archivos.
      </p>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

type Props = {
  comments: any[];
  commentName: string;
  setCommentName: (v: string) => void;
  commentText: string;
  setCommentText: (v: string) => void;
  saveComment: () => void;
  updateComment: (id: string) => void;
  deleteComment: (id: string) => void;
  editingComment: string | null;
  setEditingComment: (id: string | null) => void;
  editingText: string;
  setEditingText: (v: string) => void;
  commentNameMax: number;
  commentTextMax: number;
};

export default function CommentsSection({
  comments,
  commentName,
  setCommentName,
  commentText,
  setCommentText,
  saveComment,
  updateComment,
  deleteComment,
  editingComment,
  setEditingComment,
  editingText,
  setEditingText,
  commentNameMax,
  commentTextMax,
}: Props) {

  const [index, setIndex] = useState(0);

  const itemsPerView = 1;
  const maxIndex = Math.max(0, comments.length - itemsPerView);

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [comments.length]);

  const visibleComments = comments.slice(index, index + itemsPerView);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">

      <h2 className="text-xl font-semibold mb-6 text-center">
        Mensajes Especiales
      </h2>

      {/* FORM */}

      <div className="space-y-3 mb-8">

        <input
          value={commentName}
          onChange={(e) =>
            setCommentName(e.target.value.slice(0, commentNameMax))
          }
          placeholder="Tu nombre"
          className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#C48B9F]"
        />

        <textarea
          value={commentText}
          onChange={(e) =>
            setCommentText(e.target.value.slice(0, commentTextMax))
          }
          placeholder="Escribe tu mensaje..."
          className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#C48B9F]"
          rows={4}
        />

        <button
          onClick={saveComment}
          className="bg-[#C48B9F] hover:opacity-90 text-white px-6 py-2 rounded-lg transition"
        >
          Agregar Mensaje
        </button>

      </div>

      {/* CARRUSEL */}

      {comments.length > 0 && (

        <div className="space-y-4">

          {/* Comentario visible */}

          {visibleComments.map((c) => (

            <div
              key={c.id}
              className="border rounded-xl p-5 bg-gray-50"
            >

              {editingComment === c.id ? (

                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  />

                  <div className="flex gap-3 mt-3 text-sm">

                    <button
                      onClick={() => updateComment(c.id)}
                      className="text-green-600"
                    >
                      Guardar
                    </button>

                    <button
                      onClick={() => setEditingComment(null)}
                      className="text-gray-500"
                    >
                      Cancelar
                    </button>

                  </div>
                </>

              ) : (

                <>
                  <p className="font-semibold text-lg">
                    {c.name}
                  </p>

                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                    {c.message}
                  </p>

                  <div className="flex gap-4 mt-4 text-sm">

                    <button
                      onClick={() => {
                        setEditingComment(c.id);
                        setEditingText(c.message);
                      }}
                      className="text-blue-600"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-red-600"
                    >
                      Eliminar
                    </button>

                  </div>
                </>

              )}

            </div>

          ))}

          {/* BOTONES DEL CARRUSEL ABAJO */}

          {comments.length > 1 && (

            <div className="flex justify-center gap-4 pt-2">

              <button
                onClick={() => setIndex((prev) => prev - 1)}
                disabled={index === 0}
                className="bg-gray-100 px-4 py-2 rounded-lg shadow disabled:opacity-40"
              >
                ◀
              </button>

              <button
                onClick={() => setIndex((prev) => prev + 1)}
                disabled={index === maxIndex}
                className="bg-gray-100 px-4 py-2 rounded-lg shadow disabled:opacity-40"
              >
                ▶
              </button>

            </div>

          )}

        </div>

      )}

    </div>
  );
}
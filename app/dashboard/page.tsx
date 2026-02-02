'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  increment,
} from "firebase/firestore";

import { canUploadFile } from "@/lib/storageHelpers";

import { useStorageUsage } from "@/hooks/useStorageUsage"

import { STORAGE_LIMIT } from "@/lib/storageLimits";


import { getAuth, onAuthStateChanged } from "firebase/auth";

/* ===================== CONFIG ===================== */
const PROFILE_ID = "public";

/* ===================== LÍMITES ===================== */
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;

const BIO_MAX = 10000;
const PHOTO_DESC_MAX = 500;
const VIDEO_DESC_MAX = 500;

const COMMENT_NAME_MAX = 50;
const COMMENT_TEXT_MAX = 500;


type MediaItem = {
  url: string;
  public_id: string;
  bytes: number;
  description?: string;
  createdAt: Timestamp;
};


export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [biography, setBiography] = useState("");
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [photoDescription, setPhotoDescription] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  //nuevo para editar con los caracteres
  const [editingDescriptions, setEditingDescriptions] = useState<Record<string, string>>({});

  //nuevo para editar comentarios
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const [loading, setLoading] = useState(false);

  //nuevo para contador
  const { used, percentage } = useStorageUsage(PROFILE_ID);

  const usedMB = (used / (1024 * 1024)).toFixed(1);
  const totalMB = (STORAGE_LIMIT / (1024 * 1024)).toFixed(0);
  const storageFull = percentage >= 100;

  //para biografia el alert
  const [bioStatus, setBioStatus] = useState<
  "idle" | "saving" | "success" | "error"
  >("idle");

  //para los demas alert
  type AlertType = "success" | "error" | "info";

  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const showAlert = (message: string, type: AlertType = "info", duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), duration);
  };

  // Modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const confirmAction = (message: string, action: () => void) => {
  setConfirmMessage(message);
  setOnConfirmAction(() => action); // guarda la acción a ejecutar
  setShowConfirmModal(true); // muestra el modal
  };



  /* ===================== AUTH ===================== */
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      loadProfile();
    });
    return () => unsubscribe();
  }, []);

  /* ===================== LOAD PROFILE ===================== */
  const loadProfile = async () => {
    const ref = doc(db, "profiles", PROFILE_ID);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      // 🔧 Inicializar totalStorageUsed si no existe
      if (data.totalStorageUsed === undefined) {
        await updateDoc(ref, { totalStorageUsed: 0 });
      }

      setBiography(data.biography || "");
      setPhotos(data.photos || []);
      setVideos(data.videos || []);
    }
  };

  /* ===================== SAVE BIO ===================== */
  const saveBiography = async () => {
    try {
      setBioStatus("saving"); // muestra "guardando"

      const ref = doc(db, "profiles", PROFILE_ID);
      await setDoc(ref, { biography }, { merge: true });

      setBioStatus("success"); // muestra "guardado"

      // Oculta el toast después de 3 segundos
      setTimeout(() => {
        setBioStatus("idle");
      }, 3000);
    } catch (error) {
      setBioStatus("error"); // muestra error

      setTimeout(() => {
        setBioStatus("idle");
      }, 3000);
    }
  };

  /* ===================== UPLOAD ===================== */
  const handleUpload = async (
  type: "photos" | "videos",
  file: File | null
  ) => {
  if (storageFull) {
    showAlert("No queda espacio disponible","error");
    return;
  }

  if (!file) {
    showAlert("Selecciona un archivo","error");
    return;
  }

  // 🚫 Videos > 100 MB (Cloudinary)
  if (type === "videos") {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_VIDEO_MB) {
      showAlert(
        `Este video pesa ${sizeMB.toFixed(1)} MB.\n` +
        `Se permite videos de hasta ${MAX_VIDEO_MB} MB.`,"error"
      );
      return;
    }
  }

  // 📸 Imágenes
  if (type === "photos") {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_IMAGE_MB) {
      showAlert(`La imagen supera el límite de ${MAX_IMAGE_MB} MB`,"error");
      return;
    }
  }

  if (type === "photos" && photoDescription.length > PHOTO_DESC_MAX) {
    showAlert("Descripción de foto demasiado larga","error");
    return;
  }

  if (type === "videos" && videoDescription.length > VIDEO_DESC_MAX) {
    showAlert("Descripción de video demasiado larga","error");
    return;
  }

  // 🔒 Límite total 400 MB
  const allowed = await canUploadFile(PROFILE_ID, file.size);
  if (!allowed) {
    showAlert("Límite total de 400 MB alcanzado","error");
    return;
  }

  try {
    setLoading(true);

    const result = await uploadToCloudinary(
      file,
      type === "photos" ? "image" : "video"
    );

    const uploadedFile: MediaItem = {
      url: result.url,
      public_id: result.public_id,
      bytes: result.bytes,
      description:
        type === "photos"
          ? photoDescription.trim()
          : videoDescription.trim(),
      createdAt: Timestamp.now(),
    };

    const ref = doc(db, "profiles", PROFILE_ID);

    await setDoc(
      ref,
      { [type]: arrayUnion(uploadedFile) },
      { merge: true }
    );

    await updateDoc(ref, {
      totalStorageUsed: increment(uploadedFile.bytes),
    });

    if (type === "photos") {
      setPhotoFile(null);
      setPhotoDescription("");
    } else {
      setVideoFile(null);
      setVideoDescription("");
    }

    loadProfile();
    showAlert("Archivo subido correctamente","success");
  } catch (err) {
    console.error(err);
    showAlert("Error al subir el archivo","error");
  } finally {
    setLoading(false);
  }
};


  //nuevo para editar descripción
  const updateMediaDescription = async (
    type: "photos" | "videos",
    item: any,
    newDescription: string
  ) => {
    const MAX =
      type === "photos" ? PHOTO_DESC_MAX : VIDEO_DESC_MAX;

    if (newDescription.length > MAX) {
      showAlert(`Máximo ${MAX} caracteres`,"error");
      return;
    }

    try {
      const ref = doc(db, "profiles", PROFILE_ID);

      await updateDoc(ref, {
        [type]: arrayRemove(item),
      });

      const updatedItem = {
        ...item,
        description: newDescription,
      };

      await updateDoc(ref, {
        [type]: arrayUnion(updatedItem),
      });

      loadProfile();
    } catch (err) {
      console.error(err);
      showAlert("Error al actualizar descripción","error");
    }
  };

  //nuevo para comentarios
  const loadComments = async () => {
  const q = query(
    collection(db, "comments"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  setComments(
    snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  );
  };

  useEffect(() => {
  if (user) loadComments();
  }, [user]);

  const saveComment = async () => {
  if (!commentName.trim() || !commentText.trim()) {
    showAlert("Completa todos los campos","error");
    return;
  }

  await addDoc(collection(db, "comments"), {
    name: commentName.trim(),
    message: commentText.trim(),
    createdAt: serverTimestamp(),
  });

  setCommentName("");
  setCommentText("");
  loadComments();
  };

  const updateComment = async (id: string) => {
  if (!editingText.trim()) return;

  await updateDoc(doc(db, "comments", id), {
    message: editingText.trim(),
  });

  setEditingComment(null);
  setEditingText("");
  loadComments();
  };

  const deleteComment = (id: string) => {
    confirmAction("¿Eliminar comentario?", async () => {
      await deleteDoc(doc(db, "comments", id));
      loadComments();
    });
  };

  /* ===================== DELETE ===================== */
  const handleDelete = (type: "photos" | "videos", item: MediaItem) => {
    confirmAction("¿Eliminar archivo definitivamente?", async () => {
      try {
        const res = await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_id: item.public_id,
            resource_type: type === "photos" ? "image" : "video",
            bytes: item.bytes,
            profileId: PROFILE_ID,
          }),
        });

        const data = await res.json();

        if (data.result !== "ok" && data.result !== "not found") {
          console.error("Cloudinary error:", data);
          showAlert("No se pudo eliminar en Cloudinary","error");
          return;
        }

        const ref = doc(db, "profiles", PROFILE_ID);
        await updateDoc(ref, {
          [type]: arrayRemove(item),
          totalStorageUsed: increment(-item.bytes),
        });

        loadProfile();
      } catch (err) {
        console.error(err);
        showAlert("Error al eliminar archivo","error");
      }
    });
  };

  if (!user) return <p className="p-8">Cargando…</p>;

  /* ===================== LIMPIAR TODAS LAS CARPETAS (SOLO ADMIN) ===================== */
  const limpiarTodo = async () => {
    confirmAction("⚠️ Esto eliminará todos los archivos de fotos y videos. ¿Continuar?", async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/cloudinary/cleanFolder", { method: "POST" });
        const data = await res.json();
        showAlert("Carpetas limpiadas correctamente","success");
        loadProfile();
      } catch (err) {
        console.error(err);
        showAlert("Error al limpiar carpetas","error");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
  <div className="p-8 max-w-5xl mx-auto bg-[#F5F1EC] text-[#2E2E2E] space-y-12">

    <h1 className="text-3xl font-semibold tracking-tight">
      Dashboard
    </h1>

    {/* ===================== STORAGE ===================== */}
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

    {/* ===================== ADMIN ===================== */}
    {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
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
    )}

    {/* ===================== BIO ===================== */}
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Biografía</h2>

      <textarea
        value={biography}
        onChange={(e) =>
          setBiography(e.target.value.slice(0, BIO_MAX + 10))
        }
        className={`w-full min-h-[140px] rounded-md border p-3
          focus:outline-none focus:ring-2
          ${
            biography.length > BIO_MAX
              ? "border-red-500 focus:ring-red-300"
              : "focus:ring-[#C48B9F]"
          }`}
      />

      <p
        className={`text-sm mt-1 ${
          biography.length > BIO_MAX
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {biography.length} / {BIO_MAX} caracteres
      </p>

      <button
        onClick={saveBiography}
        disabled={biography.length > BIO_MAX}
        className={`mt-3 px-4 py-2 rounded-md text-white transition
          ${
            biography.length > BIO_MAX
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#C48B9F] hover:bg-[#C2A46D]"
          }`}
      >
        Guardar
      </button>
    </div>

    {/* ===================== FOTOS ===================== */}
    <div className="bg-white p-5 rounded-xl shadow space-y-4">
      <h2 className="font-semibold">
        Fotos <span className="text-sm text-gray-500">(según espacio)</span>
      </h2>

    <input
      type="file"
      accept="image/*"
      id="photoInput"
      className="hidden"
      onChange={(e) =>
        setPhotoFile(e.target.files?.[0] || null)
      }
    />

    <button
      type="button"
      onClick={() =>
        document.getElementById("photoInput")?.click()
      }
      className="px-4 py-2 rounded-md
                bg-[#F5F1EC]
                border border-[#C48B9F]
                text-[#2E2E2E]
                font-medium
                hover:bg-[#C48B9F] hover:text-white
                transition-all duration-200
                hover:scale-[1.02]"
    >
      Seleccionar foto
    </button>

    <div
      className={`mt-3 overflow-hidden transition-all duration-300 ease-out
        ${photoFile ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      {photoFile && (
        <div className="bg-[#F5F1EC] rounded-lg p-3 flex gap-3 items-start">
          <img
            src={URL.createObjectURL(photoFile)}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-md shadow"
          />

          <div className="text-sm text-gray-700 space-y-1">
            <p>📸 <span className="font-medium">{photoFile.name}</span></p>
            <p>📦 {(photoFile.size / 1024 / 1024).toFixed(2)} MB</p>

            <button
              type="button"
              onClick={() => setPhotoFile(null)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Quitar archivo
            </button>
          </div>
        </div>
      )}
    </div>


      <input
        type="text"
        placeholder="Descripción de la foto"
        value={photoDescription}
        onChange={(e) =>
          setPhotoDescription(
            e.target.value.slice(0, PHOTO_DESC_MAX + 10)
          )
        }
        className={`w-full border rounded-md p-2 ${
          photoDescription.length > PHOTO_DESC_MAX
            ? "border-red-500"
            : ""
        }`}
      />

      <p className={`text-sm ${
        photoDescription.length > PHOTO_DESC_MAX
          ? "text-red-600"
          : "text-gray-500"
      }`}>
        {photoDescription.length} / {PHOTO_DESC_MAX}
      </p>

      <button
        disabled={
          loading ||
          !photoFile ||
          photoDescription.length > PHOTO_DESC_MAX ||
          storageFull
        }
        onClick={() => handleUpload("photos", photoFile)}
        className="px-4 py-2 rounded-md text-white
                   bg-[#C48B9F] hover:bg-[#C2A46D]
                   transition disabled:bg-gray-400"
      >
        Subir foto
      </button>

      <div className="flex flex-wrap gap-4 pt-4">
        {photos.map((item, index) => {
          const value =
            editingDescriptions[item.public_id] ??
            item.description ?? "";
          const exceeded = value.length > PHOTO_DESC_MAX;

          return (
            <div
              key={item.public_id ?? index}
              className="w-[140px] bg-[#F5F1EC] p-2 rounded-lg
                         transition hover:shadow-md"
            >
              <img src={item.url} className="rounded mb-1" />

              <textarea
                value={value}
                onChange={(e) =>
                  setEditingDescriptions({
                    ...editingDescriptions,
                    [item.public_id]: e.target.value,
                  })
                }
                className={`w-full text-sm border rounded p-1 ${
                  exceeded ? "border-red-500" : ""
                }`}
              />

              <p className={`text-xs ${
                exceeded ? "text-red-600" : "text-gray-500"
              }`}>
                {value.length} / {PHOTO_DESC_MAX}
              </p>

              <button
                disabled={exceeded}
                onClick={() =>
                  updateMediaDescription("photos", item, value)
                }
                className="w-full text-sm mt-1 rounded
                           bg-[#C48B9F] text-white
                           hover:bg-[#C2A46D] transition
                           disabled:bg-gray-400"
              >
                Guardar
              </button>

              <button
                onClick={() => handleDelete("photos", item)}
                className="w-full text-sm mt-1 text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>

        {/* ===================== VIDEOS ===================== */}
    <div className="bg-white p-5 rounded-xl shadow space-y-4">
      <h2 className="font-semibold">
        Videos{" "}
        <span className="text-sm text-gray-500">
          (hasta 100 MB, según espacio disponible)
        </span>
      </h2>

    <input
      type="file"
      accept="video/*"
      id="videoInput"
      className="hidden"
      onChange={(e) =>
        setVideoFile(e.target.files?.[0] || null)
      }
    />

    <button
      type="button"
      onClick={() =>
        document.getElementById("videoInput")?.click()
      }
      className="px-4 py-2 rounded-md
                bg-[#F5F1EC]
                border border-[#C48B9F]
                text-[#2E2E2E]
                font-medium
                hover:bg-[#C48B9F] hover:text-white
                transition-all duration-200
                hover:scale-[1.02]"
    >
      Seleccionar video
    </button>

    <div
      className={`mt-3 transition-all duration-300 ease-out
        ${videoFile ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      {videoFile && (
        <div className="bg-[#F5F1EC] rounded-lg p-3 text-sm text-gray-700">
          <p>🎥 <span className="font-medium">{videoFile.name}</span></p>
          <p>📦 {(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>

          <button
            type="button"
            onClick={() => setVideoFile(null)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Quitar archivo
          </button>
        </div>
      )}
    </div>


  <input
    type="text"
    placeholder="Descripción del video"
    value={videoDescription}
    onChange={(e) =>
      setVideoDescription(
        e.target.value.slice(0, VIDEO_DESC_MAX + 10)
      )
    }
    className={`w-full border rounded-md p-2
      focus:outline-none focus:ring-2
      ${
        videoDescription.length > VIDEO_DESC_MAX
          ? "border-red-500 focus:ring-red-300"
          : "focus:ring-[#C48B9F]"
      }`}
  />

  <p
    className={`text-sm ${
      videoDescription.length > VIDEO_DESC_MAX
        ? "text-red-600"
        : "text-gray-500"
    }`}
  >
    {videoDescription.length} / {VIDEO_DESC_MAX}
  </p>

  <button
    disabled={
      loading ||
      !videoFile ||
      videoDescription.length > VIDEO_DESC_MAX ||
      storageFull
    }
    onClick={() => handleUpload("videos", videoFile)}
    className="px-4 py-2 rounded-md text-white
               bg-[#C48B9F] hover:bg-[#C2A46D]
               transition-all duration-200
               hover:scale-[1.02]
               disabled:bg-gray-400"
  >
    Subir video
  </button>

  {storageFull && (
    <p className="text-sm text-red-600 animate-pulse">
      No queda espacio disponible
    </p>
  )}

  <div className="flex flex-wrap gap-6 pt-4">
    {videos.map((item, index) => {
      const value =
        editingDescriptions[item.public_id] ??
        item.description ??
        "";

      const exceeded = value.length > VIDEO_DESC_MAX;

      return (
        <div
          key={item.public_id ?? index}
          className="w-[240px] bg-[#F5F1EC] p-3 rounded-xl
                     shadow-sm transition-all duration-300
                     hover:shadow-lg hover:-translate-y-1"
        >
          <video
            src={item.url}
            controls
            className="rounded-lg mb-2 w-full"
          />

          <textarea
            value={value}
            onChange={(e) =>
              setEditingDescriptions({
                ...editingDescriptions,
                [item.public_id]: e.target.value,
              })
            }
            className={`w-full text-sm border rounded-md p-2
              focus:outline-none focus:ring-2
              ${
                exceeded
                  ? "border-red-500 focus:ring-red-300"
                  : "focus:ring-[#C48B9F]"
              }`}
          />

          <p
            className={`text-xs mt-1 ${
              exceeded ? "text-red-600" : "text-gray-500"
            }`}
          >
            {value.length} / {VIDEO_DESC_MAX}
          </p>

          <button
            disabled={exceeded}
            onClick={() =>
              updateMediaDescription("videos", item, value)
            }
            className="w-full text-sm mt-2 py-1.5 rounded-md
                       bg-[#C48B9F] text-white
                       hover:bg-[#C2A46D]
                       transition disabled:bg-gray-400"
          >
            Guardar
          </button>

          <button
            onClick={() => handleDelete("videos", item)}
            className="w-full text-sm mt-1 text-red-500
                       hover:text-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      );
    })}
  </div>
</div>
{/* ===================== COMENTARIOS ===================== */}
<div className="bg-white p-6 rounded-xl shadow space-y-6">
  <h2 className="text-xl font-semibold">
    Comentarios{" "}
  </h2>

  {/* NUEVO COMENTARIO */}
  <div className="bg-[#F5F1EC] p-4 rounded-xl space-y-3">
    <input
      type="text"
      placeholder="Nombre"
      value={commentName}
      onChange={(e) =>
        setCommentName(
          e.target.value.slice(0, COMMENT_NAME_MAX)
        )
      }
      className="w-full border rounded-md p-2
                 focus:outline-none focus:ring-2
                 focus:ring-[#C48B9F]"
    />

    <textarea
      placeholder="Comentario"
      value={commentText}
      onChange={(e) =>
        setCommentText(
          e.target.value.slice(0, COMMENT_TEXT_MAX)
        )
      }
      className="w-full min-h-[110px] border rounded-md p-2
                 focus:outline-none focus:ring-2
                 focus:ring-[#C48B9F]"
    />

    <p className="text-sm text-gray-500">
      {commentText.length} / {COMMENT_TEXT_MAX}
    </p>

    <button
      onClick={saveComment}
      className="px-4 py-2 rounded-md text-white
                 bg-[#C48B9F] hover:bg-[#C2A46D]
                 transition hover:scale-[1.02]"
    >
      Agregar comentario
    </button>
  </div>

  {/* LISTADO */}
  <div className="space-y-4">
    {comments.map((c) => (
      <div
        key={c.id}
        className="border rounded-xl p-4
                   transition hover:shadow-md"
      >
        <p className="font-semibold">{c.name}</p>

        {editingComment === c.id ? (
          <>
            <textarea
              value={editingText}
              onChange={(e) =>
                setEditingText(e.target.value)
              }
              className="w-full border rounded-md p-2 mt-2
                         focus:outline-none focus:ring-2
                         focus:ring-[#C48B9F]"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => updateComment(c.id)}
                className="px-3 py-1 rounded-md text-white
                           bg-[#C48B9F] hover:bg-[#C2A46D]
                           transition"
              >
                Guardar
              </button>

              <button
                onClick={() => {
                  setEditingComment(null);
                  setEditingText("");
                }}
                className="px-3 py-1 rounded-md bg-gray-300
                           hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm">{c.message}</p>

            <div className="flex gap-4 mt-3 text-sm">
              <button
                onClick={() => {
                  setEditingComment(c.id);
                  setEditingText(c.message);
                }}
                className="text-[#C48B9F] hover:text-[#C2A46D]
                           transition-colors"
              >
                Editar
              </button>

              <button
                onClick={() => deleteComment(c.id)}
                className="text-red-500 hover:text-red-700
                           transition-colors"
              >
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    ))}
  </div>
</div>
  {/* boton de guardar bio  */}
  {/* ===================== TOAST BIO ===================== */}
  <div
    className={`fixed bottom-6 right-6 z-50
      transition-all duration-300 ease-out
      ${
        bioStatus === "idle"
          ? "opacity-0 translate-y-4 pointer-events-none"
          : "opacity-100 translate-y-0"
      }
    `}
  >
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

  {alert && (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out ${
        alert ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
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
  )}

  {/* ===================== CONFIRMACIÓN ===================== */}
  {showConfirmModal && (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#F5F1EC] border border-[#C2A46D] p-6 rounded-lg shadow-lg w-80">
        <p className="mb-4 text-[#2E2E2E] font-medium">{confirmMessage}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-[#F5F1EC] border border-[#C2A46D] text-[#2E2E2E] font-medium hover:bg-[#e6dfd4]"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-[#C48B9F] text-white font-medium hover:bg-[#b8738f]"
            onClick={() => {
              onConfirmAction(); // ejecuta la acción confirmada
              setShowConfirmModal(false); // cierra el modal
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )}


</div>
  );
}

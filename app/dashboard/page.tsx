'use client';

import StorageCard from "@/components/dashboard/StorageCard";
import AdminPanel from "@/components/dashboard/AdminPanel";
import BiographySection from "@/components/dashboard/BiographySection";
import PhotosSection from "@/components/dashboard/PhotosSection";
import VideosSection from "@/components/dashboard/VideosSection";
import CommentsSection from "@/components/dashboard/CommentsSection";
import BioToast from "@/components/dashboard/BioToast";
import AlertToast from "@/components/dashboard/AlertToast";
import ConfirmModal from "@/components/dashboard/ConfirmModal";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { uploadVideoDirectToCloudinary } from "@/lib/uploadVideoDirect";
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

    const result =
      type === "videos"
        ? await uploadVideoDirectToCloudinary(file)
        : await uploadToCloudinary(file, "image");

    console.log("RESULT CLOUDINARY:", result);

    if (!result?.url || !result?.public_id || !result?.bytes) {
      throw new Error("Upload incompleto a Cloudinary");
    }

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <>
          <StorageCard
            usedMB={usedMB}
            totalMB={totalMB}
            percentage={percentage}
          />

          <AdminPanel
            isAdmin={user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            limpiarTodo={limpiarTodo}
          />

          <BiographySection
            biography={biography}
            setBiography={setBiography}
            saveBiography={saveBiography}
            bioMax={BIO_MAX}
          />

          <PhotosSection
            photos={photos}
            photoFile={photoFile}
            setPhotoFile={setPhotoFile}
            photoDescription={photoDescription}
            setPhotoDescription={setPhotoDescription}
            handleUpload={handleUpload}
            updateMediaDescription={updateMediaDescription}
            handleDelete={handleDelete}
            loading={loading}
            storageFull={storageFull}
            editingDescriptions={editingDescriptions}
            setEditingDescriptions={setEditingDescriptions}
            photoDescMax={PHOTO_DESC_MAX}
          />

          <VideosSection
            videos={videos}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            videoDescription={videoDescription}
            setVideoDescription={setVideoDescription}
            handleUpload={handleUpload}
            updateMediaDescription={updateMediaDescription}
            handleDelete={handleDelete}
            loading={loading}
            storageFull={storageFull}
            editingDescriptions={editingDescriptions}
            setEditingDescriptions={setEditingDescriptions}
            videoDescMax={VIDEO_DESC_MAX}
          />

          <CommentsSection
            comments={comments}
            commentName={commentName}
            setCommentName={setCommentName}
            commentText={commentText}
            setCommentText={setCommentText}
            saveComment={saveComment}
            updateComment={updateComment}
            deleteComment={deleteComment}
            editingComment={editingComment}
            setEditingComment={setEditingComment}
            editingText={editingText}
            setEditingText={setEditingText}
            commentNameMax={COMMENT_NAME_MAX}
            commentTextMax={COMMENT_TEXT_MAX}
          />

          <BioToast bioStatus={bioStatus} />
          <AlertToast alert={alert} />

          <ConfirmModal
            show={showConfirmModal}
            message={confirmMessage}
            onCancel={() => setShowConfirmModal(false)}
            onConfirm={() => {
              onConfirmAction();
              setShowConfirmModal(false);
            }}
          />
        </>
      </div>     
    </div>
    );
  }

import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { STORAGE_LIMIT } from "./storageLimits";

export const canUploadFile = async (
  profileId: string,
  fileSize: number
) => {
  const ref = doc(db, "profiles", profileId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return false;

  const used = snap.data().totalStorageUsed || 0;

  return used + fileSize <= STORAGE_LIMIT;
};

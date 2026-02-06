import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { STORAGE_LIMIT } from "@/lib/storageLimits";

export const useStorageUsage = (profileId: string) => {
  const [used, setUsed] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const ref = doc(db, "profiles", profileId);

    // Listener en tiempo real
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.data();
      const usedBytes = data?.totalStorageUsed || 0;
      setUsed(usedBytes);
      setPercentage((usedBytes / STORAGE_LIMIT) * 100);
    });

    return () => unsubscribe();
  }, [profileId]);

  return { used, percentage };
};

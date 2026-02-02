import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { STORAGE_LIMIT } from "@/lib/storageLimits";

export const useStorageUsage = (profileId: string) => {
  const [used, setUsed] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const ref = doc(db, "profiles", profileId);

    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const usedBytes = snap.data().totalStorageUsed || 0;
      setUsed(usedBytes);
      setPercentage(
        Math.min(
          Math.round((usedBytes / STORAGE_LIMIT) * 100),
          100
        )
      );
    });
  }, [profileId]);

  return { used, percentage };
};

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const AuthChecker = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const CheckToken = async () => {
      const BlurbyToken = localStorage.getItem("blurbyToken");
      if (BlurbyToken) {
        try {
          const fetchResponse = await axios.get("/api/user/get", {
            headers: { Authorization: `Bearer ${BlurbyToken}` },
          });

          console.log(fetchResponse);

          if (fetchResponse.status === 200) {
            // ✅ this is the correct way to check
            router.push("/dashboard"); // Navigate fast to dashboard
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (pathname === "/") {
      CheckToken();
    }
  }, [pathname]);

  return null; // 👉 it's just a checker, no UI
};

export default AuthChecker;

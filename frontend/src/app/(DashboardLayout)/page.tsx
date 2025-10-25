"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RootPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard page
    router.push("/dashboard");
  }, [router]);

  return null;
};

export default RootPage;

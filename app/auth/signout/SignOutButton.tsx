"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const onClick = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <button
      onClick={onClick}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}

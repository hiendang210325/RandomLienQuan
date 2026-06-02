export interface AdminSession {
  token: string;
  user: {
    email: string;
    role: "admin";
  };
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export const loginAdmin = async (
  email: string,
  password: string,
): Promise<AdminSession> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Admin login failed");
  }

  return data;
};

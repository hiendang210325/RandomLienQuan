import { useEffect, useRef, useState } from "react";
import { Character, GalleryItem } from "./types";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import UserSpinPage from "./pages/UserSpinPage";
import { AdminSession } from "./services/authApi";

const ADMIN_SESSION_KEY = "adminSession";

const getStoredAdminSession = (): AdminSession | null => {
  const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const session = JSON.parse(storedSession) as AdminSession;
    return session.user?.role === "admin" ? session : null;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(
    getStoredAdminSession,
  );
  const [characters, setCharacters] = useState<Character[]>([]);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState<string>('');
  const spinFetchOverridesRef = useRef<Record<string, boolean>>({});

  const setSpinFetchOverride = (id: string, showInSpin: boolean) => {
    spinFetchOverridesRef.current = {
      ...spinFetchOverridesRef.current,
      [id]: showInSpin,
    };
  };

  const clearSpinFetchOverride = (id: string) => {
    if (!Object.prototype.hasOwnProperty.call(spinFetchOverridesRef.current, id)) {
      return;
    }

    const nextOverrides = { ...spinFetchOverridesRef.current };
    delete nextOverrides[id];
    spinFetchOverridesRef.current = nextOverrides;
  };

  const mergeSpinFetchOverrides = (serverCharacters: Character[]) => {
    const overrides = spinFetchOverridesRef.current;
    let nextOverrides = overrides;

    const mergedCharacters = serverCharacters.map((character) => {
      if (!Object.prototype.hasOwnProperty.call(overrides, character.id)) {
        return character;
      }

      const overrideValue = overrides[character.id];

      if (character.showInSpin === overrideValue) {
        if (nextOverrides === overrides) {
          nextOverrides = { ...overrides };
        }

        delete nextOverrides[character.id];
        return character;
      }

      return { ...character, showInSpin: overrideValue };
    });

    if (nextOverrides !== overrides) {
      spinFetchOverridesRef.current = nextOverrides;
    }

    return mergedCharacters;
  };

  useEffect(() => {
    let fetchRequestId = 0;
    let refreshTimer: number | undefined;

    const fetchCharacters = () => {
      const requestId = ++fetchRequestId;

      fetch('/api/characters', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && requestId === fetchRequestId) {
            setCharacters(mergeSpinFetchOverrides(data));
          }
        })
        .catch(console.error);
    };

    const scheduleFetchCharacters = () => {
      if (refreshTimer !== undefined) {
        window.clearTimeout(refreshTimer);
      }

      refreshTimer = window.setTimeout(fetchCharacters, 150);
    };

    fetchCharacters();

    const sse = new EventSource('/api/characters/stream');
    sse.onmessage = (e) => {
      if (e.data === 'update') {
        scheduleFetchCharacters();
      }
    };

    fetch('/api/galleries')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGalleries(data);
        }
      })
      .catch(console.error);
      
    fetch('/api/settings/backgroundVideoUrl')
      .then(res => res.json())
      .then(data => {
        if (data && data.value) {
          setBackgroundVideoUrl(data.value);
        }
      })
      .catch(console.error);

    return () => {
      if (refreshTimer !== undefined) {
        window.clearTimeout(refreshTimer);
      }

      sse.close();
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const replacePath = (nextPath: string) => {
    window.history.replaceState(null, "", nextPath);
    setPath(nextPath);
  };

  const handleAdminLogin = (session: AdminSession) => {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    setAdminSession(session);
    replacePath("/admin");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminSession(null);
    replacePath("/admin/login");
  };

  const isAdminRoute = path === "/admin" || path === "/admin/login";

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col bg-[#050505] text-[#e0d8cf] font-serif select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #050505 100%)",
      }}
    >
      <main className="flex-1 flex relative overflow-hidden">
        {isAdminRoute ? (
          adminSession?.user.role === "admin" ? (
            <AdminPage
              characters={characters}
              setCharacters={setCharacters}
              setSpinFetchOverride={setSpinFetchOverride}
              clearSpinFetchOverride={clearSpinFetchOverride}
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLoginPage onLogin={handleAdminLogin} />
          )
        ) : (
          <UserSpinPage 
            characters={characters} 
            galleries={galleries} 
            backgroundVideoUrl={backgroundVideoUrl} 
          />
        )}
      </main>

      {/* <footer className="h-12 px-6 md:px-10 border-t border-[#c5a059]/10 bg-black/80 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] opacity-50 z-50">
        <span>&copy; 2024 Arcanum Digital Entertainment</span>
        <div className="hidden md:flex gap-10">
          <span>V. 1.2.4 Production</span>
          <span>Server Status: Divine</span>
        </div>
      </footer> */}
    </div>
  );
}

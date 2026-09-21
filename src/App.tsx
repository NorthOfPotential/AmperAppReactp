import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./state/AuthContext";
import LoginPage from "./pages/LoginPage";
import GuestUnlockPage from "./pages/GuestUnlockPage";
import SignUpPage from "./pages/SignUpPage";
import MainMenuPage from "./pages/MainMenuPage";
import BrowseCardsPage from "./pages/BrowseCardsPage";
import CardDetailPage from "./pages/CardDetailPage";
import TemplatePage from "./pages/TemplatePage";
import ComicPage from "./pages/ComicPage";
import VideoPage from "./pages/VideoPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import type { ReactElement } from "react";

function RequireAuth({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/guest" element={<GuestUnlockPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/menu"
        element={
          <RequireAuth>
            <MainMenuPage />
          </RequireAuth>
        }
      />
      <Route
        path="/browse"
        element={
          <RequireAuth>
            <BrowseCardsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/playlists"
        element={
          <RequireAuth>
            <PlaylistsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/playlists/:playlistId"
        element={
          <RequireAuth>
            <BrowseCardsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/card/:cardId"
        element={
          <RequireAuth>
            <CardDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/card/:cardId/template"
        element={
          <RequireAuth>
            <TemplatePage />
          </RequireAuth>
        }
      />
      <Route
        path="/card/:cardId/comic"
        element={
          <RequireAuth>
            <ComicPage />
          </RequireAuth>
        }
      />
      <Route
        path="/card/:cardId/video"
        element={
          <RequireAuth>
            <VideoPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

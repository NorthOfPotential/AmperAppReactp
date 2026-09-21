import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function MainMenuPage() {
  const { displayName, isGuest, logOut } = useAuth();
  const navigate = useNavigate();
  const [showCaseFilm, setShowCaseFilm] = useState(false);
  const [showTourGuide, setShowTourGuide] = useState(false);

  return (
    <div className="screen">
      <div className="screen-body main-menu">
        <div className="profile-row">
          <span className="profile-icon">👤</span>
          {isGuest ? "Guest" : displayName}
          <button className="btn-ghost" style={{ marginLeft: "auto" }} onClick={logOut}>
            Log out
          </button>
        </div>

        <div className="wordmark">AMPER APP</div>

        <button className="text-link text-link-accent" onClick={() => setShowCaseFilm(true)}>
          Case Film
        </button>

        <div className="main-menu-actions">
          <button className="btn btn-primary" onClick={() => navigate("/browse")}>
            Amper Cards
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/playlists")}
            disabled={isGuest}
          >
            Mixtapes
          </button>
        </div>

        <button className="text-link" onClick={() => setShowTourGuide(true)}>
          Tour Guide
        </button>

        <div className="main-menu-footer">
          <span className="version-text">Version 1.2.2</span>
          <div className="brand-logo">
            <span className="amp-glyph">&amp;</span>
            <span>Ampersand</span>
            <span className="associates">Associates</span>
          </div>
        </div>
      </div>

      {showCaseFilm && (
        <div className="modal-backdrop" onClick={() => setShowCaseFilm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Case Film</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              The case film video isn't available in this recreation.
            </p>
            <button className="btn btn-secondary" onClick={() => setShowCaseFilm(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showTourGuide && (
        <div className="modal-backdrop" onClick={() => setShowTourGuide(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Tour Guide</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              The guided walkthrough isn't available in this recreation.
            </p>
            <button className="btn btn-secondary" onClick={() => setShowTourGuide(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

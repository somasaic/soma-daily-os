import { useState } from 'react'
import { useDashboard } from '../../../store/DashboardContext'

const PLAYLISTS = [
  { label: '🎵 Lo-fi Hip Hop', url: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4euo32A' },
  { label: '⚡ Deep Focus', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { label: '🎹 Piano Focus', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
  { label: '🧠 Brain Food', url: 'https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7' },
]

export default function FocusMusic({ toast }) {
  const { state, dispatch } = useDashboard()
  const { focusPlaylist } = state
  const [customUrl, setCustomUrl] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  function openPlaylist(url) {
    dispatch({ type: 'SET_PLAYLIST', payload: url })
    window.open(url, '_blank', 'noopener')
  }

  function saveCustom() {
    if (customUrl.trim()) {
      dispatch({ type: 'SET_PLAYLIST', payload: customUrl.trim() })
      window.open(customUrl.trim(), '_blank', 'noopener')
      setCustomUrl('')
      setShowCustom(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Focus Music</span>
        {focusPlaylist && (
          <button className="card-action" onClick={() => window.open(focusPlaylist, '_blank', 'noopener')}>
            ▶ Resume
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {PLAYLISTS.map(p => (
          <button key={p.url} className="music-btn" style={{ width: 'auto', padding: '7px 14px', fontSize: 12 }} onClick={() => openPlaylist(p.url)}>
            {p.label}
          </button>
        ))}
        <button
          className="btn-sm-ghost"
          onClick={() => setShowCustom(s => !s)}
          style={{ alignSelf: 'center' }}
        >
          + Custom
        </button>
      </div>

      {showCustom && (
        <div className="music-url-row">
          <input
            placeholder="Paste Spotify / YouTube URL…"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveCustom()}
          />
          <button className="btn-sm" onClick={saveCustom}>Open</button>
        </div>
      )}
    </div>
  )
}

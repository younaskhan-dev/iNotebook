import React from 'react';

export default function Alert(props) {
  const capitalize = (word) => {
    if (!word) return '';
    const w = word === 'danger' ? 'error' : word;
    return w.charAt(0).toUpperCase() + w.slice(1);
  };

  const colorMap = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#34d399', icon: 'fa-solid fa-circle-check' },
    danger:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  color: '#f87171', icon: 'fa-solid fa-circle-xmark' },
    warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24', icon: 'fa-solid fa-triangle-exclamation' },
    info:    { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', color: '#60a5fa', icon: 'fa-solid fa-circle-info' },
  };

  if (!props.Alert) return null;

  const c = colorMap[props.Alert.type] || colorMap.info;

  return (
    <div className="app-alert" style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 9999, width: 'min(92vw, 420px)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 18px', borderRadius: '12px',
        background: c.bg, border: `1px solid ${c.border}`,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        animation: 'alertSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        fontFamily: "'Outfit', sans-serif",
      }}>
        <i className={c.icon} style={{ color: c.color, fontSize: '1.1rem', flexShrink: 0 }}></i>
        <div style={{ flex: 1 }}>
          <strong style={{ color: c.color, fontSize: '0.88rem' }}>{capitalize(props.Alert.type)}: </strong>
          <span style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{props.Alert.msg}</span>
        </div>
        {props.dismissAlert && (
          <button 
            onClick={props.dismissAlert} 
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', transition: 'background 0.2s, color 0.2s', outline: 'none'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
            aria-label="Close alert"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
      <style>{`
        @keyframes alertSlideIn {
          from { opacity: 0; transform: translateX(30px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        /* Responsive adjustments for very small screens */
        @media (max-width: 420px) {
          .app-alert { right: 8px !important; left: 8px !important; width: calc(100% - 16px) !important; }
        }
      `}</style>
    </div>
  );
}

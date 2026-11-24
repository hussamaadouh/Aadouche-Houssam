export function ColombianBackdrop() {
  return (
    <div
      aria-hidden="true"
      data-testid="colombian-animated-backdrop"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Rich warm roasted-coffee & night-canopy base (never white) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 15%, rgba(252, 209, 22, 0.14), transparent 42%), radial-gradient(circle at 85% 25%, rgba(206, 17, 38, 0.12), transparent 40%), radial-gradient(circle at 50% 82%, rgba(20, 83, 45, 0.24), transparent 52%), linear-gradient(180deg, #16110D 0%, #1C1510 50%, #111612 100%)',
        }}
      />

      {/* Animated Waving Colombian Flag Tricolor Ribbons (Yellow / Blue / Red) */}
      <svg
        viewBox="0 0 1440 520"
        preserveAspectRatio="none"
        className="colombia-anim-wave absolute -top-6 -left-12 w-[112%] h-[420px] opacity-[0.34]"
      >
        {/* Yellow band */}
        <path
          d="M0,45 C240,125 480,-10 740,65 C1010,145 1230,20 1440,80 L1440,210 C1230,150 1010,275 740,195 C480,120 240,255 0,175 Z"
          fill="#FCD116"
        />
        {/* Blue band */}
        <path
          d="M0,175 C240,255 480,120 740,195 C1010,275 1230,150 1440,210 L1440,275 C1230,215 1010,340 740,260 C480,185 240,320 0,240 Z"
          fill="#003893"
        />
        {/* Red band */}
        <path
          d="M0,240 C240,320 480,185 740,260 C1010,340 1230,215 1440,275 L1440,340 C1230,280 1010,405 740,325 C480,250 240,385 0,305 Z"
          fill="#CE1126"
        />
      </svg>

      {/* Secondary lower tricolor ribbon wave */}
      <svg
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        style={{ animationDelay: '-4.5s' }}
        className="colombia-anim-wave absolute bottom-0 -right-12 w-[112%] h-[340px] opacity-[0.26]"
      >
        <path
          d="M0,180 C280,110 540,250 820,170 C1100,90 1280,210 1440,150 L1440,240 C1280,300 1100,180 820,260 C540,340 280,200 0,270 Z"
          fill="#FCD116"
        />
        <path
          d="M0,270 C280,200 540,340 820,260 C1100,180 1280,300 1440,240 L1440,290 C1280,350 1100,230 820,310 C540,390 280,250 0,320 Z"
          fill="#003893"
        />
        <path
          d="M0,320 C280,250 540,390 820,310 C1100,230 1280,350 1440,290 L1440,340 C1280,400 1100,280 820,360 C540,440 280,300 0,370 Z"
          fill="#CE1126"
        />
      </svg>

      {/* Festive Colombian Tricolor Papel Picado Bunting along top */}
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="colombia-anim-sway absolute top-14 left-0 w-full h-20 opacity-80"
      >
        <path
          d="M0,8 Q360,52 720,18 T1440,14"
          fill="none"
          stroke="#A89F91"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {[
          { x: 90, y: 20, color: '#FCD116' },
          { x: 210, y: 31, color: '#1D4ED8' },
          { x: 330, y: 36, color: '#CE1126' },
          { x: 450, y: 32, color: '#FCD116' },
          { x: 570, y: 24, color: '#1D4ED8' },
          { x: 690, y: 19, color: '#CE1126' },
          { x: 810, y: 12, color: '#FCD116' },
          { x: 930, y: 8, color: '#1D4ED8' },
          { x: 1050, y: 8, color: '#CE1126' },
          { x: 1170, y: 10, color: '#FCD116' },
          { x: 1290, y: 12, color: '#1D4ED8' },
          { x: 1380, y: 14, color: '#CE1126' },
        ].map((flag, i) => (
          <g key={i} transform={`translate(${flag.x}, ${flag.y})`}>
            <path d="M-22,0 L22,0 L16,34 L0,26 L-16,34 Z" fill={flag.color} fillOpacity="0.9" />
            <circle cx="0" cy="13" r="3" fill="#14100D" fillOpacity="0.8" />
          </g>
        ))}
      </svg>

      {/* Floating Colombian Food & Cultural Motifs */}
      {/* 1. Sombrero Vueltiao (Top Left) */}
      <div className="colombia-anim-float absolute top-28 left-[3%] w-24 h-24 opacity-[0.22] sm:opacity-[0.45]">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <ellipse cx="60" cy="72" rx="52" ry="18" fill="#E7DFD1" stroke="#14100D" strokeWidth="2.5" />
          <ellipse cx="60" cy="72" rx="40" ry="11" fill="none" stroke="#14100D" strokeWidth="2" strokeDasharray="5 4" />
          <path d="M35,66 C38,34 82,34 85,66 Z" fill="#F5EFE6" stroke="#14100D" strokeWidth="2.5" />
          <path d="M37,56 L83,56 L84,64 L36,64 Z" fill="#14100D" />
          <path d="M44,56 L48,64 M54,56 L58,64 M64,56 L68,64 M74,56 L78,64" stroke="#F5EFE6" strokeWidth="2" />
        </svg>
      </div>

      {/* 2. Golden Empanada & Ají (Top Right) */}
      <div
        style={{ animationDelay: '-3s' }}
        className="colombia-anim-float-alt absolute top-32 right-[4%] w-24 h-24 opacity-[0.24] sm:opacity-[0.48]"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <path
            d="M20,76 C22,36 98,36 100,76 C75,84 45,84 20,76 Z"
            fill="#FACC15"
            stroke="#713F12"
            strokeWidth="2.5"
          />
          <path
            d="M26,73 Q34,66 42,73 Q50,66 58,73 Q66,66 74,73 Q82,66 94,73"
            fill="none"
            stroke="#713F12"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="88" cy="36" r="11" fill="#22C55E" opacity="0.85" />
          <circle cx="88" cy="36" r="5" fill="#FCD116" />
        </svg>
      </div>

      {/* 3. Arepa con Queso (Mid Left) */}
      <div
        style={{ animationDelay: '-6s' }}
        className="colombia-anim-float-alt absolute top-[44%] left-[2%] w-24 h-24 opacity-[0.22] sm:opacity-[0.44]"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="60" r="40" fill="#FDE047" stroke="#854D0E" strokeWidth="2.5" />
          <circle cx="48" cy="48" r="4" fill="#92400E" opacity="0.7" />
          <circle cx="72" cy="54" r="5" fill="#92400E" opacity="0.65" />
          <circle cx="56" cy="72" r="4.5" fill="#92400E" opacity="0.7" />
          <rect x="44" y="44" width="32" height="32" rx="6" fill="#FEF9C3" fillOpacity="0.9" stroke="#D97706" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 4. Steaming Colombian Coffee Cup & Beans (Mid Right) */}
      <div
        style={{ animationDelay: '-2s' }}
        className="colombia-anim-float absolute top-[48%] right-[3%] w-24 h-24 opacity-[0.24] sm:opacity-[0.46]"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <path d="M44,24 Q38,14 46,6 M60,22 Q54,12 62,4 M76,24 Q70,14 78,6" fill="none" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30,42 L86,42 L80,82 C78,94 38,94 36,82 Z" fill="#92400E" stroke="#F5EFE6" strokeWidth="2" />
          <path d="M84,48 C98,48 98,70 82,70" fill="none" stroke="#F5EFE6" strokeWidth="2.5" />
          <ellipse cx="58" cy="96" rx="34" ry="7" fill="#D6CEC2" stroke="#451A03" strokeWidth="2" />
          <circle cx="24" cy="90" r="6" fill="#D97706" />
        </svg>
      </div>

      {/* 5. Tropical Lulo & Passionfruit Slices (Lower Left) */}
      <div
        style={{ animationDelay: '-5s' }}
        className="colombia-anim-float absolute bottom-[18%] left-[4%] w-24 h-24 opacity-[0.24] sm:opacity-[0.46]"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="52" cy="64" r="30" fill="#FB923C" stroke="#7C2D12" strokeWidth="2.5" />
          <circle cx="52" cy="64" r="23" fill="#A3E635" />
          <path d="M52,41 L52,87 M29,64 L75,64 M36,48 L68,80 M68,48 L36,80" stroke="#ECFCCB" strokeWidth="2" />
          <circle cx="88" cy="40" r="16" fill="#9333EA" stroke="#F5EFE6" strokeWidth="2" />
          <circle cx="88" cy="40" r="11" fill="#FACC15" />
        </svg>
      </div>

      {/* 6. Cattleya Orchid (Lower Right) */}
      <div
        style={{ animationDelay: '-7.5s' }}
        className="colombia-anim-float-alt absolute bottom-[16%] right-[4%] w-24 h-24 opacity-[0.22] sm:opacity-[0.45]"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <path d="M60,60 C38,34 18,44 26,64 C18,80 42,88 60,60 Z" fill="#D8B4FE" stroke="#6B21A8" strokeWidth="2" />
          <path d="M60,60 C82,34 102,44 94,64 C102,80 78,88 60,60 Z" fill="#D8B4FE" stroke="#6B21A8" strokeWidth="2" />
          <path d="M60,60 C46,20 74,20 60,60 Z" fill="#F0ABFC" stroke="#6B21A8" strokeWidth="2" />
          <path d="M60,60 C44,96 76,96 60,60 Z" fill="#C026D3" stroke="#6B21A8" strokeWidth="2" />
          <circle cx="60" cy="62" r="7" fill="#FCD116" />
        </svg>
      </div>
    </div>
  );
}

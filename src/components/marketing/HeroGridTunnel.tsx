const VP = { x: 50, y: 54 }; // vanishing point, in 0-100 percentage space
const NAVY = "#263A5A";
const BG = "#FAFAF7";

type Line = { x1: number; y1: number; x2: number; y2: number; opacity: number; width: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Denser sampling near the vanishing point (t close to 1) so grid cells
// compress smoothly toward the centre, matching real one-point perspective.
function depthEase(u: number) {
  return 1 - Math.pow(1 - u, 2);
}

function buildLines(): Line[] {
  const lines: Line[] = [];

  // ---- Radiating lines (floor, ceiling, left wall, right wall) ----
  const EDGE_RADIALS = 11;
  for (let i = 0; i <= EDGE_RADIALS; i++) {
    const x0 = (i / EDGE_RADIALS) * 100;
    const edgeBoost = Math.abs(x0 - 50) / 50; // corner lines read slightly stronger
    const opacity = 0.14 + edgeBoost * 0.1;
    lines.push({ x1: x0, y1: 100, x2: VP.x, y2: VP.y, opacity, width: 1.5 + edgeBoost * 0.4 }); // floor
    lines.push({ x1: x0, y1: 0, x2: VP.x, y2: VP.y, opacity, width: 1.5 + edgeBoost * 0.4 }); // ceiling
  }

  const WALL_RADIALS = 9;
  for (let i = 0; i <= WALL_RADIALS; i++) {
    const y0 = (i / WALL_RADIALS) * 100;
    const edgeBoost = Math.abs(y0 - 50) / 50;
    const opacity = 0.13 + edgeBoost * 0.09;
    lines.push({ x1: 0, y1: y0, x2: VP.x, y2: VP.y, opacity, width: 1.5 + edgeBoost * 0.4 }); // left wall
    lines.push({ x1: 100, y1: y0, x2: VP.x, y2: VP.y, opacity, width: 1.5 + edgeBoost * 0.4 }); // right wall
  }

  // ---- Cross lines: floor + ceiling (horizontal, compressing toward VP.y) ----
  const CROSS_COUNT = 13;
  for (let i = 1; i <= CROSS_COUNT; i++) {
    const u = i / (CROSS_COUNT + 1);
    const f = depthEase(u);
    const opacity = lerp(0.24, 0.015, f);
    const width = lerp(1.7, 1, f);

    const yFloor = 100 - f * (100 - VP.y);
    const xExtent = 50 * (1 - f);
    lines.push({ x1: VP.x - xExtent, y1: yFloor, x2: VP.x + xExtent, y2: yFloor, opacity, width });

    const yCeil = f * VP.y;
    lines.push({ x1: VP.x - xExtent, y1: yCeil, x2: VP.x + xExtent, y2: yCeil, opacity, width });
  }

  // ---- Cross lines: left + right wall (vertical, compressing toward VP.x) ----
  const WALL_CROSS_COUNT = 11;
  for (let i = 1; i <= WALL_CROSS_COUNT; i++) {
    const u = i / (WALL_CROSS_COUNT + 1);
    const f = depthEase(u);
    const opacity = lerp(0.22, 0.015, f);
    const width = lerp(1.6, 1, f);

    const yTop = VP.y * f;
    const yBottom = 100 - (100 - VP.y) * f;

    const xLeft = f * VP.x;
    lines.push({ x1: xLeft, y1: yTop, x2: xLeft, y2: yBottom, opacity, width });

    const xRight = 100 - (100 - VP.x) * f;
    lines.push({ x1: xRight, y1: yTop, x2: xRight, y2: yBottom, opacity, width });
  }

  return lines;
}

const lines = buildLines();

export default function HeroGridTunnel() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="tunnelFade" cx={`${VP.x}%`} cy={`${VP.y}%`} r="46%">
          <stop offset="0%" stopColor={BG} stopOpacity="1" />
          <stop offset="45%" stopColor={BG} stopOpacity="1" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
      </defs>

      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={NAVY}
          strokeOpacity={line.opacity}
          strokeWidth={line.width}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      <rect x="0" y="0" width="100" height="100" fill="url(#tunnelFade)" />
    </svg>
  );
}

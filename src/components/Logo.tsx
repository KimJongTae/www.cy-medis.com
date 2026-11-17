/** ㈜청연메디칼 로고 (기존 로고 이미지를 SVG로 재구성: CY + 육각 큐브 + 청연메디칼) */
export default function Logo({ variant = "color", className = "h-9" }: { variant?: "color" | "white"; className?: string }) {
  const cy = variant === "white" ? "#ffffff" : "#003a5d";
  const word = variant === "white" ? "rgba(255,255,255,0.85)" : "#8d8d8d";
  // 육각형을 6개의 삼각형으로 나눈 큐브 마크 (CY 오른쪽 위)
  const cx = 65;
  const cyy = 12;
  const r = 12.5;
  const pt = (deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cyy + r * Math.sin(a)).toFixed(2)}`;
  };
  const shades = ["#38b5e6", "#005cb9", "#004a87", "#0a2a3b", "#003a5d", "#6bc4ea"];
  return (
    <svg viewBox="0 0 196 40" className={className} role="img" aria-label="㈜청연메디칼">
      <text x="0" y="36" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="34" textLength="52" lengthAdjust="spacingAndGlyphs" fill={cy}>
        CY
      </text>
      {shades.map((fill, i) => (
        <polygon key={fill} points={`${cx},${cyy} ${pt(i * 60)} ${pt(i * 60 + 60)}`} fill={fill} />
      ))}
      <text x="92" y="33" fontFamily="var(--font-noto-kr), sans-serif" fontWeight="500" fontSize="21" textLength="102" lengthAdjust="spacingAndGlyphs" fill={word}>
        청연메디칼
      </text>
    </svg>
  );
}

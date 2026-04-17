

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({
  percentage,
  size = 56,
  strokeWidth = 3,
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-[#dcfce7]"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#022c22"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {label && (
        <span className="absolute text-sm font-semibold">{label}</span>
      )}
    </div>
  );
}

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: number;
}

export function ProgressBar({
  percentage,
  color = '#022c22',
  height = 8,
}: ProgressBarProps) {
  return (
    <div className="w-full bg-[#dcfce7] rounded-premium overflow-hidden" style={{ height }}>
      <div
        className="h-full rounded-premium transition-all duration-700 ease-out shadow-sm"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
}

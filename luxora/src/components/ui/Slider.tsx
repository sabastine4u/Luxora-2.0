export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  prefix?: string;
  onChange: (v: number) => void;
}

export function Slider({
  label, value, min, max, step, suffix, prefix = '', onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-ink/70">{label}</span>
        <span className="text-sm font-semibold text-cream">{prefix}{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none"
        style={{
          background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
    </div>
  );
}

type Props = {
  width?: "full" | "half";
};

export function Separator({ width = "full" }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <div
        className={`h-px bg-brand-gold-light ${
          width === "half" ? "w-full md:w-1/2" : "w-full"
        }`}
      />
    </div>
  );
}

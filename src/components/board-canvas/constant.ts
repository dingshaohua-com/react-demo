export const STROKE_OPTIONS = [
  { key: "thin", outlineOffset: -1.5, label: "细" },
  { key: "medium", outlineOffset: -2.5, label: "中" },
  { key: "thick", outlineOffset: -4, label: "粗" },
];

export const COLOR_OPTIONS = [
  {
    value: "#F94A3E",
    label: "Red",
    activeClass: "bg-rose-50 text-red-500",
  },
  {
    value: "#2680FF",
    label: "Blue",
    activeClass: "bg-sky-100 text-blue-500",
  },
  {
    value: "#24AD08",
    label: "Green",
    activeClass: "bg-green-100 text-lime-700",
  },
  {
    value: "#E47900",
    label: "Orange",
    activeClass: "bg-orange-100 text-amber-600",
  },
] as const;

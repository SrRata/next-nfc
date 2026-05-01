import { color, colors } from "@/lib/constants/data-type";
import { colorMap } from "@/lib/constants/get-badge-color";

interface Props {
  selected: color;
  onChange: (color: color) => void;
}

export const ColorPicker = ({ selected, onChange }: Props) => {
  return (
    <div className="grid grid-cols-8 gap-2 p-4 border rounded-primary w-full">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`
            w-8 h-8 rounded-full transition-all cursor-pointer
            ${colorMap[c]} 
            ${selected === c ? "ring-2 ring-offset-2 ring-gray-400 scale-101" : "hover:scale-105"}
          `}
          title={c}
        />
      ))}
    </div>
  );
};

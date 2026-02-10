interface BarProps {
    percentage: number;
}

export function Bar({ percentage }: BarProps) {
  
    const barColor = percentage <= 75 ? "bg-red-primary" : "bg-blue-primary";

  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      <p className="font-bold text-sm">{percentage}%</p>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div 
          className={`h-full rounded-full ${barColor} transition-all duration-300`} 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

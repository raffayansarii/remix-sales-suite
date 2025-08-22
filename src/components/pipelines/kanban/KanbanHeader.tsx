import { Badge } from '@/components/ui/badge';

interface Stage {
  name: string;
  color: string;
  textColor: string;
}

interface KanbanHeaderProps {
  stage: Stage;
  count: number;
  totalValue: number;
}

export function KanbanHeader({ stage, count, totalValue }: KanbanHeaderProps) {
  return (
    <div className={`${stage.color} ${stage.textColor} p-4 rounded-t-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{stage.name}</h3>
        <Badge variant="secondary" className="bg-white/20 text-white border-0">
          {count}
        </Badge>
      </div>
      <div className="text-sm opacity-90">
        ${totalValue.toLocaleString()} total value
      </div>
    </div>
  );
}
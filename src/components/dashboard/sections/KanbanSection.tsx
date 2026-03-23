import { useState } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import type { KanbanTask } from "@/types/analysis";

const PRIORITY_COLORS: Record<string, string> = {
  high:   "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const EFFORT_COLOR = "bg-white/[0.06] text-white/40";

type ColumnKey = "backlog" | "in_progress" | "completed";

const COLUMNS: { key: ColumnKey; label: string; color: string }[] = [
  { key: "backlog",     label: "Backlog",      color: "border-white/[0.07]" },
  { key: "in_progress", label: "In Progress",  color: "border-indigo-500/30" },
  { key: "completed",  label: "Completed",    color: "border-green-500/30" },
];

type Board = Record<ColumnKey, KanbanTask[]>;

function TaskCard({
  task,
  colKey,
  onMove,
}: {
  task: KanbanTask;
  colKey: ColumnKey;
  onMove: (id: string, from: ColumnKey, to: ColumnKey) => void;
}) {
  const targets = COLUMNS.filter((c) => c.key !== colKey);

  return (
    <div className="group relative rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-colors cursor-default select-none">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-[13px] font-semibold text-white/80 leading-snug">{task.title}</h4>
        <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {targets.map((t) => (
            <button
              key={t.key}
              onClick={() => onMove(task.id, colKey, t.key)}
              title={`Move to ${t.label}`}
              className="text-[9.5px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-white/[0.08] text-white/40 hover:bg-white/[0.14] hover:text-white/70 transition-all"
            >
              → {t.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12px] leading-[1.65] text-white/35 mb-3">{task.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md border ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${EFFORT_COLOR}`}>
          ⏱ {task.estimated_effort}
        </span>
      </div>
    </div>
  );
}

export function KanbanSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  const [board, setBoard] = useState<Board | null>(null);

  if (!analysis) return null;

  const currentBoard = board ?? {
    backlog:     analysis.kanban.backlog,
    in_progress: analysis.kanban.in_progress,
    completed:   analysis.kanban.completed,
  };

  const handleMove = (id: string, from: ColumnKey, to: ColumnKey) => {
    setBoard((prev) => {
      const b = prev ?? {
        backlog:     analysis.kanban.backlog,
        in_progress: analysis.kanban.in_progress,
        completed:   analysis.kanban.completed,
      };
      const task = b[from].find((t) => t.id === id);
      if (!task) return b;
      return {
        ...b,
        [from]: b[from].filter((t) => t.id !== id),
        [to]:   [...b[to], task],
      };
    });
  };

  const totalTasks =
    currentBoard.backlog.length + currentBoard.in_progress.length + currentBoard.completed.length;
  const doneCount = currentBoard.completed.length;
  const progress = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Sprint Planner</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            AI-generated tasks for your MVP · hover a card to move it
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[12px] text-muted-foreground">Progress</div>
            <div className="text-[15px] font-bold">{doneCount}/{totalTasks} done</div>
          </div>
          <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-[hsl(var(--success))] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.key} className={`rounded-xl border ${col.color} bg-white/[0.01] p-4`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  col.key === "completed" ? "bg-green-400" :
                  col.key === "in_progress" ? "bg-indigo-400" : "bg-white/25"
                }`} />
                <span className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">
                  {col.label}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/25 bg-white/[0.05] px-1.5 py-0.5 rounded-md">
                {currentBoard[col.key].length}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentBoard[col.key].length === 0 && (
                <div className="py-6 text-center text-[12px] text-white/20 border border-dashed border-white/[0.06] rounded-xl">
                  Empty
                </div>
              )}
              {currentBoard[col.key].map((task) => (
                <TaskCard key={task.id} task={task} colKey={col.key} onMove={handleMove} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

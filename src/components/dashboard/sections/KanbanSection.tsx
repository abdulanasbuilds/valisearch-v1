import { useState, useRef } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { KanbanTask } from "@/types/analysis";

const PRIORITY_COLORS: Record<string, string> = {
  high:   "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

type ColKey = "backlog" | "in_progress" | "completed";

const COLUMNS: { key: ColKey; label: string; dot: string; border: string; bg: string }[] = [
  { key: "backlog",     label: "Backlog",     dot: "bg-white/25",    border: "border-white/[0.07]",    bg: "bg-white/[0.01]" },
  { key: "in_progress", label: "In Progress", dot: "bg-indigo-400",  border: "border-indigo-500/30",  bg: "bg-indigo-500/[0.02]" },
  { key: "completed",  label: "Completed",   dot: "bg-green-400",   border: "border-green-500/25",   bg: "bg-green-500/[0.02]" },
];

type Board = Record<ColKey, KanbanTask[]>;

/* ─── Task card ──────────────────────────────────────────── */
function TaskCard({
  task,
  colKey,
  onRemove,
  onDragStart,
}: {
  task: KanbanTask;
  colKey: ColKey;
  onRemove: (id: string, col: ColKey) => void;
  onDragStart: (e: React.DragEvent, id: string, fromCol: ColKey) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id, colKey)}
      data-testid={`kanban-card-${task.id}`}
      className="group relative rounded-xl border border-white/[0.07] bg-[#111] p-4 cursor-grab active:cursor-grabbing hover:border-white/[0.14] hover:bg-[#161616] transition-all duration-150 select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-[13px] font-semibold text-white/80 leading-snug">{task.title}</h4>
        <button
          onClick={() => onRemove(task.id, colKey)}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/20 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <p className="text-[12px] leading-[1.65] text-white/35 mb-3">{task.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md border ${PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.low}`}>
          {task.priority}
        </span>
        <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-white/[0.05] text-white/35">
          {task.estimated_effort ?? "—"}
        </span>
      </div>

      {/* Drag indicator */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none">
        {[0, 1, 2].map((i) => <div key={i} className="w-1 h-1 rounded-full bg-white/60" />)}
      </div>
    </div>
  );
}

/* ─── Column ─────────────────────────────────────────────── */
function Column({
  col,
  tasks,
  onDragStart,
  onDrop,
  onDragOver,
  onDragLeave,
  isOver,
  onRemove,
  onAddTask,
}: {
  col: (typeof COLUMNS)[0];
  tasks: KanbanTask[];
  onDragStart: (e: React.DragEvent, id: string, from: ColKey) => void;
  onDrop: (e: React.DragEvent, to: ColKey) => void;
  onDragOver: (e: React.DragEvent, col: ColKey) => void;
  onDragLeave: () => void;
  isOver: boolean;
  onRemove: (id: string, col: ColKey) => void;
  onAddTask: (col: ColKey) => void;
}) {
  return (
    <div
      onDragOver={(e) => onDragOver(e, col.key)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, col.key)}
      className={`rounded-xl border ${col.border} ${col.bg} p-4 flex flex-col transition-colors duration-150 min-h-[400px] ${isOver ? "ring-2 ring-indigo-500/40 border-indigo-500/40 bg-indigo-500/[0.04]" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${col.dot}`} />
          <span className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">{col.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-white/25 bg-white/[0.05] px-1.5 py-0.5 rounded-md">{tasks.length}</span>
        </div>
      </div>

      {/* Drop zone */}
      {isOver && (
        <div className="mb-2.5 rounded-xl border-2 border-dashed border-indigo-500/40 bg-indigo-500/[0.05] h-16 flex items-center justify-center">
          <span className="text-[11px] text-indigo-400/60">Drop here</span>
        </div>
      )}

      {/* Tasks */}
      <div className="flex-1 space-y-2.5">
        {tasks.length === 0 && !isOver && (
          <div className="py-8 text-center text-[12px] text-white/15 border border-dashed border-white/[0.06] rounded-xl">
            Drop tasks here
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} colKey={col.key} onRemove={onRemove} onDragStart={onDragStart} />
        ))}
      </div>

      {/* Add task */}
      <button
        onClick={() => onAddTask(col.key)}
        className="mt-3 flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-[12px] text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-colors"
      >
        <Plus className="h-3.5 w-3.5" /> Add task
      </button>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export function KanbanSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  const [board, setBoard] = useState<Board | null>(null);
  const [overCol, setOverCol] = useState<ColKey | null>(null);
  const dragRef = useRef<{ id: string; from: ColKey } | null>(null);

  if (!analysis) return null;

  const initial: Board = {
    backlog:     analysis.kanban?.backlog ?? [],
    in_progress: analysis.kanban?.in_progress ?? [],
    completed:   analysis.kanban?.completed ?? [],
  };
  const currentBoard = board ?? initial;

  /* ── Drag handlers ── */
  const handleDragStart = (e: React.DragEvent, id: string, from: ColKey) => {
    dragRef.current = { id, from };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, col: ColKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverCol(col);
  };

  const handleDragLeave = () => setOverCol(null);

  const handleDrop = (e: React.DragEvent, to: ColKey) => {
    e.preventDefault();
    setOverCol(null);
    const drag = dragRef.current;
    if (!drag || drag.from === to) return;

    setBoard((prev) => {
      const b = prev ?? initial;
      const task = b[drag.from].find((t) => t.id === drag.id);
      if (!task) return b;
      return {
        ...b,
        [drag.from]: b[drag.from].filter((t) => t.id !== drag.id),
        [to]: [...b[to], task],
      };
    });
    dragRef.current = null;
  };

  /* ── Remove ── */
  const handleRemove = (id: string, col: ColKey) => {
    setBoard((prev) => {
      const b = prev ?? initial;
      return { ...b, [col]: b[col].filter((t) => t.id !== id) };
    });
  };

  /* ── Add task ── */
  const handleAddTask = (col: ColKey) => {
    const id = `task-${Date.now()}`;
    const newTask: KanbanTask = {
      id,
      title: "New task",
      description: "Click the drag handle to move, trash to delete",
      priority: "medium",
      estimated_effort: "1–2 days",
    };
    setBoard((prev) => {
      const b = prev ?? initial;
      return { ...b, [col]: [...b[col], newTask] };
    });
  };

  const total = Object.values(currentBoard).flat().length;
  const done = currentBoard.completed.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Sprint Planner</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Drag cards between columns · hover to delete · click "Add task" to add
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground/50 mb-1">Sprint progress</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-400/70 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[12px] font-bold text-white/60">{done}/{total}</span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-[12px] text-muted-foreground gap-1.5"
            onClick={() => setBoard(null)}
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="grid md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            col={col}
            tasks={currentBoard[col.key]}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            isOver={overCol === col.key}
            onRemove={handleRemove}
            onAddTask={handleAddTask}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Plus, Trash2, RotateCcw, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { updateAnalysis } from "@/services/database.service";
import type { KanbanTask } from "@/types/analysis";
import type { ValiSearchAnalysis } from "@/types/analysis";

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

type ColKey = "backlog" | "in_progress" | "completed";
type Board = Record<ColKey, KanbanTask[]>;

const COLUMNS: { key: ColKey; label: string; dot: string; border: string; bg: string }[] = [
  { key: "backlog", label: "Backlog", dot: "bg-white/25", border: "border-white/[0.07]", bg: "bg-white/[0.01]" },
  { key: "in_progress", label: "In Progress", dot: "bg-indigo-400", border: "border-indigo-500/30", bg: "bg-indigo-500/[0.02]" },
  { key: "completed", label: "Completed", dot: "bg-green-400", border: "border-green-500/25", bg: "bg-green-500/[0.02]" },
];

/* ── Sortable Task Card ── */
function SortableTaskCard({
  task,
  colKey,
  onRemove,
}: {
  task: KanbanTask;
  colKey: ColKey;
  onRemove: (id: string, col: ColKey) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { colKey },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-xl border border-white/[0.07] bg-[#111] p-4 hover:border-white/[0.14] hover:bg-[#161616] transition-all duration-150 select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab active:cursor-grabbing p-0.5 rounded text-white/20 hover:text-white/50 touch-none"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h4 className="text-[13px] font-semibold text-white/80 leading-snug">{task.title}</h4>
        </div>
        <button
          onClick={() => onRemove(task.id, colKey)}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/20 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <p className="text-[12px] leading-[1.65] text-white/35 mb-3 pl-6">{task.description}</p>
      <div className="flex items-center gap-2 flex-wrap pl-6">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md border ${PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.low}`}>
          {task.priority}
        </span>
        <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-white/[0.05] text-white/35">
          {task.estimated_effort ?? "—"}
        </span>
      </div>
    </div>
  );
}

/* ── Drag overlay card (ghost) ── */
function TaskOverlay({ task }: { task: KanbanTask }) {
  return (
    <div className="rounded-xl border border-indigo-500/30 bg-[#161616] p-4 shadow-2xl shadow-indigo-500/10 w-[280px]">
      <h4 className="text-[13px] font-semibold text-white/80">{task.title}</h4>
      <p className="text-[12px] text-white/35 mt-1">{task.description}</p>
    </div>
  );
}

/* ── Droppable Column ── */
function DroppableColumn({
  col,
  tasks,
  onRemove,
  onAddTask,
}: {
  col: (typeof COLUMNS)[0];
  tasks: KanbanTask[];
  onRemove: (id: string, col: ColKey) => void;
  onAddTask: (col: ColKey) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border ${col.border} ${col.bg} p-4 flex flex-col transition-colors duration-150 min-h-[400px] ${
        isOver ? "ring-2 ring-indigo-500/40 border-indigo-500/40 bg-indigo-500/[0.04]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${col.dot}`} />
          <span className="text-[12px] font-semibold text-white/60 uppercase tracking-wider">{col.label}</span>
        </div>
        <span className="text-[11px] font-mono text-white/25 bg-white/[0.05] px-1.5 py-0.5 rounded-md">
          {tasks.length}
        </span>
      </div>

      {isOver && (
        <div className="mb-2.5 rounded-xl border-2 border-dashed border-indigo-500/40 bg-indigo-500/[0.05] h-16 flex items-center justify-center">
          <span className="text-[11px] text-indigo-400/60">Drop here</span>
        </div>
      )}

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2.5">
          {tasks.length === 0 && !isOver && (
            <div className="py-8 text-center text-[12px] text-white/15 border border-dashed border-white/[0.06] rounded-xl">
              Drop tasks here
            </div>
          )}
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} colKey={col.key} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => onAddTask(col.key)}
        className="mt-3 flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-[12px] text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-colors min-h-[44px]"
      >
        <Plus className="h-3.5 w-3.5" /> Add task
      </button>
    </div>
  );
}

/* ── Main ── */
export function KanbanSection() {
  const { analysis, setAnalysis } = useAnalysisStore();
  const [board, setBoard] = useState<Board | null>(null);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const initial: Board = useMemo(() => {
    const k = (analysis as ValiSearchAnalysis | null)?.kanban;
    return {
      backlog: (k?.backlog as KanbanTask[]) ?? [],
      in_progress: (k?.in_progress as KanbanTask[]) ?? [],
      completed: (k?.completed as KanbanTask[]) ?? [],
    };
  }, [analysis]);

  const currentBoard: Board = board ?? initial;

  const { id: analysisId } = useParams<{ id: string }>();

  const persistBoard = async (newBoard: Board) => {
    if (analysis) {
      const updated = { ...(analysis as ValiSearchAnalysis), kanban: newBoard };
      setAnalysis(updated);
      
      if (analysisId) {
        await updateAnalysis(analysisId, updated);
      }
    }
  };

  const findCol = (id: string, b: Board): ColKey | null => {
    if (b.backlog.some((t) => t.id === id)) return "backlog";
    if (b.in_progress.some((t) => t.id === id)) return "in_progress";
    if (b.completed.some((t) => t.id === id)) return "completed";
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    const col = findCol(id, currentBoard);
    if (col) {
      const t = currentBoard[col].find((x) => x.id === id) ?? null;
      setActiveTask(t);
    }
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveTask(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    setBoard((prev) => {
      const b = prev ?? initial;
      const activeCol = findCol(activeId, b);
      const overCol: ColKey | null =
        (["backlog", "in_progress", "completed"] as ColKey[]).includes(overId as ColKey)
          ? (overId as ColKey)
          : findCol(overId, b);
      if (!activeCol || !overCol || activeCol === overCol) return b;
      const task = b[activeCol].find((t) => t.id === activeId);
      if (!task) return b;
      const updated: Board = {
        ...b,
        [activeCol]: b[activeCol].filter((t) => t.id !== activeId),
        [overCol]: [...b[overCol], task],
      };
      persistBoard(updated);
      return updated;
    });
  };

  const handleRemove = (id: string, col: ColKey) => {
    setBoard((prev) => {
      const b = prev ?? initial;
      const updated = { ...b, [col]: b[col].filter((t) => t.id !== id) };
      persistBoard(updated);
      return updated;
    });
  };

  const handleAddTask = (col: ColKey) => {
    const id = `task-${Date.now()}`;
    const title = prompt("Enter task title:") || "New task";
    const newTask: KanbanTask = {
      id,
      title,
      description: "Drag to move between columns",
      priority: "medium",
      estimated_effort: "1–2 days",
    };
    setBoard((prev) => {
      const b = prev ?? initial;
      const updated = { ...b, [col]: [...b[col], newTask] };
      persistBoard(updated);
      return updated;
    });
  };

  const total = Object.values(currentBoard).flat().length;
  const done = currentBoard.completed.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Sprint Planner</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Drag tasks between columns · click grip handle to drag
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <DroppableColumn
              key={col.key}
              col={col}
              tasks={currentBoard[col.key]}
              onRemove={handleRemove}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}


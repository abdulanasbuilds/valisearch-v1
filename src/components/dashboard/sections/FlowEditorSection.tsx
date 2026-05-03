"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { Plus, Trash2, Link2, RotateCcw, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Types ──────────────────────────────────────────────── */
type NodeType = "page" | "feature" | "action";
type FlowNode = { id: string; label: string; x: number; y: number; type: NodeType };
type FlowEdge = { id: string; from: string; to: string };

const NODE_W = 140;
const NODE_H = 44;

const NODE_COLORS: Record<NodeType, { fill: string; stroke: string; text: string }> = {
  page:    { fill: "rgba(99,102,241,0.15)", stroke: "rgba(99,102,241,0.55)", text: "#a5b4fc" },
  feature: { fill: "rgba(255,255,255,0.06)", stroke: "rgba(255,255,255,0.18)", text: "rgba(255,255,255,0.75)" },
  action:  { fill: "rgba(52,211,153,0.12)", stroke: "rgba(52,211,153,0.35)", text: "#6ee7b7" },
};

/* ─── Build initial graph from AI output ─────────────────── */
function buildInitialGraph(journeySteps: string[], coreFlows: string[]): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const CX = 400;
  const GAP = 100;

  // Main journey spine (vertical)
  journeySteps.forEach((step, i) => {
    nodes.push({ id: `j${i}`, label: step.slice(0, 30), x: CX, y: 60 + i * GAP, type: i === 0 ? "page" : "feature" });
    if (i > 0) edges.push({ id: `ej${i}`, from: `j${i - 1}`, to: `j${i}` });
  });

  // Core flows branch off second-to-last step to the right
  const branchY = journeySteps.length > 1 ? 60 + (journeySteps.length - 2) * GAP : 160;
  coreFlows.slice(0, 4).forEach((flow, i) => {
    const id = `cf${i}`;
    nodes.push({ id, label: flow.slice(0, 22), x: CX + 200, y: branchY + i * 70, type: "action" });
    const fromId = journeySteps.length > 1 ? `j${journeySteps.length - 2}` : "j0";
    edges.push({ id: `ecf${i}`, from: fromId, to: id });
  });

  return { nodes, edges };
}

/* ─── Edge path ─────────────────────────────────────────── */
function edgePath(from: FlowNode, to: FlowNode): string {
  const x1 = from.x + NODE_W / 2;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x + NODE_W / 2;
  const y2 = to.y + NODE_H / 2;
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`;
}

/* ─── Derived requirements from current graph ────────────── */
function deriveRequirements(nodes: FlowNode[]): string[] {
  const pages = nodes.filter((n) => n.type === "page").map((n) => `Page: ${n.label}`);
  const features = nodes.filter((n) => n.type === "feature").map((n) => `Feature: ${n.label}`);
  const actions = nodes.filter((n) => n.type === "action").map((n) => `Integration: ${n.label}`);
  return [...pages, ...features, ...actions];
}

/* ─── Component ──────────────────────────────────────────── */
export function FlowEditorSection() {
  const analysis = useAnalysisStore((s) => s.analysis);

  const initial = analysis
    ? buildInitialGraph(analysis.user_flow.journey_steps, analysis.user_flow.page_structure.core_flows)
    : { nodes: [], edges: [] };

  const [nodes, setNodes] = useState<FlowNode[]>(initial.nodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initial.edges);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"normal" | "connect">("normal");
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const svgW = 800;
  const svgH = 520;

  /* ── Drag ── */
  const getSvgPos = useCallback((e: React.MouseEvent): { x: number; y: number } => {
    const rect = svgRef.current!.getBoundingClientRect();
    const scaleX = svgW / rect.width;
    const scaleY = svgH / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (mode === "connect") {
      if (!connectFrom) {
        setConnectFrom(id);
      } else if (connectFrom !== id) {
        const exists = edges.some((e) => e.from === connectFrom && e.to === id);
        if (!exists) {
          setEdges((prev) => [...prev, { id: `e${Date.now()}`, from: connectFrom, to: id }]);
        }
        setConnectFrom(null);
        setMode("normal");
      }
      return;
    }

    const pos = getSvgPos(e);
    const node = nodes.find((n) => n.id === id)!;
    setDragging({ id, ox: pos.x - node.x, oy: pos.y - node.y });
    setSelected(id);
  };

  const handleSvgMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const pos = getSvgPos(e);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragging.id
          ? { ...n, x: Math.max(0, Math.min(svgW - NODE_W, pos.x - dragging.ox)), y: Math.max(0, Math.min(svgH - NODE_H, pos.y - dragging.oy)) }
          : n
      )
    );
  }, [dragging, getSvgPos]);

  const handleSvgMouseUp = useCallback(() => setDragging(null), []);

  /* ── Double-click to edit ── */
  const handleNodeDblClick = (e: React.MouseEvent, node: FlowNode) => {
    e.stopPropagation();
    setEditingId(node.id);
    setEditValue(node.label);
  };

  const confirmEdit = () => {
    if (editingId && editValue.trim()) {
      setNodes((prev) => prev.map((n) => n.id === editingId ? { ...n, label: editValue.trim() } : n));
    }
    setEditingId(null);
    setEditValue("");
  };

  /* ── Toolbar actions ── */
  const addNode = () => {
    const id = `n${Date.now()}`;
    setNodes((prev) => [...prev, { id, label: "New Page", x: 100, y: 100, type: "feature" }]);
    setSelected(id);
    setEditingId(id);
    setEditValue("New Page");
  };

  const deleteSelected = () => {
    if (!selected) return;
    setNodes((prev) => prev.filter((n) => n.id !== selected));
    setEdges((prev) => prev.filter((e) => e.from !== selected && e.to !== selected));
    setSelected(null);
  };

  const deleteEdge = (id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  };

  const reset = () => {
    setNodes(initial.nodes);
    setEdges(initial.edges);
    setSelected(null);
    setMode("normal");
    setConnectFrom(null);
  };

  const cycleNodeType = () => {
    if (!selected) return;
    const types: NodeType[] = ["page", "feature", "action"];
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selected ? { ...n, type: types[(types.indexOf(n.type) + 1) % 3] } : n
      )
    );
  };

  const requirements = deriveRequirements(nodes);

  if (!analysis) return null;

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Flow Editor</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Drag nodes, double-click to rename, connect pages and features
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 p-1 rounded-lg border border-white/[0.08] bg-white/[0.03]">
            {(["page", "feature", "action"] as NodeType[]).map((t) => (
              <div key={t} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md">
                <div className="w-2 h-2 rounded-sm" style={{ background: NODE_COLORS[t].stroke }} />
                <span className="text-[10.5px] text-white/40 capitalize">{t}</span>
              </div>
            ))}
          </div>

          <Button size="sm" variant="outline" className="h-7 text-[12px] gap-1.5" onClick={addNode}>
            <Plus className="h-3.5 w-3.5" /> Add Node
          </Button>

          <Button
            size="sm"
            variant={mode === "connect" ? "default" : "outline"}
            className={`h-7 text-[12px] gap-1.5 ${mode === "connect" && connectFrom ? "ring-1 ring-indigo-400" : ""}`}
            onClick={() => { setMode(mode === "connect" ? "normal" : "connect"); setConnectFrom(null); }}
          >
            <Link2 className="h-3.5 w-3.5" />
            {mode === "connect" ? (connectFrom ? "Pick target…" : "Pick source…") : "Connect"}
          </Button>

          {selected && (
            <>
              <Button size="sm" variant="outline" className="h-7 text-[12px]" onClick={cycleNodeType}>
                Change Type
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-[12px] text-destructive border-destructive/30 hover:bg-destructive/10" onClick={deleteSelected}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          <Button size="sm" variant="ghost" className="h-7 text-[12px] text-muted-foreground gap-1.5" onClick={reset}>
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0d0d] overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full"
          style={{ cursor: mode === "connect" ? "crosshair" : dragging ? "grabbing" : "default", aspectRatio: `${svgW}/${svgH}` }}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={handleSvgMouseUp}
          onClick={() => { if (mode !== "connect") { setSelected(null); } }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
            </pattern>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.25)" />
            </marker>
          </defs>
          <rect width={svgW} height={svgH} fill="url(#grid)" />

          {/* Edges */}
          {edges.map((edge) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            return (
              <g key={edge.id} className="group">
                <path
                  d={edgePath(from, to)}
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                  strokeDasharray="5,3"
                />
                {/* Invisible wider hit area + delete */}
                <path
                  d={edgePath(from, to)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="12"
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }}
                />
              </g>
            );
          })}

          {/* "Connect from" indicator */}
          {connectFrom && (() => {
            const node = nodes.find((n) => n.id === connectFrom);
            if (!node) return null;
            return (
              <circle
                cx={node.x + NODE_W / 2}
                cy={node.y + NODE_H / 2}
                r={NODE_W / 2 + 6}
                fill="none"
                stroke="rgba(99,102,241,0.6)"
                strokeWidth="2"
                strokeDasharray="6,3"
              />
            );
          })()}

          {/* Nodes */}
          {nodes.map((node) => {
            const { fill, stroke, text } = NODE_COLORS[node.type];
            const isSelected = selected === node.id;

            return (
              <g
                key={node.id}
                style={{ cursor: dragging?.id === node.id ? "grabbing" : "grab" }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onDoubleClick={(e) => handleNodeDblClick(e, node)}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill={fill}
                  stroke={isSelected ? "rgba(99,102,241,0.9)" : stroke}
                  strokeWidth={isSelected ? 2 : 1}
                />
                {editingId === node.id ? (
                  <foreignObject x={node.x + 4} y={node.y + 4} width={NODE_W - 8} height={NODE_H - 8}>
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") { setEditingId(null); } }}
                      onBlur={confirmEdit}
                      style={{ width: "100%", height: "100%", background: "transparent", border: "none", outline: "none", color: text, fontSize: 12, fontWeight: 600, textAlign: "center", padding: "0 6px", fontFamily: "inherit" }}
                    />
                  </foreignObject>
                ) : (
                  <text
                    x={node.x + NODE_W / 2}
                    y={node.y + NODE_H / 2 + 4}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="600"
                    fill={text}
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    {node.label.slice(0, 20)}
                  </text>
                )}

                {/* Type badge */}
                <text
                  x={node.x + 6}
                  y={node.y + 10}
                  fontSize={7}
                  fill={text}
                  opacity={0.5}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {node.type.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.05] bg-white/[0.01]">
          <div className="flex items-center gap-1.5">
            <MousePointer className="h-3 w-3 text-white/20" />
            <span className="text-[10.5px] text-white/25">Drag nodes · Double-click to rename · Click edge to delete</span>
          </div>
          <span className="text-[10.5px] text-white/20 font-mono">{nodes.length} nodes · {edges.length} edges</span>
        </div>
      </div>

      {/* Derived requirements */}
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Current Pages & Features">
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {requirements.length === 0 && (
              <p className="text-[12px] text-muted-foreground/50">Add nodes above to generate requirements.</p>
            )}
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[11px] text-muted-foreground/40 font-mono w-5 shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[12.5px] text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Updated Technical Requirements">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {nodes.filter((n) => n.type === "page").length > 0 && (
              <div className="text-[12px] text-muted-foreground">
                <span className="font-medium text-white/60">Routing: </span>
                {nodes.filter((n) => n.type === "page").length} pages require a client-side router (React Router / Next.js)
              </div>
            )}
            {nodes.filter((n) => n.type === "action").length > 0 && (
              <div className="text-[12px] text-muted-foreground">
                <span className="font-medium text-white/60">Integrations: </span>
                {nodes.filter((n) => n.type === "action").map((n) => n.label).join(", ")}
              </div>
            )}
            {nodes.filter((n) => n.type === "feature").length > 0 && (
              <div className="text-[12px] text-muted-foreground">
                <span className="font-medium text-white/60">Features: </span>
                {nodes.filter((n) => n.type === "feature").map((n) => n.label).join(" → ")}
              </div>
            )}
            <div className="text-[12px] text-muted-foreground">
              <span className="font-medium text-white/60">Auth: </span>
              {nodes.length > 3 ? "Required (multi-page app)" : "Optional (simple landing)"}
            </div>
            <div className="text-[12px] text-muted-foreground">
              <span className="font-medium text-white/60">State management: </span>
              {nodes.length > 5 ? "Zustand / Redux recommended" : "React useState sufficient"}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

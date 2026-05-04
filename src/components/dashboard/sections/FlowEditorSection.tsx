"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ─── Custom Nodes to Match Aesthetics ────────────────────── */
const CustomNode = ({ data, typeColor, typeName }: any) => {
  return (
    <div
      style={{
        background: typeColor.fill,
        borderColor: typeColor.stroke,
        borderWidth: 1,
        borderStyle: "solid",
      }}
      className="px-4 py-2.5 rounded-lg shadow-xl w-[140px] relative group"
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !border-white/10 !w-2 !h-2" />
      <div className="text-[7px] uppercase tracking-wider font-bold mb-1 opacity-60" style={{ color: typeColor.text }}>
        {typeName}
      </div>
      <div className="text-[11px] font-semibold text-center truncate" style={{ color: typeColor.text }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !border-white/10 !w-2 !h-2" />
    </div>
  );
};

const PageNode = (props: any) => <CustomNode {...props} typeName="Page" typeColor={{ fill: "rgba(99,102,241,0.15)", stroke: "rgba(99,102,241,0.55)", text: "#a5b4fc" }} />;
const FeatureNode = (props: any) => <CustomNode {...props} typeName="Feature" typeColor={{ fill: "rgba(255,255,255,0.06)", stroke: "rgba(255,255,255,0.18)", text: "rgba(255,255,255,0.75)" }} />;
const ActionNode = (props: any) => <CustomNode {...props} typeName="Action" typeColor={{ fill: "rgba(52,211,153,0.12)", stroke: "rgba(52,211,153,0.35)", text: "#6ee7b7" }} />;

const nodeTypes = {
  page: PageNode,
  feature: FeatureNode,
  action: ActionNode,
};

/* ─── Build initial graph ────────────────────────────────── */
function buildInitialGraph(journeySteps: string[], coreFlows: string[]): { initialNodes: Node[]; initialEdges: Edge[] } {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  const CX = 300;
  const GAP = 120;

  // Main journey spine
  journeySteps.forEach((step, i) => {
    initialNodes.push({
      id: `j${i}`,
      position: { x: CX, y: 60 + i * GAP },
      data: { label: step.slice(0, 30) },
      type: i === 0 ? "page" : "feature",
    });
    if (i > 0) {
      initialEdges.push({
        id: `ej${i}`,
        source: `j${i - 1}`,
        target: `j${i}`,
        animated: true,
        style: { stroke: "rgba(255,255,255,0.3)", strokeWidth: 2, strokeDasharray: "4 4" },
      });
    }
  });

  // Core flows branch
  const branchY = journeySteps.length > 1 ? 60 + (journeySteps.length - 2) * GAP : 160;
  coreFlows.slice(0, 4).forEach((flow, i) => {
    const id = `cf${i}`;
    initialNodes.push({
      id,
      position: { x: CX + 250, y: branchY + i * 80 },
      data: { label: flow.slice(0, 22) },
      type: "action",
    });
    const fromId = journeySteps.length > 1 ? `j${journeySteps.length - 2}` : "j0";
    initialEdges.push({
      id: `ecf${i}`,
      source: fromId,
      target: id,
      animated: true,
      style: { stroke: "rgba(255,255,255,0.3)", strokeWidth: 2, strokeDasharray: "4 4" },
    });
  });

  return { initialNodes, initialEdges };
}

/* ─── Component ──────────────────────────────────────────── */
export function FlowEditorSection() {
  const analysis = useAnalysisStore((s) => s.analysis);

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!analysis) return { initialNodes: [], initialEdges: [] };
    return buildInitialGraph(analysis.user_flow.journey_steps, analysis.user_flow.page_structure.core_flows);
  }, [analysis]);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Sync state if analysis changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge({ ...(params as Edge), animated: true, style: { stroke: "rgba(255,255,255,0.3)", strokeWidth: 2, strokeDasharray: "4 4" } } as Edge, eds)), []);

  const addNode = () => {
    const id = `n${Date.now()}`;
    const newNode: Node = {
      id,
      position: { x: 100, y: 100 },
      data: { label: "New Node" },
      type: "feature",
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const reset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  if (!analysis) return null;

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Flow Editor</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Drag nodes, connect pages and features via an open-source React Flow engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 text-[12px] gap-1.5" onClick={addNode}>
            <Plus className="h-3.5 w-3.5" /> Add Node
          </Button>

          <Button size="sm" variant="ghost" className="h-7 text-[12px] text-muted-foreground gap-1.5" onClick={reset}>
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0d0d] overflow-hidden h-[600px] w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.1)" />
          <Controls className="!bg-[#111] !border-white/[0.1] !fill-white/70" />
        </ReactFlow>
      </div>

      {/* Technical Requirements */}
      <SectionCard title="Technical Requirements & Tech Stack Implication">
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
              {nodes.filter((n) => n.type === "action").map((n) => n.data.label).join(", ")}
            </div>
          )}
          <div className="text-[12px] text-muted-foreground">
            <span className="font-medium text-white/60">Flow Engine: </span>
            Powered by @xyflow/react for infinite canvas, zoom, and interactive mapping.
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Custom Node ── */
function FlowNode({ data }: { data: { label: string; sub?: string; accent?: boolean } }) {
  return (
    <div
      className={`rounded-xl border px-5 py-3 text-center min-w-[160px] transition-colors ${
        data.accent
          ? "border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
          : "border-white/[0.09] bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] hover:bg-[rgba(255,255,255,0.08)]"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-400/60 !border-0 !w-2 !h-2" />
      <div className={`text-[13px] font-semibold ${data.accent ? "text-indigo-300" : "text-white/75"}`}>
        {data.label}
      </div>
      {data.sub && <div className="text-[11px] text-white/30 mt-0.5">{data.sub}</div>}
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400/60 !border-0 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { flowNode: FlowNode };

function buildGraph(journeySteps: string[], coreFlows: string[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Main journey as a vertical chain
  journeySteps.forEach((step, i) => {
    nodes.push({
      id: `step-${i}`,
      type: "flowNode",
      position: { x: 250, y: i * 120 },
      data: { label: step, accent: i === 0 },
    });
    if (i > 0) {
      edges.push({
        id: `e-step-${i - 1}-${i}`,
        source: `step-${i - 1}`,
        target: `step-${i}`,
        markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(129,140,248,0.5)" },
        style: { stroke: "rgba(129,140,248,0.3)", strokeWidth: 2 },
        animated: true,
      });
    }
  });

  // Core flows branching from last step
  const lastIdx = journeySteps.length - 1;
  coreFlows.forEach((flow, i) => {
    const id = `core-${i}`;
    nodes.push({
      id,
      type: "flowNode",
      position: { x: 50 + i * 220, y: (lastIdx + 1) * 120 + 40 },
      data: { label: flow },
    });
    edges.push({
      id: `e-last-${id}`,
      source: `step-${lastIdx}`,
      target: id,
      markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(129,140,248,0.3)" },
      style: { stroke: "rgba(129,140,248,0.2)", strokeWidth: 1.5, strokeDasharray: "5 3" },
    });
  });

  return { nodes, edges };
}

export function UserFlowSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;
  return <UserFlowSectionInner analysis={analysis} />;
}

import { type ValiSearchAnalysis } from "@/types/analysis";

function UserFlowSectionInner({ analysis }: { analysis: ValiSearchAnalysis }) {
  const { user_flow, product_strategy } = analysis;

  const initial = useMemo(
    () => buildGraph(user_flow.journey_steps, user_flow.page_structure.core_flows),
    [user_flow]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(129,140,248,0.5)" },
            style: { stroke: "rgba(129,140,248,0.3)", strokeWidth: 2 },
            animated: true,
          },
          eds
        )
      ),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const id = `node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "flowNode",
        position: { x: 250 + Math.random() * 100, y: nds.length * 100 },
        data: { label: "New Step" },
      },
    ]);
  }, [setNodes]);

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">User Flow</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Interactive user journey — drag nodes, connect edges, add steps
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-[12px] gap-1.5" onClick={addNode}>
          <Plus className="h-3.5 w-3.5" /> Add Node
        </Button>
      </div>

      {/* Interactive flow editor */}
      <div className="rounded-xl border border-white/[0.09] bg-[rgba(255,255,255,0.02)] backdrop-blur-[10px] overflow-hidden" style={{ height: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        >
          <Background color="rgba(255,255,255,0.03)" gap={20} />
          <Controls
            className="!bg-[#111] !border-white/[0.09] !rounded-lg [&>button]:!bg-[#111] [&>button]:!border-white/[0.09] [&>button]:!text-white/40 [&>button:hover]:!bg-white/[0.08]"
          />
          <MiniMap
            nodeColor="rgba(129,140,248,0.4)"
            maskColor="rgba(0,0,0,0.7)"
            className="!bg-[#0a0a0a] !border-white/[0.09] !rounded-lg"
          />
        </ReactFlow>
      </div>

      {/* Page structure cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Landing Page">
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {user_flow.page_structure.landing}
          </p>
        </SectionCard>
        <SectionCard title="Dashboard">
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {user_flow.page_structure.dashboard}
          </p>
        </SectionCard>
        <SectionCard title="Core Flows">
          <div className="space-y-2">
            {user_flow.page_structure.core_flows.map((flow: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 shrink-0" />
                <span className="text-[13px] text-muted-foreground">{flow}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Step-by-step flow */}
      <SectionCard title="Step-by-Step Flow">
        <div className="space-y-3">
          {product_strategy.user_flow_steps.map((step: string, i: number) => (
            <div key={i} className="flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-white/[0.08] bg-white/[0.04] text-[11px] font-bold text-white/40">
                {i + 1}
              </div>
              <div className="pt-1 text-[13px] text-muted-foreground leading-relaxed">{step}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

import React, { useState } from "react";
import { LeftPanel } from "./LeftPanel";
import { Canvas } from "./Canvas";
import { RightPanel } from "./RightPanel";
import { WizardControls } from "./WizardControls";
import { useBuilder } from "../context/BuilderContext";
import { exportReactApp } from "./export-handler";
import { FlowDiagram } from "../components/shared/FlowDiagram";
import { Undo2 } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/button";

export const BuilderLayout: React.FC = () => {
  const { state, dispatch, canUndo } = useBuilder();
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  type Stage = { name: string; status: 'pending' | 'loading' | 'complete' | 'error' };

  const [stages, setStages] = useState<Stage[]>([
    { name: "Enter Schema", status: "complete" },
    { name: "Input Validation", status: "complete" },
    { name: "Schema Conversion", status: "complete" },
    { name: "AI Enhancement", status: "complete" },
    { name: "Frontend Generation", status: "pending" },
    { name: "Backend Generation", status: "pending" },
    { name: "DTO Generation", status: "pending" },
    { name: "Test Generation", status: "pending" },
  ]);

  const isFrontendComplete =
    stages.find((s) => s.name === "Frontend Generation")?.status === "complete";

  const markStage = (name: string, status: Stage['status']) =>
    setStages((prev) => prev.map((s) => s.name === name ? { ...s, status } : s));
  void markStage; // used in export/generate handlers below

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportReactApp(state.form);
      markStage("Frontend Generation", "complete");
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      markStage("Frontend Generation", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const genStageNames = ["Backend Generation", "DTO Generation"];
      for (const name of genStageNames) {
        markStage(name, "loading");
        await new Promise((r) => setTimeout(r, 600));
        markStage(name, "complete");
      }
      markStage("Frontend Generation", "complete");
      const dest = state.schemaId
        ? `/generated?schemaId=${state.schemaId}`
        : "/generated";
      window.location.href = dest;
    } catch {
      alert("Generation failed. Please try again.");
      setStages((prev) =>
        prev.map((s, idx) => (idx >= 5 ? { ...s, status: "error" } : s)),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="builder-root">
      {/* ── Shared Navbar (identical to the editor page) ── */}
      <Navbar />

      {/* ── Progress stepper sub-bar — full width, properly padded ── */}
      <div className="builder-stepper-bar">
        <FlowDiagram stages={stages} />
      </div>

      {/* ── 3-col body ── */}
      <div className="builder-body">
        {/* Left palette panel */}
        <aside className="builder-sidebar builder-sidebar--left">
          <LeftPanel />
        </aside>

        {/* Center: workspace toolbar → wizard bar → canvas */}
        <main className="builder-canvas-col">
          {/* Workspace toolbar: Undo lives here, close to the canvas */}
          <div className="canvas-toolbar">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!canUndo}
              className="gap-1.5 text-neutral-500 h-8 px-3 text-xs"
              title="Undo last change"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </Button>
          </div>

          <div className="wizard-bar">
            <WizardControls />
          </div>
          <div className="canvas-wrapper">
            <Canvas />
          </div>
        </main>

        {/* Right properties / theme panel */}
        <aside className="builder-sidebar builder-sidebar--right">
          <RightPanel
            onExport={handleExport}
            onGenerate={handleGenerate}
            isExporting={isExporting}
            isGenerating={isGenerating}
            isFrontendComplete={isFrontendComplete}
          />
        </aside>
      </div>
    </div>
  );
};

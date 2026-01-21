import React, { useState } from "react";
import { LeftPanel } from "./LeftPanel";
import { Canvas } from "./Canvas";
import { RightPanel } from "./RightPanel";
import { WizardControls } from "./WizardControls";
import { useBuilder } from "../context/BuilderContext";
import { exportReactApp } from "./export-handler";
import { FlowDiagram, GenerationStage } from "./FlowDiagram";
import { Sparkles, Undo2 } from "lucide-react";

export const BuilderLayout: React.FC = () => {
  const { state, dispatch, canUndo } = useBuilder();
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [stages, setStages] = useState<GenerationStage[]>([
    { name: "Enter Schema", status: "complete", progress: 100 },
    { name: "Input Validation", status: "complete", progress: 100 },
    { name: "Schema Conversion", status: "complete", progress: 100 },
    { name: "AI Enhancement", status: "complete", progress: 100 },
    { name: "Frontend Generation", status: "pending", progress: 0 },
    { name: "Backend Generation", status: "pending", progress: 0 },
    { name: "DTO Generation", status: "pending", progress: 0 },
    { name: "Test Generation", status: "pending", progress: 0 },
  ]);

  const isFrontendComplete =
    stages.find((s) => s.name === "Frontend Generation")?.status === "complete";

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportReactApp(state.form);
      setStages((prev) =>
        prev.map((s) =>
          s.name === "Frontend Generation"
            ? { ...s, status: "complete", progress: 100 }
            : s,
        ),
      );
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setStages((prev) =>
        prev.map((s) =>
          s.name === "Frontend Generation" ? { ...s, status: "error" } : s,
        ),
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generationStages = stages.slice(5, 7);
      for (let i = 0; i < generationStages.length; i++) {
        const stageIndex = i + 5;
        setStages((prev) =>
          prev.map((s, idx) =>
            idx === stageIndex ? { ...s, status: "loading", progress: 0 } : s,
          ),
        );
        for (let progress = 0; progress <= 100; progress += 25) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setStages((prev) =>
            prev.map((s, idx) => (idx === stageIndex ? { ...s, progress } : s)),
          );
        }
        setStages((prev) =>
          prev.map((s, idx) =>
            idx === stageIndex ? { ...s, status: "complete", progress: 100 } : s,
          ),
        );
      }
      const dest = state.schemaId ? `/generated?schemaId=${state.schemaId}` : "/generated";
      window.location.href = dest;
    } catch (error) {
      console.error("Generation failed:", error);
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
      {/* ── Top bar: spans full width above the 3-col body ── */}
      <header className="builder-topbar">
        {/* Left brand */}
        <div className="topbar-brand">
          <span className="topbar-logo">FS</span>
          <span className="topbar-title">Form Builder</span>
        </div>

        {/* Center: pipeline flow */}
        <div className="topbar-flow">
          <FlowDiagram stages={stages} />
        </div>

        {/* Right: actions */}
        <div className="topbar-actions">
          <button
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={!canUndo}
            className={`btn-ghost ${!canUndo ? "btn-disabled" : ""}`}
            title="Undo"
          >
            <Undo2 size={15} />
            <span>Undo</span>
          </button>

          {!isFrontendComplete ? (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="btn-primary"
            >
              <Sparkles size={16} />
              {isExporting ? "Exporting…" : "Export React App"}
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary"
            >
              <Sparkles size={16} />
              {isGenerating ? "Generating…" : "Generate Code"}
            </button>
          )}
        </div>
      </header>

      {/* ── Body: 3-col layout below the topbar ── */}
      <div className="builder-body">
        {/* Left panel */}
        <aside className="builder-sidebar builder-sidebar--left">
          <LeftPanel />
        </aside>

        {/* Center: wizard bar + canvas */}
        <main className="builder-canvas-col">
          <div className="wizard-bar">
            <WizardControls />
          </div>
          <div className="canvas-wrapper">
            <Canvas />
          </div>
        </main>

        {/* Right panel */}
        <aside className="builder-sidebar builder-sidebar--right">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
};

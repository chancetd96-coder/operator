"use client";

export type WorkspaceTab =
  | "overview"
  | "tasks"
  | "timeline"
  | "memory"
  | "documents"
  | "commander";

type WorkspaceTabsProps = {
  activeTab: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
};

const TABS: Array<{
  id: WorkspaceTab;
  label: string;
}> = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "timeline", label: "Timeline" },
  { id: "memory", label: "Memory" },
  { id: "documents", label: "Documents" },
  { id: "commander", label: "Commander" },
];

export default function WorkspaceTabs({
  activeTab,
  onChange,
}: WorkspaceTabsProps) {
  return (
    <nav className="sticky top-0 z-20 border-y border-white/10 bg-black/90 px-4 backdrop-blur-xl">
      <div className="flex gap-1 overflow-x-auto py-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "shrink-0 rounded-lg px-4 py-2 text-sm transition",
                isActive
                  ? "bg-white text-black"
                  : "text-white/45 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
"use client";

import { useMemo, useState } from "react";

interface DocumentsWorkspaceProps {
  resources: string[];
  onChange: (resources: string[]) => void;
}

type ResourceMode = "link" | "note";

const NOTE_PREFIX = "note:";

function isNote(resource: string): boolean {
  return resource.startsWith(NOTE_PREFIX);
}

function resourceLabel(resource: string): string {
  if (isNote(resource)) {
    return resource.slice(NOTE_PREFIX.length);
  }

  try {
    const url = new URL(resource);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return resource;
  }
}

export default function DocumentsWorkspace({
  resources,
  onChange,
}: DocumentsWorkspaceProps) {
  const [mode, setMode] = useState<ResourceMode>("link");
  const [value, setValue] = useState("");

  const normalizedResources = useMemo(
    () =>
      resources.filter(
        resource => resource.trim().length > 0,
      ),
    [resources],
  );

  function addResource(): void {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    const nextResource =
      mode === "note"
        ? `${NOTE_PREFIX}${trimmedValue}`
        : trimmedValue;

    onChange([
      ...normalizedResources,
      nextResource,
    ]);

    setValue("");
  }

  function removeResource(index: number): void {
    onChange(
      normalizedResources.filter(
        (_, resourceIndex) =>
          resourceIndex !== index,
      ),
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.25em] text-white/40">
            MISSION RESOURCES
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Documents
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Save mission links and working notes.
          </p>
        </div>

        <div className="flex rounded-lg border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`rounded-md px-3 py-2 text-sm transition ${
              mode === "link"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            Link
          </button>

          <button
            type="button"
            onClick={() => setMode("note")}
            className={`rounded-md px-3 py-2 text-sm transition ${
              mode === "note"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            Note
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        {mode === "note" ? (
          <textarea
            value={value}
            onChange={event =>
              setValue(event.target.value)
            }
            placeholder="Add a mission note..."
            rows={3}
            className="min-h-24 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-300/40"
          />
        ) : (
          <input
            type="url"
            value={value}
            onChange={event =>
              setValue(event.target.value)
            }
            onKeyDown={event => {
              if (event.key === "Enter") {
                addResource();
              }
            }}
            placeholder="https://example.com/resource"
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-300/40"
          />
        )}

        <button
          type="button"
          onClick={addResource}
          className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/15"
        >
          Add {mode === "note" ? "Note" : "Link"}
        </button>
      </div>

      <div className="mt-8">
        {normalizedResources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-white/35">
              No mission resources saved yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {normalizedResources.map(
              (resource, index) => {
                const note = isNote(resource);

                return (
                  <article
                    key={`${resource}:${index}`}
                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs tracking-[0.2em] text-white/35">
                          {note ? "NOTE" : "LINK"}
                        </p>

                        {note ? (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">
                            {resourceLabel(resource)}
                          </p>
                        ) : (
                          <a
                            href={resource}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block truncate text-sm text-cyan-300 hover:underline"
                          >
                            {resourceLabel(resource)}
                          </a>
                        )}

                        {!note && (
                          <p className="mt-1 truncate text-xs text-white/30">
                            {resource}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeResource(index)
                        }
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/40 transition hover:border-red-300/30 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
}
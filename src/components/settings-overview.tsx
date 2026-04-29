"use client";

import { useRef, useState } from "react";

import { Card } from "@/components/card";
import { DataSourceBadge } from "@/components/data-source-badge";
import {
  applyLocalAppBackup,
  buildLocalAppBackup,
  clearAllLocalAppData,
  getBackupFilename,
  validateLocalAppBackup,
} from "@/lib/local-app-data";
import { useLocalReviewHistory } from "@/lib/use-local-review-history";
import { useLocalReviewNotes } from "@/lib/use-local-review-notes";
import { useLocalSyncResult } from "@/lib/use-local-sync-result";

export function SettingsOverview() {
  const storedSync = useLocalSyncResult();
  const localReviewNotes = useLocalReviewNotes();
  const localReviewHistory = useLocalReviewHistory();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const reviewNotesCount = Object.keys(localReviewNotes).length;
  const reviewHistoryCount = Object.values(localReviewHistory).reduce(
    (sum, records) => sum + records.length,
    0,
  );

  function handleExportJson() {
    const backup = buildLocalAppBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getBackupFilename();
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Backup exported.");
  }

  async function handleImportJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const payload = JSON.parse(text) as unknown;

      if (!validateLocalAppBackup(payload)) {
        setStatus("Import failed: invalid backup file.");
        return;
      }

      const confirmed = window.confirm(
        "Importing this backup will overwrite existing local app data in this browser. Continue?",
      );

      if (!confirmed) {
        setStatus("Import cancelled.");
        return;
      }

      applyLocalAppBackup(payload);
      setStatus("Backup imported. Reloading app data...");
      window.location.reload();
    } catch {
      setStatus("Import failed: unable to read backup file.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleClearAllLocalData() {
    const confirmed = window.confirm(
      "Clear all local LeetCode Review Tracker data from this browser?",
    );

    if (!confirmed) {
      setStatus("Clear cancelled.");
      return;
    }

    clearAllLocalAppData();
    setStatus("All local app data cleared. Reloading app data...");
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <Card
        title="Local data summary"
        subtitle="Only LeetCode Review Tracker localStorage keys are included in backup and restore."
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="flex flex-wrap items-center gap-3">
            <DataSourceBadge live={Boolean(storedSync)} />
            <p>Sync data: {storedSync ? "Exists" : "Missing"}</p>
            <p>Review notes: {reviewNotesCount}</p>
            <p>Review history: {reviewHistoryCount}</p>
          </div>
          <p>
            Last synced: {storedSync?.syncedAt?.slice(0, 16).replace("T", " ") ?? "Never"}
          </p>
        </div>
      </Card>

      <Card
        title="Local data backup"
        subtitle="Export or restore sync data, review notes, review history, and other app-specific localStorage data for this project."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Export JSON
            </button>

            <label className="inline-flex cursor-pointer rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Import JSON
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleClearAllLocalData}
              className="rounded-full border border-rose-300 bg-white px-5 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
            >
              Clear all local app data
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>Backup format includes `version`, `exportedAt`, and a `data` object.</p>
            <p className="mt-2">
              The export does not include browser cookies, unrelated localStorage keys, passwords,
              or tokens.
            </p>
          </div>

          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
        </div>
      </Card>
    </div>
  );
}

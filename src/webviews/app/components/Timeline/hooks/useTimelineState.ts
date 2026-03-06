import { useState, useEffect } from "react";
import {
  TimelineState,
  TabType,
  ContextMenuState,
} from "../types/timeline.types";
import { DiffLine, GitCommit, VSCodeBridge } from "../../../bridge";

export const useTimelineState = (
  bridge: VSCodeBridge,
  history: GitCommit[],
  commitsOffset: number,
) => {
  const [activeTab, setActiveTab] = useState<TabType>("changes");
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [newBranchDialog, setNewBranchDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [uncommittedChangesDialog, setUncommittedChangesDialog] =
    useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allCommits, setAllCommits] = useState<GitCommit[]>([]);
  const [selectedCommitHash, setSelectedCommitHash] = useState<string | null>(
    null,
  );
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedDiffLines, setSelectedDiffLines] = useState<Set<string>>(
    new Set(),
  );
  const [fileDiffLines, setFileDiffLines] = useState<DiffLine[]>([]);
  const [fileDiffStaged, setFileDiffStaged] = useState(false);

  // Update allCommits when history changes
  useEffect(() => {
    if (commitsOffset === 0) {
      setAllCommits(history);
    }
  }, [history, commitsOffset]);

  // Handle load more commits response
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.command === "loadMoreCommitsResponse") {
        setAllCommits((prev) => [...prev, ...message.history]);
        setIsLoadingMore(false);
      } else if (message.command === "workingFileDiff") {
        setFileDiffLines(message.lines || []);
        setFileDiffStaged(Boolean(message.staged));
        setSelectedDiffLines(new Set());
      }
    };

    bridge.onMessage(handleMessage);
    return () => {
      // Cleanup if needed
    };
  }, [bridge]);

  return {
    state: {
      activeTab,
      commitMessage,
      selectedFiles,
      contextMenu,
      newBranchDialog,
      newBranchName,
      uncommittedChangesDialog,
      isLoadingMore,
      allCommits,
      selectedCommitHash,
      selectedFilePath,
      selectedDiffLines,
      fileDiffLines,
      fileDiffStaged,
    },
    actions: {
      setActiveTab,
      setCommitMessage,
      setSelectedFiles,
      setContextMenu,
      setNewBranchDialog,
      setNewBranchName,
      setUncommittedChangesDialog,
      setIsLoadingMore,
      setAllCommits,
      setSelectedCommitHash,
      setSelectedFilePath,
      setSelectedDiffLines,
      setFileDiffLines,
      setFileDiffStaged,
    },
  };
};

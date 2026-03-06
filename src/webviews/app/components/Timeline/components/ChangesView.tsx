import React from 'react';
import { Box, Typography, TextField, Button, Checkbox } from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Check as CheckIcon,
  Sync as SyncIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { GitChange } from '../../../bridge';
import { FileChangesList } from './FileChangesList';
import { DiffLine } from '../../../bridge';

interface ChangesViewProps {
  changes: GitChange[];
  selectedFiles: Set<string>;
  commitMessage: string;
  currentBranch: string | null;
  onFileToggle: (filePath: string) => void;
  onStageFiles: () => void;
  onUnstageFiles: () => void;
  onCommitMessageChange: (message: string) => void;
  onCommit: () => void;
  onPush: () => void;
  onPull: () => void;
  selectedFilePath: string | null;
  diffLines: DiffLine[];
  selectedDiffLines: Set<string>;
  onDiffLineToggle: (lineId: string) => void;
  onStageSelectedLines: () => void;
  onDiscardFile: () => void;
  onDiscardSelectedLines: () => void;
  fileDiffStaged: boolean;
}

export const ChangesView: React.FC<ChangesViewProps> = ({
  changes,
  selectedFiles,
  commitMessage,
  currentBranch,
  onFileToggle,
  onStageFiles,
  onUnstageFiles,
  onCommitMessageChange,
  onCommit,
  onPush,
  onPull,
  selectedFilePath,
  diffLines,
  selectedDiffLines,
  onDiffLineToggle,
  onStageSelectedLines,
  onDiscardFile,
  onDiscardSelectedLines,
  fileDiffStaged,
}) => {
  const stagedChanges = (changes || []).filter(c => c.staged);
  const unstagedChanges = (changes || []).filter(c => !c.staged);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Commit Message Section */}
      <Box sx={{
        p: 1,
        borderBottom: '1px solid var(--vscode-sideBarSectionHeader-border)'
      }}>
        <TextField
          multiline
          fullWidth
          placeholder="Message (press Ctrl+Enter to commit)"
          value={commitMessage}
          onChange={(e) => onCommitMessageChange(e.target.value)}
          variant="outlined"
          size="small"
          minRows={2}
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '13px',
              bgcolor: 'var(--vscode-input-background)',
              color: 'var(--vscode-input-foreground)',
              '& fieldset': {
                borderColor: 'var(--vscode-input-border)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--vscode-input-border)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--vscode-focusBorder)',
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'var(--vscode-input-placeholderForeground)',
              opacity: 1,
            }
          }}
        />

        {/* Commit Actions */}
        <Box sx={{
          display: 'flex',
          gap: 1,
          mt: 1,
          alignItems: 'center'
        }}>
          <Button
            variant="contained"
            onClick={onCommit}
            disabled={!commitMessage.trim() || stagedChanges.length === 0}
            startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontSize: '12px',
              textTransform: 'none',
              bgcolor: 'var(--vscode-button-background)',
              color: 'var(--vscode-button-foreground)',
              '&:hover': {
                bgcolor: 'var(--vscode-button-hoverBackground)',
              },
              '&:disabled': {
                bgcolor: 'var(--vscode-button-secondaryBackground)',
                color: 'var(--vscode-button-secondaryForeground)',
              }
            }}
          >
            Commit
          </Button>

          <Button
            variant="outlined"
            onClick={onPush}
            startIcon={<SyncIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontSize: '12px',
              textTransform: 'none',
              borderColor: 'var(--vscode-button-border)',
              color: 'var(--vscode-button-foreground)',
              '&:hover': {
                bgcolor: 'var(--vscode-button-hoverBackground)',
                borderColor: 'var(--vscode-button-border)',
              }
            }}
          >
            Sync Changes
          </Button>

          <Button
            size="small"
            sx={{
              minWidth: 'auto',
              p: 0.5,
              color: 'var(--vscode-button-foreground)'
            }}
          >
            <MoreIcon sx={{ fontSize: 16 }} />
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
      {/* Changes List */}
      <Box sx={{ flex: 1, overflow: 'auto', borderRight: '1px solid var(--vscode-sideBarSectionHeader-border)' }}>
        {stagedChanges.length > 0 && (
          <FileChangesList
            title="Staged Changes"
            changes={stagedChanges}
            selectedFiles={selectedFiles}
            onFileToggle={onFileToggle}
            onActionClick={onUnstageFiles}
            actionLabel="Unstage All"
            actionIcon={<RemoveIcon sx={{ fontSize: 14 }} />}
          />
        )}

        {unstagedChanges.length > 0 && (
          <FileChangesList
            title="Changes"
            changes={unstagedChanges}
            selectedFiles={selectedFiles}
            onFileToggle={onFileToggle}
            onActionClick={onStageFiles}
            actionLabel="Stage All"
            actionIcon={<AddIcon sx={{ fontSize: 14 }} />}
          />
        )}

        {changes.length === 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            p: 2,
            textAlign: 'center'
          }}>
            <CheckIcon sx={{
              fontSize: 48,
              color: 'var(--vscode-descriptionForeground)',
              mb: 2
            }} />
            <Typography sx={{
              fontSize: '14px',
              color: 'var(--vscode-foreground)',
              mb: 1
            }}>
              No changes
            </Typography>
            <Typography sx={{
              fontSize: '12px',
              color: 'var(--vscode-descriptionForeground)'
            }}>
              The working tree is clean. There are no changes to commit.
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1.2, overflow: 'auto', p: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Button size="small" variant="outlined" onClick={onStageSelectedLines} disabled={selectedDiffLines.size === 0 || fileDiffStaged}>暂存选中行</Button>
          <Button size="small" variant="outlined" color="warning" onClick={onDiscardSelectedLines} disabled={selectedDiffLines.size === 0 || fileDiffStaged}>丢弃选中行</Button>
          <Button size="small" variant="outlined" color="error" onClick={onDiscardFile} disabled={!selectedFilePath}>丢弃文件改动</Button>
        </Box>
        <Typography sx={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)', mb: 1 }}>
          {selectedFilePath ? `${selectedFilePath}${fileDiffStaged ? '（已暂存）' : ''}` : '点击左侧文件查看并勾选具体变更行'}
        </Typography>
        {diffLines.map((line) => (
          <Box key={line.id} sx={{ display: 'flex', alignItems: 'flex-start', bgcolor: line.type === 'add' ? 'rgba(46,160,67,0.12)' : 'rgba(248,81,73,0.12)' }}>
            <Checkbox
              size="small"
              checked={selectedDiffLines.has(line.id)}
              onChange={() => onDiffLineToggle(line.id)}
              disabled={fileDiffStaged}
            />
            <Typography component="pre" sx={{ m: 0, fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: line.type === 'add' ? '#3fb950' : '#f85149' }}>
              {line.type === 'add' ? '+' : '-'} {line.content}
            </Typography>
          </Box>
        ))}
      </Box>
      </Box>
    </Box>
  );
};

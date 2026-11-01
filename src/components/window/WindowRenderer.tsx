import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { WindowFrame } from './WindowFrame';
import { MyComputer } from '../apps/MyComputer';
import { FileExplorer } from '../apps/FileExplorer';
import { Notepad } from '../apps/Notepad';
import { Paint } from '../apps/Paint';
import { Calculator } from '../apps/Calculator';
import { ControlPanel } from '../apps/ControlPanel';
import { InternetExplorer } from '../apps/InternetExplorer';
import { ImageViewer } from '../apps/ImageViewer';
import { DocumentViewer } from '../apps/DocumentViewer';
import { Minesweeper } from '../apps/games/Minesweeper';
import { Solitaire } from '../apps/games/Solitaire';
import { Snake } from '../apps/games/Snake';
import { ShutdownDialog } from '../dialogs/ShutdownDialog';
import { RunDialog } from '../dialogs/RunDialog';
import { HelpDialog } from '../dialogs/HelpDialog';
import { RetroChat } from '../apps/RetroChat';
import { RetroSpreadsheet } from '../apps/RetroSpreadsheet';
import { OperationSalt } from '../apps/OperationSalt';
import { UnseenFootageGallery } from '../apps/UnseenFootageGallery';
import { WinIconType } from '../common/WinIcon';

interface WindowRendererProps {
  onWallpaperChange: (url: string | undefined) => void;
}

export const WindowRenderer: React.FC<WindowRendererProps> = ({ onWallpaperChange }) => {
  const { windows } = useWindowManager();

  const getWindowIcon = (appId: string): WinIconType => {
    switch (appId) {
      case 'my-computer': return 'computer';
      case 'file-explorer': return 'folder-open';
      case 'notepad': return 'notepad';
      case 'paint': return 'paint';
      case 'calculator': return 'calculator';
      case 'control-panel': return 'control-panel';
      case 'internet-explorer': return 'ie';
      case 'minesweeper': return 'minesweeper';
      case 'solitaire': return 'solitaire';
      case 'snake': return 'snake';
      case 'image-viewer': return 'image';
      case 'document-viewer': return 'document';
      case 'shutdown': return 'shutdown';
      case 'run': return 'run';
      case 'help': return 'help';
      case 'retro-chat': return 'network';
      case 'retro-spreadsheet': return 'document';
      case 'operation-salt': return 'run';
      case 'unseen-footage': return 'image';
      default: return 'computer';
    }
  };

  const renderAppContent = (win: any) => {
    switch (win.appId) {
      case 'my-computer':
        return <MyComputer />;
      case 'file-explorer':
        return <FileExplorer initialPath={win.initialParams?.path} />;
      case 'notepad':
        return <Notepad initialPath={win.initialParams?.path} />;
      case 'paint':
        return <Paint />;
      case 'calculator':
        return <Calculator />;
      case 'control-panel':
        return <ControlPanel onWallpaperChange={onWallpaperChange} />;
      case 'internet-explorer':
        return <InternetExplorer initialUrl={win.initialParams?.url} />;
      case 'image-viewer':
        return <ImageViewer item={win.initialParams?.item} />;
      case 'document-viewer':
        return <DocumentViewer item={win.initialParams?.item} />;
      case 'minesweeper':
        return <Minesweeper />;
      case 'solitaire':
        return <Solitaire />;
      case 'snake':
        return <Snake />;
      case 'shutdown':
        return <ShutdownDialog />;
      case 'run':
        return <RunDialog />;
      case 'help':
        return <HelpDialog />;
      case 'retro-chat':
        return <RetroChat />;
      case 'retro-spreadsheet':
        return <RetroSpreadsheet />;
      case 'operation-salt':
        return <OperationSalt />;
      case 'unseen-footage':
        return <UnseenFootageGallery />;
      default:
        return <div style={{ padding: 12 }}>Application window</div>;
    }
  };

  return (
    <>
      {windows.map((win) => (
        <WindowFrame key={win.id} window={win} iconName={getWindowIcon(win.appId)}>
          {renderAppContent(win)}
        </WindowFrame>
      ))}
    </>
  );
};

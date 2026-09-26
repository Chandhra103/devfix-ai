import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
export function AppLayout({ children, title }: { children: ReactNode; title: string }) { return <div className="app-shell"><Sidebar /><main className="main-shell"><TopBar title={title} /><div className="content-wrap">{children}</div></main></div>; }

import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Top application navigation bar with system status and tab switching.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d1a]/85 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Brand identity -->
        <div class="flex items-center gap-3 cursor-pointer" (click)="state.setTab('scanner')">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 border border-cyan-400/30">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
              <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
              <path d="M2 18l4-4"/>
              <path d="M6 14l2 2"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-black tracking-tight text-white glow-text-cyan">
                PALEO<span class="text-cyan-400">-SCANNER</span>
              </h1>
              <span class="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                AI + Fossil
              </span>
            </div>
            <p class="text-xs text-slate-400 hidden sm:block">
              Visão Computacional & Paleontologia Comparada
            </p>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <nav class="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            (click)="state.setTab('scanner')"
            class="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200"
            [class]="state.activeTab() === 'scanner'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
            <span>Digitalizador</span>
          </button>

          <button
            type="button"
            (click)="state.setTab('catalog')"
            class="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200"
            [class]="state.activeTab() === 'catalog'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/>
              <path d="m5 2 5 5"/>
              <path d="m2 5 5 5"/>
              <circle cx="18" cy="18" r="3"/>
            </svg>
            <span>Catálogo</span>
            @if (state.totalSpeciesCount() > 0) {
              <span class="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-300 font-mono">
                {{ state.totalSpeciesCount() }}
              </span>
            }
          </button>
        </nav>

        <!-- Connectivity status and GitHub -->
        <div class="flex items-center gap-3">
          <!-- Backend health dot -->
          <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            @if (state.isBackendOnline() === true) {
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-emerald-400 font-medium hidden md:inline">API Online</span>
            } @else if (state.isBackendOnline() === false) {
              <span class="w-2 h-2 rounded-full bg-rose-500"></span>
              <span class="text-rose-400 font-medium hidden md:inline">API Offline</span>
            } @else {
              <span class="w-2 h-2 rounded-full bg-slate-500 animate-spin"></span>
              <span class="text-slate-400 font-medium hidden md:inline">Conectando...</span>
            }
          </div>

          <!-- GitHub link -->
          <a
            href="https://github.com/Elyyihz/paleo-scanner"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            title="Repositório no GitHub"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  public readonly state = inject(ScannerStateService);
}

import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Top application navigation bar with high-tech bio-lab telemetry
 * and balanced 3-column alignment.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-[#174463] bg-[#071927]/95 backdrop-blur-md shadow-lg shadow-cyan-950/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Left: Brand identity with Tech HUD tag -->
        <div class="flex items-center gap-3 cursor-pointer select-none min-w-[200px]" (click)="state.setTab('scanner')">
          <img
            src="/logo.png"
            alt="Paleo Pines"
            class="h-9 w-auto object-contain shrink-0 drop-shadow-md hover:scale-105 transition-transform"
          />
          <div class="flex items-baseline gap-2">
            <h1 class="text-base sm:text-lg font-black tracking-tight text-[#f8fafc]">
              PALEO<span class="text-[#06b6d4]">-SCANNER</span>
            </h1>
            <span class="hidden xl:inline text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-[#0b2436] text-[#38bdf8] border border-[#174463]">
              BIO-LAB V2.4
            </span>
          </div>
        </div>

        <!-- Center: Navigation Tabs (Tech Viewport Switcher) -->
        <nav class="flex items-center gap-1.5 bg-[#091f2f] p-1 rounded-xl border border-[#174463] shadow-inner shrink-0">
          <button
            type="button"
            (click)="state.setTab('scanner')"
            class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
            [class]="state.activeTab() === 'scanner'
              ? 'bg-[#0891b2] text-white shadow-md shadow-cyan-950/60 border border-cyan-400/40'
              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0f2c42]'"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
            </svg>
            <span>Scanner</span>
          </button>

          <button
            type="button"
            (click)="state.setTab('catalog')"
            class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
            [class]="state.activeTab() === 'catalog'
              ? 'bg-[#059669] text-white shadow-md shadow-emerald-950/60 border border-emerald-400/40'
              : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0f2c42]'"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
            <span>Catálogo</span>
            @if (state.totalSpeciesCount() > 0) {
              <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-[#05131e] text-[#34d399] font-mono font-bold">
                {{ state.totalSpeciesCount() }}
              </span>
            }
          </button>
        </nav>

        <!-- Right: Connectivity Status & Telemetry -->
        <div class="flex items-center justify-end gap-2.5 min-w-[200px]">
          @if (state.isBackendOnline() === true) {
            <div
              (click)="state.verifyBackendHealth()"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#062c20] text-[#34d399] border border-[#0d6b4a] shadow-xs cursor-pointer hover:brightness-110 transition-all"
              title="API FastAPI e Banco de Dados Relacional Online (Clique para re-verificar)"
            >
              <span class="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span class="font-mono text-[11px]">API ONLINE</span>
            </div>
          } @else if (state.isBackendOnline() === false) {
            <button
              type="button"
              (click)="state.verifyBackendHealth()"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3b1115] text-[#fca5a5] border border-[#8b2229] hover:bg-[#52161c] transition-colors cursor-pointer"
              title="Clique para reconectar ao backend"
            >
              <span class="w-2 h-2 rounded-full bg-[#ef4444]"></span>
              <span class="font-mono text-[11px]">OFFLINE · RECONECTAR</span>
            </button>
          } @else {
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#0b2436] text-[#94a3b8] border border-[#174463]">
              <span class="w-2 h-2 rounded-full bg-[#06b6d4] animate-ping"></span>
              <span>INICIANDO...</span>
            </div>
          }

          <!-- External GitHub Repo Link -->
          <a
            href="https://github.com/Elyyihz/paleo-scanner"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0f2c42] border border-transparent hover:border-[#174463] transition-all"
            title="Ver código-fonte no GitHub"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
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

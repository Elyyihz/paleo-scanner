import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Top application navigation bar with sober bio-lab telemetry
 * and balanced 3-column alignment.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-[#222d3a] bg-[#0e141b]/95 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Left: Brand identity with Tech HUD tag -->
        <div class="flex items-center gap-3 cursor-pointer select-none min-w-[200px]" (click)="state.setTab('scanner')">
          <img
            src="/logo.png"
            alt="Paleo Pines"
            class="h-9 w-auto object-contain shrink-0 drop-shadow-sm hover:opacity-95 transition-opacity"
          />
          <div class="flex items-baseline gap-2">
            <h1 class="text-base sm:text-lg font-black tracking-tight text-[#ebe6dc]">
              PALEO<span class="text-[#c8873a]">-SCANNER</span>
            </h1>
            <span class="hidden xl:inline text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-[#16202a] text-[#c8873a] border border-[#2c3b4c]">
              PESQUISA PALEOBIOLÓGICA
            </span>
          </div>
        </div>

        <!-- Center: Navigation Tabs (Tech Viewport Switcher) -->
        <nav class="flex items-center gap-1.5 bg-[#121820] p-1 rounded-md border border-[#222d3a] shrink-0">
          <button
            type="button"
            (click)="state.setTab('scanner')"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold transition-all duration-200 cursor-pointer"
            [class]="state.activeTab() === 'scanner'
              ? 'bg-[#1e293b] text-white border border-[#3b82f6]/40 shadow-xs'
              : 'text-[#94a3b8] hover:text-[#ebe6dc] hover:bg-[#16202a]'"
          >
            <svg class="w-3.5 h-3.5 text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
            </svg>
            <span>Scanner</span>
          </button>

          <button
            type="button"
            (click)="state.setTab('catalog')"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold transition-all duration-200 cursor-pointer"
            [class]="state.activeTab() === 'catalog'
              ? 'bg-[#1e293b] text-white border border-[#2e7d4b]/50 shadow-xs'
              : 'text-[#94a3b8] hover:text-[#ebe6dc] hover:bg-[#16202a]'"
          >
            <svg class="w-3.5 h-3.5 text-[#4ade80]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
            <span>Catálogo</span>
            @if (state.totalSpeciesCount() > 0) {
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-[#0c1015] text-[#c8873a] font-mono font-bold">
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
              class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-[#0f241a] text-[#4ade80] border border-[#1b5e39] cursor-pointer hover:brightness-110 transition-all"
              title="API FastAPI e Banco de Dados Relacional Online (Clique para re-verificar)"
            >
              <span class="w-2 h-2 rounded-full bg-[#22c55e]"></span>
              <span class="font-mono text-[11px]">SISTEMA ONLINE</span>
            </div>
          } @else if (state.isBackendOnline() === false) {
            <button
              type="button"
              (click)="state.verifyBackendHealth()"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-[#291215] text-[#f87171] border border-[#7f1d1d] hover:bg-[#38161a] transition-colors cursor-pointer"
              title="Clique para reconectar ao backend"
            >
              <span class="w-2 h-2 rounded-full bg-[#ef4444]"></span>
              <span class="font-mono text-[11px]">OFFLINE · RECONECTAR</span>
            </button>
          } @else {
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-[#16202a] text-[#94a3b8] border border-[#222d3a]">
              <span class="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping"></span>
              <span>INICIANDO...</span>
            </div>
          }

          <!-- External GitHub Repo Link -->
          <a
            href="https://github.com/Elyyihz/paleo-scanner"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:flex items-center gap-1.5 p-2 rounded-md text-[#94a3b8] hover:text-[#ebe6dc] hover:bg-[#16202a] border border-transparent hover:border-[#222d3a] transition-all"
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

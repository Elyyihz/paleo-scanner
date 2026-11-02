import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Top application navigation bar with balanced 3-column alignment
 * and official Paleo Pines rustic visual identity.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-[#3d2d20] bg-[#1a140f]/95 backdrop-blur-md shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Left: Brand identity (Balanced & Level) -->
        <div class="flex items-center gap-3 cursor-pointer select-none min-w-[200px]" (click)="state.setTab('scanner')">
          <img
            src="/logo.png"
            alt="Paleo Pines"
            class="h-9 w-auto object-contain shrink-0 drop-shadow-sm hover:scale-105 transition-transform"
          />
          <div class="flex items-baseline gap-1.5">
            <h1 class="text-base sm:text-lg font-black tracking-tight text-[#fceddb]">
              PALEO<span class="text-[#f4a261]">-SCANNER</span>
            </h1>
            <span class="hidden xl:inline text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#2e2117] text-[#dda15e] border border-[#523927]">
              Fóssil
            </span>
          </div>
        </div>

        <!-- Center: Navigation Tabs (Perfect Horizontal Symmetry) -->
        <nav class="flex items-center gap-1 bg-[#231a13] p-1 rounded-xl border border-[#443224] shadow-inner shrink-0">
          <button
            type="button"
            (click)="state.setTab('scanner')"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
            [class]="state.activeTab() === 'scanner'
              ? 'bg-[#d97706] text-amber-50 shadow-sm shadow-amber-950/60 border border-amber-400/30'
              : 'text-[#c2ae9b] hover:text-[#fceddb] hover:bg-[#34261c]'"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
              <path d="M11 8v6"/>
              <path d="M8 11h6"/>
            </svg>
            <span>Digitalizador</span>
          </button>

          <button
            type="button"
            (click)="state.setTab('catalog')"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
            [class]="state.activeTab() === 'catalog'
              ? 'bg-[#2d6a4f] text-emerald-50 shadow-sm shadow-emerald-950/60 border border-emerald-400/30'
              : 'text-[#c2ae9b] hover:text-[#fceddb] hover:bg-[#34261c]'"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
            <span>Catálogo</span>
            @if (state.totalSpeciesCount() > 0) {
              <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-[#18110b] text-[#f4a261] font-mono font-bold">
                {{ state.totalSpeciesCount() }}
              </span>
            }
          </button>
        </nav>

        <!-- Right: Connectivity Status & GitHub (Evenly Balanced) -->
        <div class="flex items-center justify-end gap-2.5 min-w-[200px]">
          <!-- Backend health pill with click to retry -->
          <button
            type="button"
            (click)="state.verifyBackendHealth()"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs"
            [title]="state.isBackendOnline() === false ? 'Clique para reconectar à API (127.0.0.1:8000)' : 'Status da API'"
            [class]="state.isBackendOnline() === true
              ? 'bg-[#183120] text-[#74c69d] border-[#2d6a4f]'
              : state.isBackendOnline() === false
                ? 'bg-[#3d1818] text-[#fca5a5] border-[#991b1b] hover:bg-[#4f2020]'
                : 'bg-[#291f16] text-[#dda15e] border-[#5e432d]'"
          >
            @if (state.isBackendOnline() === true) {
              <span class="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
              <span class="hidden sm:inline">API Online</span>
            } @else if (state.isBackendOnline() === false) {
              <span class="w-2 h-2 rounded-full bg-[#ef4444]"></span>
              <span class="hidden sm:inline">API Offline ↻</span>
            } @else {
              <span class="w-2 h-2 rounded-full bg-[#f4a261] animate-spin"></span>
              <span class="hidden sm:inline">Conectando...</span>
            }
          </button>

          <!-- GitHub link -->
          <a
            href="https://github.com/Elyyihz/paleo-scanner"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-[#c2ae9b] hover:text-[#f4a261] transition-colors rounded-xl hover:bg-[#2a1e16] border border-transparent hover:border-[#4d3826]"
            title="Repositório no GitHub"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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

import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { HttpClient } from '@angular/common/http';

/**
 * Interactive viewfinder upload zone for Paleo Pines screenshots
 * featuring sober laboratory styling, subtle scanline animation, rotating analytical messages,
 * global clipboard paste (Ctrl+V) and instant demo scan presets.
 */
@Component({
  selector: 'app-upload-zone',
  standalone: true,
  host: { class: 'block w-full' },
  template: `
    <div class="space-y-4">
      @if (!state.selectedFile()) {
        <!-- Laboratory Drop Zone / Viewfinder -->
        <div
          class="relative rounded-lg border-2 border-dashed transition-all duration-200 p-8 sm:p-10 text-center cursor-pointer group bg-[#121820] hover:bg-[#16202a]"
          [class]="isDragging()
            ? 'border-[#c8873a] bg-[#1a232e] shadow-xl'
            : 'border-[#222d3a] hover:border-[#c8873a]/70'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
          tabindex="0"
          role="button"
          aria-label="Área de envio de captura de tela de dinossauro"
          (keydown.enter)="fileInput.click()"
          (keydown.space)="fileInput.click()"
        >
          <!-- 4 Specimen Corners -->
          <i class="corner tl"></i>
          <i class="corner tr"></i>
          <i class="corner bl"></i>
          <i class="corner br"></i>

          <input
            #fileInput
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            (change)="onFileSelected($event)"
          />

          <!-- Scanner Lens Icon -->
          <div class="mx-auto w-14 h-14 rounded bg-[#0c1015] border border-[#222d3a] flex items-center justify-center text-[#c8873a] group-hover:border-[#c8873a] transition-colors shadow-sm">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
            </svg>
          </div>

          <h3 class="mt-4 text-lg font-bold text-[#ebe6dc] group-hover:text-[#c8873a] transition-colors">
            Solte aqui a captura do seu espécime
          </h3>

          <p class="text-xs text-[#94a3b8] mt-1.5 max-w-md mx-auto">
            Arraste um print, selecione um arquivo ou <strong class="text-[#c8873a] font-mono">cole direto com Ctrl+V</strong> (PNG, JPG, WEBP até 10MB)
          </p>

          <!-- Quick Test Presets & Instant Demo -->
          <div class="mt-5 pt-4 border-t border-[#222d3a] flex flex-wrap items-center justify-center gap-2" (click)="$event.stopPropagation()">
            <button
              type="button"
              (click)="runInstantDemo()"
              class="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-bold rounded bg-[#c8873a] text-[#0c1015] hover:bg-[#dba159] transition-all cursor-pointer shadow-md shadow-amber-950/30"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Escanear Amostra (Demo)</span>
            </button>

            <span class="text-xs font-mono text-[#64748b] px-1 font-medium hidden sm:inline">ou teste por espécie:</span>

            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Parasaurolophus Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('parasaurolophus')"
                class="px-2.5 py-1 text-xs font-mono font-medium rounded bg-[#0c1015] hover:bg-[#1a232e] border border-[#222d3a] text-[#ebe6dc] hover:border-[#c8873a] transition-colors cursor-pointer"
              >
                Parasaurolophus
              </button>

              <!-- Stegosaurus Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('stegosaurus')"
                class="px-2.5 py-1 text-xs font-mono font-medium rounded bg-[#0c1015] hover:bg-[#1a232e] border border-[#222d3a] text-[#ebe6dc] hover:border-[#c8873a] transition-colors cursor-pointer"
              >
                Stegosaurus
              </button>

              <!-- Triceratops Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('triceratops')"
                class="px-2.5 py-1 text-xs font-mono font-medium rounded bg-[#0c1015] hover:bg-[#1a232e] border border-[#222d3a] text-[#ebe6dc] hover:border-[#c8873a] transition-colors cursor-pointer"
              >
                Triceratops
              </button>

              <!-- T-Rex Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('tyrannosaurus-rex')"
                class="px-2.5 py-1 text-xs font-mono font-medium rounded bg-[#0c1015] hover:bg-[#1a232e] border border-[#222d3a] text-[#ebe6dc] hover:border-[#c8873a] transition-colors cursor-pointer"
              >
                T-Rex
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Loaded File Preview Visor with Scanning Animation -->
        <div class="relative rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-xl overflow-hidden">
          <i class="corner tl"></i>
          <i class="corner tr"></i>
          <i class="corner bl"></i>
          <i class="corner br"></i>

          <div class="flex flex-col sm:flex-row items-center gap-5">
            <!-- Image Frame with Sweep Scanline during processing -->
            <div class="specimen-viewport relative w-36 h-36 sm:w-44 sm:h-44 rounded border border-[#222d3a] bg-[#080c10] overflow-hidden shrink-0 flex items-center justify-center p-2">
              @if (state.previewUrl(); as url) {
                <img
                  [src]="url"
                  alt="Pré-visualização do espécime"
                  class="w-full h-full object-contain rounded"
                />
              }

              <!-- Active Laser Scanline Animation when isScanning -->
              @if (state.isScanning()) {
                <div class="scanline"></div>
              }
            </div>

            <!-- Analysis Details & Actions -->
            <div class="flex-1 space-y-3 text-center sm:text-left w-full">
              <div>
                <span class="text-xs uppercase font-mono font-semibold text-[#c8873a] tracking-wider">
                  {{ state.isScanning() ? 'VARREDURA EM ANDAMENTO' : 'AMOSTRA CARREGADA' }}
                </span>
                <h4 class="text-lg font-bold text-[#ebe6dc] truncate">
                  {{ state.selectedFile()?.name }}
                </h4>
                <p class="text-xs font-mono text-[#94a3b8] mt-0.5">
                  TAMANHO: {{ ((state.selectedFile()?.size || 0) / (1024 * 1024)).toFixed(2) }} MB
                </p>
              </div>

              <!-- Animated Scan Messages -->
              @if (state.isScanning()) {
                <div class="p-3 rounded bg-[#0c1015] border border-[#222d3a] space-y-1.5">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#c8873a] animate-ping"></span>
                    <span class="text-xs font-mono font-medium text-[#c8873a]">
                      {{ currentScanMessage() }}
                    </span>
                  </div>
                  <div class="h-1.5 w-full bg-[#16202a] rounded overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-[#c8873a] to-[#2e7d4b] animate-pulse w-full"></div>
                  </div>
                </div>
              }

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                @if (!state.isScanning()) {
                  <button
                    type="button"
                    (click)="startScan()"
                    class="flex items-center gap-2 px-4 py-2 rounded font-mono font-bold text-xs bg-[#c8873a] text-[#0c1015] hover:bg-[#dba159] transition-all cursor-pointer shadow-md shadow-amber-950/30"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                    </svg>
                    <span>INICIAR ESCANEAMENTO</span>
                  </button>

                  <button
                    type="button"
                    (click)="state.clearScan()"
                    class="px-3.5 py-2 rounded font-mono font-medium text-xs text-[#94a3b8] bg-[#0c1015] hover:bg-[#1a232e] hover:text-[#ebe6dc] border border-[#222d3a] transition-colors cursor-pointer"
                  >
                    Trocar Imagem
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Scan Error Alert -->
      @if (state.scanError(); as err) {
        <div class="p-4 rounded border border-[#7f1d1d] bg-[#1a0a0c] text-[#fca5a5] text-xs font-mono flex items-center justify-between shadow-lg">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5 text-[#ef4444] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>[ERRO] {{ err }}</span>
          </div>
          <button
            type="button"
            (click)="state.clearScan()"
            class="text-xs font-bold text-[#fca5a5] hover:underline cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      }
    </div>
  `
})
export class UploadZoneComponent implements OnDestroy {
  public readonly state = inject(ScannerStateService);
  private readonly http = inject(HttpClient);

  public readonly isDragging = signal<boolean>(false);
  public readonly currentScanMessage = signal<string>(
    'Analisando padrões anatômicos...'
  );

  private messageInterval: any = null;
  private readonly messages: string[] = [
    'Analisando padrões morfológicos e crista...',
    'Classificando espécie via rede neural MobileNetV3...',
    'Cruzando dados com o catálogo fóssil e paleobioma...',
    'Calculando taxa de fidelidade científica...',
  ];

  @HostListener('window:paste', ['$event'])
  public onWindowPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          this.state.setFile(file);
          this.startScan();
          break;
        }
      }
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.state.setFile(files[0]);
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.state.setFile(input.files[0]);
    }
  }

  public startScan(): void {
    this.startRotatingMessages();
    this.state.executeScan();
  }

  private startRotatingMessages(): void {
    this.stopRotatingMessages();
    let idx = 0;
    this.currentScanMessage.set(this.messages[0]);
    this.messageInterval = setInterval(() => {
      idx = (idx + 1) % this.messages.length;
      this.currentScanMessage.set(this.messages[idx]);
    }, 900);
  }

  private stopRotatingMessages(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
    }
  }

  public runInstantDemo(): void {
    this.state.loadDemoDinosaur('parasaurolophus');
  }

  public loadSamplePreset(slug: string): void {
    const portraitUrl = `/static/portraits/${slug.replace('-', '_')}.png`;

    this.http.get(portraitUrl, { responseType: 'blob' }).subscribe({
      next: blob => {
        const file = new File([blob], `${slug}.png`, { type: 'image/png' });
        this.state.setFile(file);
        this.startScan();
      },
      error: () => {
        // Fallback to instant demonstration logic if static blob fails
        this.state.loadDemoDinosaur(slug);
      },
    });
  }

  ngOnDestroy(): void {
    this.stopRotatingMessages();
  }
}

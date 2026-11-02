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
 * featuring tactical HUD corners, laser scanline animation, rotating analytical messages,
 * global clipboard paste (Ctrl+V) and instant demo scan presets.
 */
@Component({
  selector: 'app-upload-zone',
  standalone: true,
  template: `
    <div class="space-y-4">
      @if (!state.selectedFile()) {
        <!-- Tactical Scanner Visor / Drop Zone -->
        <div
          class="relative rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center cursor-pointer group bg-[#1e150f]/90 hover:bg-[#251a13]"
          [class]="isDragging()
            ? 'border-[#f4a261] bg-[#2a1d14] shadow-2xl shadow-amber-950/60 scale-[1.01]'
            : 'border-[#543b27] hover:border-[#f4a261]/80'"
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
          <!-- 4 Tactical Visor Corners -->
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
          <div class="mx-auto w-16 h-16 rounded-2xl bg-[#2e1d13] border border-[#5a3a22] flex items-center justify-center text-[#f4a261] group-hover:scale-105 group-hover:text-[#ffbe76] group-hover:border-[#e09f3e] transition-all duration-300 shadow-md">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
            </svg>
          </div>

          <h3 class="mt-4 text-lg sm:text-xl font-black text-[#fceddb] group-hover:text-[#f4a261] transition-colors">
            Solte aqui a captura do seu dinossauro
          </h3>

          <p class="text-xs sm:text-sm text-[#b8a490] mt-1.5 max-w-md mx-auto">
            Arraste um print, selecione um arquivo ou <strong class="text-[#f4a261]">cole direto com Ctrl+V</strong> (PNG, JPG, WEBP até 10MB)
          </p>

          <!-- Quick Test Presets & Instant Demo -->
          <div class="mt-6 pt-5 border-t border-[#3d2a1b] flex flex-wrap items-center justify-center gap-2" (click)="$event.stopPropagation()">
            <button
              type="button"
              (click)="runInstantDemo()"
              class="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-[#16110c] hover:brightness-110 transition-all cursor-pointer shadow-md hover:scale-[1.02]"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Escanear Exemplo (Demo)</span>
            </button>

            <span class="text-xs text-[#8a7563] px-1 font-medium hidden sm:inline">ou teste com espécie:</span>

            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Parasaurolophus Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('parasaurolophus')"
                class="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#2a1c12] hover:bg-[#382619] border border-[#4d3421] text-[#fceddb] transition-all cursor-pointer"
              >
                Parasaurolophus
              </button>

              <!-- Stegosaurus Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('stegosaurus')"
                class="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#2a1c12] hover:bg-[#382619] border border-[#4d3421] text-[#fceddb] transition-all cursor-pointer"
              >
                Stegosaurus
              </button>

              <!-- Triceratops Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('triceratops')"
                class="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#2a1c12] hover:bg-[#382619] border border-[#4d3421] text-[#fceddb] transition-all cursor-pointer"
              >
                Triceratops
              </button>

              <!-- T-Rex Preset -->
              <button
                type="button"
                (click)="loadSamplePreset('tyrannosaurus-rex')"
                class="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#2a1c12] hover:bg-[#382619] border border-[#4d3421] text-[#fceddb] transition-all cursor-pointer"
              >
                T-Rex
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Loaded File Preview Visor with Scanning Animation -->
        <div class="relative rounded-3xl border border-[#6b4c34] bg-[#1e150f] p-5 sm:p-6 shadow-2xl overflow-hidden">
          <i class="corner tl"></i>
          <i class="corner tr"></i>
          <i class="corner bl"></i>
          <i class="corner br"></i>

          <div class="flex flex-col sm:flex-row items-center gap-5">
            <!-- Image Frame with Sweep Scanline during processing -->
            <div class="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-[#140c07] border-2 border-[#543b27] overflow-hidden shrink-0 flex items-center justify-center p-2">
              @if (state.previewUrl(); as url) {
                <img
                  [src]="url"
                  alt="Pré-visualização do dinossauro"
                  class="w-full h-full object-contain rounded-xl"
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
                <span class="text-xs uppercase font-bold text-[#f4a261] tracking-wider">
                  {{ state.isScanning() ? 'Varredura em Andamento' : 'Captura Carregada' }}
                </span>
                <h4 class="text-lg font-black text-[#fceddb] truncate">
                  {{ state.selectedFile()?.name }}
                </h4>
                <p class="text-xs text-[#a89582] mt-0.5">
                  Tamanho: {{ ((state.selectedFile()?.size || 0) / (1024 * 1024)).toFixed(2) }} MB
                </p>
              </div>

              <!-- Animated Scan Messages -->
              @if (state.isScanning()) {
                <div class="p-3 rounded-xl bg-[#2a1a10] border border-[#4d321d] space-y-1.5">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#f4a261] animate-ping"></span>
                    <span class="text-xs font-mono font-bold text-[#f4a261]">
                      {{ currentScanMessage() }}
                    </span>
                  </div>
                  <div class="h-1.5 w-full bg-[#180e07] rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-[#d97706] to-[#52b788] animate-pulse w-full"></div>
                  </div>
                </div>
              }

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                @if (!state.isScanning()) {
                  <button
                    type="button"
                    (click)="startScan()"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-[#16110c] hover:brightness-110 transition-all cursor-pointer shadow-md"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                    </svg>
                    <span>Iniciar Identificação Fóssil</span>
                  </button>

                  <button
                    type="button"
                    (click)="state.clearScan()"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs text-[#dfd0be] bg-[#291b11] hover:bg-[#382518] border border-[#4d3421] transition-all cursor-pointer"
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
        <div class="p-4 rounded-2xl bg-[#3d1815] border border-[#7f261f] text-[#fca5a5] text-xs flex items-center justify-between shadow-lg">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5 text-[#ef4444] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ err }}</span>
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

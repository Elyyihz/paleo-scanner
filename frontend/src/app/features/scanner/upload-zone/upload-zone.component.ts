import { Component, computed, inject, signal } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

/**
 * Interactive drag-and-drop file upload zone for dinosaur screenshots.
 */
@Component({
  selector: 'app-upload-zone',
  standalone: true,
  template: `
    <div class="space-y-4">
      @if (!state.selectedFile()) {
        <!-- Drag & Drop Zone -->
        <div
          class="relative rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center cursor-pointer group"
          [class]="isDragging()
            ? 'border-cyan-400 bg-cyan-950/20 shadow-2xl shadow-cyan-950/50 scale-[1.01]'
            : 'border-slate-800 hover:border-cyan-500/60 bg-slate-900/40 hover:bg-slate-900/80'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
        >
          <input
            #fileInput
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            (change)="onFileSelected($event)"
          />

          <!-- Tech scanner reticle icon -->
          <div class="mx-auto w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M4 8V6a2 2 0 0 1 2-2h2"/>
              <path d="M4 16v2a2 2 0 0 0 2 2h2"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v2"/>
              <path d="M16 20h2a2 2 0 0 0 2-2v-2"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="m14.5 9.5-5 5"/>
            </svg>
          </div>

          <h3 class="mt-4 text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            Arraste uma captura de tela do Paleo Pines aqui
          </h3>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Ou clique para procurar em seus arquivos (PNG, JPG, WEBP até 10MB)
          </p>

          <!-- Quick Test Presets -->
          <div class="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-2" (click)="$event.stopPropagation()">
            <span class="text-xs text-slate-500">Sem print no momento? Teste com uma amostra:</span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="loadSamplePreset('tyrannosaurus-rex')"
                class="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-700/50 border border-slate-700 text-slate-300 transition-all"
              >
                🦖 T-Rex
              </button>
              <button
                type="button"
                (click)="loadSamplePreset('triceratops')"
                class="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-700/50 border border-slate-700 text-slate-300 transition-all"
              >
                🦏 Triceratops
              </button>
              <button
                type="button"
                (click)="loadSamplePreset('stegosaurus')"
                class="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-700/50 border border-slate-700 text-slate-300 transition-all"
              >
                🦕 Stegosaurus
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Loaded File Preview Card -->
        <div class="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- Image Preview with Scanner HUD border -->
            <div class="relative w-44 h-44 rounded-xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shrink-0 shadow-lg glow-cyan">
              <img
                [src]="state.previewUrl()"
                alt="Preview do dinossauro selecionado"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 scanline-overlay pointer-events-none opacity-40"></div>
              
              @if (state.isScanning()) {
                <!-- Laser scan animation effect -->
                <div class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce"></div>
              }
            </div>

            <!-- Meta details and Actions -->
            <div class="flex-1 w-full text-center sm:text-left space-y-3">
              <div>
                <span class="text-xs uppercase tracking-wider text-cyan-400 font-bold">Arquivo Pronto para Reconhecimento</span>
                <h4 class="text-lg font-bold text-white truncate max-w-md">
                  {{ state.selectedFile()?.name }}
                </h4>
                <p class="text-xs text-slate-400">
                  Tamanho: {{ formatFileSize(state.selectedFile()?.size || 0) }}
                </p>
              </div>

              <!-- Scan CTA button -->
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  (click)="state.executeScan()"
                  [disabled]="state.isScanning()"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 transition-all duration-200 shadow-lg shadow-cyan-950/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  @if (state.isScanning()) {
                    <svg class="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"/>
                    </svg>
                    <span>Identificando Espécie...</span>
                  } @else {
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m10 15 5-3-5-3v6z"/>
                    </svg>
                    <span>Escanear com IA</span>
                  }
                </button>

                <button
                  type="button"
                  (click)="state.clearScan()"
                  [disabled]="state.isScanning()"
                  class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  Trocar Imagem
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Error Toast Notification -->
      @if (state.scanError(); as errorMsg) {
        <div class="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3 shadow-lg">
          <svg class="w-5 h-5 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span class="flex-1">{{ errorMsg }}</span>
          <button type="button" (click)="state.scanError.set(null)" class="text-rose-400 hover:text-white">✕</button>
        </div>
      }
    </div>
  `
})
export class UploadZoneComponent {
  public readonly state = inject(ScannerStateService);
  private readonly http = inject(HttpClient);

  public readonly isDragging = signal<boolean>(false);

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

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.state.selectFile(file);
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.state.selectFile(input.files[0]);
    }
  }

  /**
   * Helper that downloads a sample portrait and creates a File instance to test.
   *
   * @param slug - Dinosaur slug identifier.
   */
  public loadSamplePreset(slug: string): void {
    const sampleUrl = `${environment.staticBaseUrl}/static/portraits/${slug}.png`;
    this.http.get(sampleUrl, { responseType: 'blob' }).subscribe({
      next: blob => {
        const file = new File([blob], `${slug}.png`, { type: 'image/png' });
        this.state.selectFile(file);
      },
      error: () => {
        // Fallback: create mock dummy file for testing
        const file = new File(['mock'], `${slug}.png`, { type: 'image/png' });
        this.state.selectFile(file);
      }
    });
  }

  public formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }
}

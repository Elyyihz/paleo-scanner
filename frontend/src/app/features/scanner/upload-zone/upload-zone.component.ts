import { Component, inject, signal } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

/**
 * Interactive drag-and-drop file upload zone for dinosaur screenshots
 * styled with warm earthy ranch & naturalist workbench aesthetics.
 */
@Component({
  selector: 'app-upload-zone',
  standalone: true,
  template: `
    <div class="space-y-4">
      @if (!state.selectedFile()) {
        <!-- Drag & Drop Zone -->
        <div
          class="relative rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center cursor-pointer group"
          [class]="isDragging()
            ? 'border-[#f4a261] bg-[#2e2116] shadow-2xl shadow-amber-950/60 scale-[1.01]'
            : 'border-[#543d2c] hover:border-[#f4a261]/80 bg-[#221811]/70 hover:bg-[#281d14]'"
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

          <!-- Naturalist Explorer Badge Icon -->
          <div class="mx-auto w-16 h-16 rounded-2xl bg-[#322317] border border-[#5a402a] flex items-center justify-center text-[#f4a261] group-hover:scale-110 group-hover:text-[#ffbe76] group-hover:border-[#e09f3e] transition-all duration-300 shadow-md">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
              <path d="M11 7v8"/>
              <path d="M7 11h8"/>
            </svg>
          </div>

          <h3 class="mt-4 text-lg sm:text-xl font-black text-[#fceddb] group-hover:text-[#f4a261] transition-colors">
            Arraste sua captura de tela do Paleo Pines aqui
          </h3>
          <p class="text-xs sm:text-sm text-[#b8a490] mt-1 max-w-md mx-auto">
            Ou clique para escolher do seu computador (PNG, JPG, WEBP até 10MB)
          </p>

          <!-- Quick Test Presets -->
          <div class="mt-6 pt-5 border-t border-[#443122] flex flex-col sm:flex-row items-center justify-center gap-2.5" (click)="$event.stopPropagation()">
            <span class="text-xs text-[#a38e7c] font-medium">Sem print no momento? Teste com um dinossauro:</span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="loadSamplePreset('tyrannosaurus-rex')"
                class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#342417] hover:bg-[#4a3321] hover:text-[#fceddb] border border-[#5e412b] text-[#dfd0be] transition-all cursor-pointer shadow-sm"
              >
                🦖 T-Rex
              </button>
              <button
                type="button"
                (click)="loadSamplePreset('triceratops')"
                class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#342417] hover:bg-[#4a3321] hover:text-[#fceddb] border border-[#5e412b] text-[#dfd0be] transition-all cursor-pointer shadow-sm"
              >
                🦏 Triceratops
              </button>
              <button
                type="button"
                (click)="loadSamplePreset('stegosaurus')"
                class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#342417] hover:bg-[#4a3321] hover:text-[#fceddb] border border-[#5e412b] text-[#dfd0be] transition-all cursor-pointer shadow-sm"
              >
                🦕 Stegosaurus
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Loaded File Preview Card -->
        <div class="rounded-3xl border border-[#573f2c] bg-[#221811] p-5 sm:p-7 shadow-xl">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- Image Preview in wooden frame -->
            <div class="relative w-44 h-44 rounded-2xl overflow-hidden border-3 border-[#8c5836] bg-[#17100b] shrink-0 shadow-lg glow-wood">
              <img
                [src]="state.previewUrl()"
                alt="Preview do dinossauro selecionado"
                class="w-full h-full object-cover"
              />
              
              @if (state.isScanning()) {
                <!-- Subtle warm scanning sweep -->
                <div class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#f4a261] to-transparent shadow-[0_0_15px_#f4a261] animate-bounce"></div>
              }
            </div>

            <!-- Meta details and Actions -->
            <div class="flex-1 w-full text-center sm:text-left space-y-3.5">
              <div>
                <span class="text-xs uppercase tracking-wider text-[#f4a261] font-bold">
                  Imagem Carregada para Análise
                </span>
                <h4 class="text-xl font-bold text-[#fceddb] truncate max-w-md">
                  {{ state.selectedFile()?.name }}
                </h4>
                <p class="text-xs text-[#a89582]">
                  Tamanho: {{ formatFileSize(state.selectedFile()?.size || 0) }}
                </p>
              </div>

              <!-- Scan CTA button -->
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  (click)="state.executeScan()"
                  [disabled]="state.isScanning()"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-amber-50 bg-gradient-to-r from-[#d97706] via-[#b45309] to-[#92400e] hover:brightness-110 transition-all duration-200 shadow-lg shadow-amber-950/70 border border-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  @if (state.isScanning()) {
                    <svg class="w-4 h-4 animate-spin text-amber-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"/>
                    </svg>
                    <span>Identificando Espécie...</span>
                  } @else {
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                    <span>Identificar Dinossauro</span>
                  }
                </button>

                <button
                  type="button"
                  (click)="state.clearScan()"
                  [disabled]="state.isScanning()"
                  class="px-4 py-3 rounded-2xl text-xs font-bold text-[#c9b7a5] hover:text-[#fceddb] bg-[#322317] hover:bg-[#3f2c1d] border border-[#573f2c] transition-all cursor-pointer disabled:opacity-50"
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
        <div class="p-4 rounded-2xl bg-[#3f1917] border border-[#822a21] text-[#fca5a5] text-xs flex items-center gap-3 shadow-lg">
          <svg class="w-5 h-5 text-[#ef4444] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span class="flex-1 font-medium">{{ errorMsg }}</span>
          <button type="button" (click)="state.scanError.set(null)" class="text-[#fca5a5] hover:text-white font-bold">✕</button>
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

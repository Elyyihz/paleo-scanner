import { Component } from '@angular/core';

/**
 * Global footer showing project provenance and educational disclaimers.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-20 border-t border-[#174463] bg-[#071927] py-8 text-xs text-[#94a3b8]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="Paleo Pines" class="h-8 w-auto object-contain opacity-85" />
          <div>
            <span class="font-bold text-[#f8fafc]">Paleo-Scanner</span>
            <span class="text-[#94a3b8]"> — Do Rancho de Paleo Pines aos Museus de Paleontologia.</span>
          </div>
        </div>

        <div class="text-center sm:text-right space-y-1">
          <p>Projeto educacional de fã. Paleo Pines © Italic Pig & Modus Games.</p>
          <p class="text-[11px] text-[#64748b]">
            Construído com Angular 22 (Signals & Standalone) · Tailwind CSS · FastAPI · TensorFlow/Keras MobileNetV3
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}

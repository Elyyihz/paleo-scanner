import { Component } from '@angular/core';

/**
 * Global footer showing project provenance and educational disclaimers.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-20 border-t border-slate-800/80 bg-[#060a14] py-8 text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-300">🦖 Paleo-Scanner</span>
          <span>— Explorando a biologia pré-histórica entre ficção e ciência.</span>
        </div>

        <div class="text-center sm:text-right">
          <p>Projeto educacional open-source. Paleo Pines © Italic Pig & Modus Games.</p>
          <p class="text-[11px] text-slate-600 mt-0.5">
            Stack: Angular 22 (Signals & Standalone) · Tailwind CSS · FastAPI · TensorFlow/Keras MobileNetV3
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}

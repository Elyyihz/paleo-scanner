import { Component } from '@angular/core';

/**
 * Global footer showing project provenance and educational disclaimers.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-20 border-t border-[#3d2d20] bg-[#140e0a] py-10 text-xs text-[#a89582]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="Paleo Pines" class="h-8 w-auto object-contain opacity-80" />
          <div>
            <span class="font-bold text-[#fceddb]">Paleo-Scanner</span>
            <span class="text-[#a89582]"> — Do Rancho de Paleo Pines aos Museus de Paleontologia.</span>
          </div>
        </div>

        <div class="text-center sm:text-right space-y-1">
          <p>Projeto educacional de fã. Paleo Pines © Italic Pig & Modus Games.</p>
          <p class="text-[11px] text-[#7d6b5b]">
            Construído com Angular 22 (Signals & Standalone) · Tailwind CSS · FastAPI · TensorFlow/Keras MobileNetV3
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}

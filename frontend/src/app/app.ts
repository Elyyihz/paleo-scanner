import { Component, inject } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ScannerContainerComponent } from './features/scanner/scanner-container.component';
import { CatalogContainerComponent } from './features/catalog/catalog-container.component';
import { ScannerStateService } from './core/services/scanner-state.service';

/**
 * Root application component managing layout and main view routing.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ScannerContainerComponent,
    CatalogContainerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public readonly state = inject(ScannerStateService);
}

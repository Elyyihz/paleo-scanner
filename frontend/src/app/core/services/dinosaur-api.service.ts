import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dinosaur, HealthStatus, ScanResponse } from '../models/dinosaur.model';

/**
 * Gateway service communicating with the Paleo-Scanner FastAPI backend.
 */
@Injectable({
  providedIn: 'root'
})
export class DinosaurApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly staticBaseUrl = environment.staticBaseUrl;

  /**
   * Pings the API health check endpoint.
   *
   * @returns Observable resolving to the service status payload.
   */
  public checkHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${this.baseUrl}/health`);
  }

  /**
   * Fetches the full species catalog with optional filters.
   *
   * @param biome - Optional biome filter ('Valley', 'Forest', 'Desert').
   * @param diet - Optional diet filter ('Herbivore', 'Carnivore', 'Omnivore').
   * @returns Observable emitting the list of matched dinosaur species.
   */
  public listDinosaurs(biome?: string, diet?: string): Observable<Dinosaur[]> {
    let params = new HttpParams();
    if (biome && biome !== 'all') {
      params = params.set('biome', biome);
    }
    if (diet && diet !== 'all') {
      params = params.set('diet', diet);
    }
    return this.http.get<Dinosaur[]>(`${this.baseUrl}/dinosaurs`, { params });
  }

  /**
   * Retrieves single species detail by slug.
   *
   * @param slug - Unique URL slug for the dinosaur.
   * @returns Observable emitting the requested dinosaur entity.
   */
  public getDinosaur(slug: string): Observable<Dinosaur> {
    return this.http.get<Dinosaur>(`${this.baseUrl}/dinosaurs/${encodeURIComponent(slug)}`);
  }

  /**
   * Submits an image binary to the classification and comparison pipeline.
   *
   * @param imageFile - Screenshot or photograph of the dinosaur.
   * @returns Observable emitting the prediction, profile, and comparison report.
   */
  public scanDinosaur(imageFile: File): Observable<ScanResponse> {
    const formData = new FormData();
    formData.append('file', imageFile, imageFile.name);
    return this.http.post<ScanResponse>(`${this.baseUrl}/scan`, formData);
  }

  /**
   * Converts relative portrait path to an absolute accessible URL.
   *
   * @param relativeUrl - Portrait path returned by the backend.
   * @returns Normalized URL string pointing to the backend static file server.
   */
  public getPortraitUrl(relativeUrl: string): string {
    if (!relativeUrl) {
      return '';
    }
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    return `${this.staticBaseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
  }
}

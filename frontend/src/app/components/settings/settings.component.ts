import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule
  ],
  template: `
    <div class="settings-container">
      <header class="page-header">
        <h1>Settings</h1>
        <p class="subheader">Configure your account and privacy preferences</p>
      </header>
      
      <div class="settings-grid">
        <!-- API Keys and Connections -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>API Keys & Connections</mat-card-title>
            <mat-card-subtitle>Manage your decentralized storage and zkML connections</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="apiKeysForm" (ngSubmit)="saveApiKeys()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Lighthouse API Key</mat-label>
                <input matInput formControlName="lighthouseKey" type="password">
                <mat-icon matSuffix>storage</mat-icon>
                <mat-hint>Used for decentralized storage on Lighthouse</mat-hint>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Lilypad API Key</mat-label>
                <input matInput formControlName="lilypadKey" type="password">
                <mat-icon matSuffix>security</mat-icon>
                <mat-hint>Required for zero-knowledge machine learning</mat-hint>
              </mat-form-field>
              
              <div class="connection-status">
                <h3>Connection Status</h3>
                <mat-list>
                  <mat-list-item>
                    <div class="status-item">
                      <span>Lighthouse Storage</span>
                      <span class="status-badge" [class.active]="lighthouseConnected" [class.inactive]="!lighthouseConnected">
                        {{lighthouseConnected ? 'Connected' : 'Disconnected'}}
                      </span>
                    </div>
                  </mat-list-item>
                  
                  <mat-list-item>
                    <div class="status-item">
                      <span>Filecoin Network</span>
                      <span class="status-badge" [class.active]="filecoinConnected" [class.inactive]="!filecoinConnected">
                        {{filecoinConnected ? 'Connected' : 'Disconnected'}}
                      </span>
                    </div>
                  </mat-list-item>
                  
                  <mat-list-item>
                    <div class="status-item">
                      <span>Lilypad zkML</span>
                      <span class="status-badge" [class.active]="lilypadConnected" [class.inactive]="!lilypadConnected">
                        {{lilypadConnected ? 'Connected' : 'Disconnected'}}
                      </span>
                    </div>
                  </mat-list-item>
                </mat-list>
              </div>
              
              <div class="form-actions">
                <button mat-button type="button" color="warn" (click)="resetApiKeys()">Reset</button>
                <button mat-raised-button color="primary" type="submit">Save API Keys</button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
        
        <!-- Privacy Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>Privacy Settings</mat-card-title>
            <mat-card-subtitle>Control your data privacy and encryption</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="privacyForm">
              <div class="privacy-settings">
                <div class="privacy-setting">
                  <div class="setting-info">
                    <h3>Zero-Knowledge Proofs</h3>
                    <p>Enable zkML for all financial analysis</p>
                  </div>
                  <mat-slide-toggle formControlName="zkProofs" color="primary"></mat-slide-toggle>
                </div>
                
                <mat-divider></mat-divider>
                
                <div class="privacy-setting">
                  <div class="setting-info">
                    <h3>Local Encryption</h3>
                    <p>Encrypt all data locally before storing</p>
                  </div>
                  <mat-slide-toggle formControlName="localEncryption" color="primary"></mat-slide-toggle>
                </div>
                
                <mat-divider></mat-divider>
                
                <div class="privacy-setting">
                  <div class="setting-info">
                    <h3>Decentralized Storage</h3>
                    <p>Store encrypted data on Lighthouse/Filecoin</p>
                  </div>
                  <mat-slide-toggle formControlName="decentralizedStorage" color="primary"></mat-slide-toggle>
                </div>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Encryption Strength</mat-label>
                <mat-select formControlName="encryptionStrength">
                  <mat-option value="standard">Standard (AES-128)</mat-option>
                  <mat-option value="high">High (AES-256)</mat-option>
                  <mat-option value="maximum">Maximum (AES-256 + Argon2)</mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="form-actions">
                <button mat-raised-button color="primary" (click)="savePrivacySettings()">Save Privacy Settings</button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      margin-bottom: 2rem;
    }
    
    .page-header h1 {
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }
    
    .subheader {
      color: var(--text-medium);
      font-size: 1.1rem;
      margin-top: 0;
    }
    
    /* Settings Grid */
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .settings-card {
      border-radius: 10px;
      margin-bottom: 1.5rem;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    /* Connection Status */
    .connection-status {
      margin: 1.5rem 0;
    }
    
    .connection-status h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: var(--primary-dark);
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    .status-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
    }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .status-badge.active {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success-color);
    }
    
    .status-badge.inactive {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
    }
    
    /* Privacy Settings */
    .privacy-settings {
      margin-bottom: 1.5rem;
    }
    
    .privacy-setting {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    
    .setting-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 500;
    }
    
    .setting-info p {
      margin: 0;
      color: var(--text-medium);
      font-size: 0.9rem;
    }
    
    /* Responsive design */
    @media (max-width: 991px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  // API Keys form
  apiKeysForm: FormGroup;
  lighthouseConnected = true;
  filecoinConnected = true;
  lilypadConnected = true;
  
  // Privacy settings form
  privacyForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.apiKeysForm = this.fb.group({
      lighthouseKey: ['89d6a3b7e54c120f3a4d', Validators.required],
      lilypadKey: ['7c529fdb8e31a03d4b2e', Validators.required]
    });
    
    this.privacyForm = this.fb.group({
      zkProofs: [true],
      localEncryption: [true],
      decentralizedStorage: [true],
      encryptionStrength: ['high']
    });
  }
  
  ngOnInit(): void {
    // In a real implementation, we would fetch settings from a service
  }
  
  saveApiKeys(): void {
    console.log('API Keys saved:', this.apiKeysForm.value);
    // Here we would actually save the API keys and verify connections
  }
  
  resetApiKeys(): void {
    this.apiKeysForm.reset({
      lighthouseKey: '',
      lilypadKey: ''
    });
  }
  
  savePrivacySettings(): void {
    console.log('Privacy settings saved:', this.privacyForm.value);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title">FinSecure</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button>
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button>
          <mat-icon>account_circle</mat-icon>
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="app-sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="app-sidenav">
          <div class="sidenav-header">
            <div class="app-logo">
              <mat-icon class="logo-icon">security</mat-icon>
              <span class="logo-text">FinSecure</span>
            </div>
            <div class="app-tagline">
              Zero-Knowledge Finance
            </div>
          </div>
          
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/transactions" routerLinkActive="active">
              <mat-icon matListItemIcon>receipt_long</mat-icon>
              <span matListItemTitle>Transactions</span>
            </a>
            <a mat-list-item routerLink="/budget" routerLinkActive="active">
              <mat-icon matListItemIcon>account_balance_wallet</mat-icon>
              <span matListItemTitle>Budget</span>
            </a>
            <a mat-list-item routerLink="/analysis" routerLinkActive="active">
              <mat-icon matListItemIcon>insights</mat-icon>
              <span matListItemTitle>Analysis</span>
            </a>
            <a mat-list-item routerLink="/settings" routerLinkActive="active">
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle>Settings</span>
            </a>
          </mat-nav-list>
          
          <div class="privacy-badge">
            <mat-icon>verified</mat-icon>
            <span>zkML Powered</span>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="app-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #5E35B1;
      --primary-dark: #4527A0;
      --primary-light: #9575CD;
      --secondary-color: #1E88E5;
      --secondary-dark: #1565C0;
      --secondary-light: #64B5F6;
      --success-color: #4CAF50;
      --error-color: #F44336;
      --warning-color: #FF9800;
      --info-color: #2196F3;
      --text-light: #FFFFFF;
      --text-dark: #212121;
      --text-medium: #757575;
      --background-light: #F5F5F5;
      --border-light: #E0E0E0;
      
      display: block;
      height: 100%;
    }
    
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .app-toolbar {
      background-color: var(--primary-color);
      color: var(--text-light);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }
    
    .app-title {
      font-size: 1.25rem;
      font-weight: 500;
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .app-sidenav-container {
      flex: 1;
      margin-top: 64px; /* Toolbar height */
    }
    
    .app-sidenav {
      width: 250px;
      background-color: var(--text-light);
      border-right: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
    }
    
    .sidenav-header {
      padding: 24px 16px;
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 8px;
    }
    
    .app-logo {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .logo-icon {
      color: var(--primary-color);
      margin-right: 8px;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .app-tagline {
      font-size: 0.875rem;
      color: var(--text-medium);
    }
    
    mat-nav-list {
      padding-top: 0;
    }
    
    .mat-list-item {
      margin: 4px 8px;
      border-radius: 4px;
    }
    
    .active {
      background-color: rgba(94, 53, 177, 0.1) !important;
      color: var(--primary-color) !important;
    }
    
    .active .mat-icon {
      color: var(--primary-color) !important;
    }
    
    .app-content {
      padding: 24px;
      background-color: var(--background-light);
    }
    
    .privacy-badge {
      margin-top: auto;
      padding: 16px;
      background-color: rgba(94, 53, 177, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    @media (max-width: 600px) {
      .app-sidenav-container {
        margin-top: 56px; /* Mobile toolbar height */
      }
    }
  `]
})
export class AppComponent {
  title = 'FinSecure';
}
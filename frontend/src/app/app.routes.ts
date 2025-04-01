import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - FinSecure'
  },
  {
    path: 'transactions',
    loadComponent: () => import('./components/transactions/transactions.component').then(m => m.TransactionsComponent),
    title: 'Transactions - FinSecure'
  },
  {
    path: 'budget',
    loadComponent: () => import('./components/budget/budget.component').then(m => m.BudgetComponent),
    title: 'Budget - FinSecure'
  },
  {
    path: 'analysis',
    loadComponent: () => import('./components/analysis/analysis.component').then(m => m.AnalysisComponent),
    title: 'Analysis - FinSecure'
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Settings - FinSecure'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
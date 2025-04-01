import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    NgChartsModule
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Financial Dashboard</h1>
        <p class="tagline">Secure financial insights powered by zkML</p>
      </header>
      
      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card class="summary-card income">
          <div class="card-content">
            <div class="card-icon">
              <mat-icon>arrow_upward</mat-icon>
            </div>
            <div class="card-details">
              <h3>Total Income</h3>
              <div class="amount">${{totalIncome | number:'1.2-2'}}</div>
            </div>
          </div>
        </mat-card>
        
        <mat-card class="summary-card expenses">
          <div class="card-content">
            <div class="card-icon">
              <mat-icon>arrow_downward</mat-icon>
            </div>
            <div class="card-details">
              <h3>Total Expenses</h3>
              <div class="amount">${{totalExpenses | number:'1.2-2'}}</div>
            </div>
          </div>
        </mat-card>
        
        <mat-card class="summary-card balance">
          <div class="card-content">
            <div class="card-icon">
              <mat-icon>account_balance</mat-icon>
            </div>
            <div class="card-details">
              <h3>Balance</h3>
              <div class="amount">${{balance | number:'1.2-2'}}</div>
            </div>
          </div>
        </mat-card>
        
        <mat-card class="summary-card savings">
          <div class="card-content">
            <div class="card-icon">
              <mat-icon>savings</mat-icon>
            </div>
            <div class="card-details">
              <h3>Savings Rate</h3>
              <div class="amount">{{savingsRate | percent:'1.1-1'}}</div>
            </div>
          </div>
        </mat-card>
      </div>
      
      <!-- Charts -->
      <div class="dashboard-charts">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Income vs Expenses</mat-card-title>
            <mat-card-subtitle>Monthly comparison (Last 6 months)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="chart-content">
            <div class="chart-container">
              <canvas baseChart
                [data]="incomeVsExpensesData"
                [options]="barChartOptions"
                [type]="'bar'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Spending by Category</mat-card-title>
            <mat-card-subtitle>Current month breakdown</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="chart-content">
            <div class="chart-container">
              <canvas baseChart
                [data]="spendingByCategoryData"
                [options]="pieChartOptions"
                [type]="'doughnut'">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Recent Transactions -->
      <mat-card class="transactions-card">
        <mat-card-header>
          <mat-card-title>Recent Transactions</mat-card-title>
          <mat-card-subtitle>Your latest financial activities</mat-card-subtitle>
          <div class="header-actions">
            <button mat-button color="primary" routerLink="/transactions">
              View All
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="recentTransactions" class="transactions-table">
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.date | date:'MMM d'}}</td>
            </ng-container>
            
            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.description}}</td>
            </ng-container>
            
            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let transaction">
                <span class="category-chip" [style.background-color]="getCategoryColor(transaction.category, 0.1)" 
                      [style.color]="getCategoryColor(transaction.category, 1)">
                  {{transaction.category}}
                </span>
              </td>
            </ng-container>
            
            <!-- Amount Column -->
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let transaction" 
                  [ngClass]="transaction.amount > 0 ? 'positive-amount' : 'negative-amount'">
                {{transaction.amount | currency}}
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
      
      <!-- Privacy Info Card -->
      <mat-card class="privacy-card">
        <div class="privacy-content">
          <div class="privacy-icon">
            <mat-icon>security</mat-icon>
          </div>
          <div class="privacy-text">
            <h3>Your Financial Data is Private</h3>
            <p>
              All financial analysis is performed using zero-knowledge machine learning.
              Your data never leaves your control, while still providing powerful insights.
            </p>
          </div>
          <button mat-button color="primary" routerLink="/analysis">
            Learn More
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
    }
    
    .dashboard-header h1 {
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }
    
    .tagline {
      color: var(--text-medium);
      font-size: 1.1rem;
      margin-top: 0;
    }
    
    /* Summary Cards */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .summary-card {
      border-radius: 10px;
      padding: 0.5rem;
    }
    
    .summary-card.income {
      border-left: 4px solid var(--success-color);
    }
    
    .summary-card.expenses {
      border-left: 4px solid var(--error-color);
    }
    
    .summary-card.balance {
      border-left: 4px solid var(--primary-color);
    }
    
    .summary-card.savings {
      border-left: 4px solid var(--info-color);
    }
    
    .card-content {
      display: flex;
      align-items: center;
      padding: 1rem;
    }
    
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 1rem;
    }
    
    .income .card-icon {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success-color);
    }
    
    .expenses .card-icon {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
    }
    
    .balance .card-icon {
      background-color: rgba(94, 53, 177, 0.1);
      color: var(--primary-color);
    }
    
    .savings .card-icon {
      background-color: rgba(30, 136, 229, 0.1);
      color: var(--info-color);
    }
    
    .card-details {
      flex: 1;
    }
    
    .card-details h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-medium);
    }
    
    .amount {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-dark);
    }
    
    .income .amount {
      color: var(--success-color);
    }
    
    .expenses .amount {
      color: var(--error-color);
    }
    
    .balance .amount {
      color: var(--primary-color);
    }
    
    .savings .amount {
      color: var(--info-color);
    }
    
    /* Dashboard Charts */
    .dashboard-charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .chart-card {
      border-radius: 10px;
    }
    
    .chart-content {
      padding: 1rem;
    }
    
    .chart-container {
      height: 300px;
      position: relative;
    }
    
    /* Transactions Card */
    .transactions-card {
      margin-bottom: 2rem;
      border-radius: 10px;
    }
    
    .header-actions {
      margin-left: auto;
    }
    
    .transactions-table {
      width: 100%;
    }
    
    .category-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
    }
    
    .positive-amount {
      color: var(--success-color);
      font-weight: 500;
    }
    
    .negative-amount {
      color: var(--error-color);
      font-weight: 500;
    }
    
    /* Privacy Card */
    .privacy-card {
      border-radius: 10px;
      background-color: rgba(94, 53, 177, 0.05);
      border-left: 4px solid var(--primary-color);
    }
    
    .privacy-content {
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }
    
    .privacy-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background-color: rgba(94, 53, 177, 0.1);
      border-radius: 50%;
      margin-right: 1.5rem;
      color: var(--primary-color);
    }
    
    .privacy-text {
      flex: 1;
    }
    
    .privacy-text h3 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
    }
    
    .privacy-text p {
      margin: 0;
      color: var(--text-medium);
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    /* Responsive design */
    @media (max-width: 991px) {
      .summary-cards {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .dashboard-charts {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 767px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .privacy-content {
        flex-direction: column;
        text-align: center;
      }
      
      .privacy-icon {
        margin-right: 0;
        margin-bottom: 1rem;
      }
      
      .privacy-text {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  // Financial summary data
  totalIncome: number = 4325.75;
  totalExpenses: number = 2841.33;
  balance: number = this.totalIncome - this.totalExpenses;
  savingsRate: number = (this.balance / this.totalIncome);
  
  // Transactions table
  displayedColumns: string[] = ['date', 'description', 'category', 'amount'];
  recentTransactions = [
    {
      date: new Date('2023-03-15'),
      description: 'Salary Deposit',
      category: 'Income',
      amount: 3500.00
    },
    {
      date: new Date('2023-03-14'),
      description: 'Grocery Store',
      category: 'Food',
      amount: -127.53
    },
    {
      date: new Date('2023-03-12'),
      description: 'Electric Bill',
      category: 'Utilities',
      amount: -95.40
    },
    {
      date: new Date('2023-03-10'),
      description: 'Freelance Work',
      category: 'Income',
      amount: 825.75
    },
    {
      date: new Date('2023-03-08'),
      description: 'Restaurant',
      category: 'Food',
      amount: -68.25
    }
  ];
  
  // Charts data
  incomeVsExpensesData = {
    labels: ['October', 'November', 'December', 'January', 'February', 'March'],
    datasets: [
      {
        label: 'Income',
        data: [3800, 4100, 4500, 3900, 4200, 4325],
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1
      },
      {
        label: 'Expenses',
        data: [2500, 2700, 3100, 2600, 2750, 2841],
        backgroundColor: 'rgba(244, 67, 54, 0.7)',
        borderColor: 'rgba(244, 67, 54, 1)',
        borderWidth: 1
      }
    ]
  };
  
  spendingByCategoryData = {
    labels: ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping'],
    datasets: [
      {
        data: [1200, 520, 350, 280, 215, 276],
        backgroundColor: [
          'rgba(94, 53, 177, 0.7)',   // Primary (Violet)
          'rgba(255, 152, 0, 0.7)',   // Orange
          'rgba(30, 136, 229, 0.7)',  // Secondary (Azure)
          'rgba(76, 175, 80, 0.7)',   // Green
          'rgba(156, 39, 176, 0.7)',  // Purple
          'rgba(233, 30, 99, 0.7)'    // Pink
        ],
        borderColor: [
          'rgba(94, 53, 177, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(30, 136, 229, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(156, 39, 176, 1)',
          'rgba(233, 30, 99, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          }
        }
      }
    }
  };
  
  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      }
    }
  };
  
  constructor() { }
  
  ngOnInit(): void {
    // In a real implementation, we would fetch data from a service
  }
  
  getCategoryColor(category: string, opacity: number): string {
    const colors: { [key: string]: string } = {
      'Income': '#4CAF50',
      'Housing': '#5E35B1',
      'Food': '#FB8C00',
      'Transportation': '#1E88E5',
      'Utilities': '#43A047',
      'Entertainment': '#9C27B0',
      'Shopping': '#E91E63'
    };
    
    const color = colors[category] || '#5E35B1';
    
    if (opacity === 1) return color;
    
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
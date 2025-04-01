import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule,
    MatMenuModule
  ],
  template: `
    <div class="transactions-container">
      <header class="page-header">
        <h1>Transactions</h1>
        <p class="subheader">Manage and view your financial transactions</p>
      </header>
      
      <!-- Add Transaction -->
      <mat-card class="add-transaction-card">
        <mat-card-header>
          <mat-card-title>Add New Transaction</mat-card-title>
          <mat-card-subtitle>All transaction data is encrypted with zkML</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="transactionForm.get('date')?.invalid">Date is required</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <input matInput formControlName="description" placeholder="e.g. Grocery Shopping">
                <mat-error *ngIf="transactionForm.get('description')?.invalid">Description is required</mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Amount</mat-label>
                <input matInput type="number" formControlName="amount" placeholder="Use negative for expenses">
                <span matTextPrefix>$&nbsp;</span>
                <mat-error *ngIf="transactionForm.get('amount')?.invalid">
                  Valid amount is required
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category">
                  <mat-option *ngFor="let category of categories" [value]="category">
                    {{category}}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="transactionForm.get('category')?.invalid">
                  Category is required
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-button type="button" (click)="resetForm()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="transactionForm.invalid">
                <mat-icon>add</mat-icon> Add Transaction
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Transactions List -->
      <mat-card class="transactions-list-card">
        <mat-card-header>
          <mat-card-title>All Transactions</mat-card-title>
          <div class="card-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search transactions">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <button mat-icon-button [matMenuTriggerFor]="filterMenu" aria-label="Filter">
              <mat-icon>filter_list</mat-icon>
            </button>
            <mat-menu #filterMenu="matMenu">
              <button mat-menu-item (click)="filterTransactions('all')">All Transactions</button>
              <button mat-menu-item (click)="filterTransactions('income')">Income Only</button>
              <button mat-menu-item (click)="filterTransactions('expense')">Expenses Only</button>
              <mat-divider></mat-divider>
              <button mat-menu-item [matMenuTriggerFor]="categoryMenu">Filter by Category</button>
            </mat-menu>
            <mat-menu #categoryMenu="matMenu">
              <button mat-menu-item *ngFor="let category of categories" (click)="filterByCategory(category)">
                {{category}}
              </button>
            </mat-menu>
            
            <button mat-icon-button (click)="exportTransactions()" aria-label="Export">
              <mat-icon>download</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content class="table-container">
          <table mat-table [dataSource]="transactions" class="transactions-table" matSort>
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
              <td mat-cell *matCellDef="let transaction"> {{transaction.date | date:'MMM d, y'}} </td>
            </ng-container>
            
            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Description </th>
              <td mat-cell *matCellDef="let transaction"> {{transaction.description}} </td>
            </ng-container>
            
            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Category </th>
              <td mat-cell *matCellDef="let transaction">
                <span class="category-chip" [style.background-color]="getCategoryColor(transaction.category, 0.1)" 
                      [style.color]="getCategoryColor(transaction.category, 1)">
                  {{transaction.category}}
                </span>
              </td>
            </ng-container>
            
            <!-- Amount Column -->
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Amount </th>
              <td mat-cell *matCellDef="let transaction" 
                  [ngClass]="transaction.amount > 0 ? 'positive-amount' : 'negative-amount'">
                {{transaction.amount | currency}}
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let transaction; let i = index">
                <button mat-icon-button color="primary" (click)="editTransaction(i)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTransaction(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <!-- No Data Row -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="5">No transactions found matching filter</td>
            </tr>
          </table>
          
          <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
      
      <!-- Upload/Import Section -->
      <mat-card class="import-card">
        <mat-card-header>
          <mat-card-title>Import Transactions</mat-card-title>
          <mat-card-subtitle>Upload CSV or connect to your bank</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="import-actions">
            <button mat-raised-button color="accent">
              <mat-icon>upload_file</mat-icon>
              Upload CSV
            </button>
            
            <button mat-raised-button color="primary">
              <mat-icon>account_balance</mat-icon>
              Connect Bank Account
            </button>
            
            <mat-chip-set>
              <mat-chip>AES Encryption</mat-chip>
              <mat-chip>zkML Privacy</mat-chip>
              <mat-chip>Decentralized Storage</mat-chip>
            </mat-chip-set>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="privacy-message">
            <mat-icon color="primary">security</mat-icon>
            <p>
              All your transactions are encrypted before processing, and analyzed using zero-knowledge machine learning.
              This ensures privacy while getting powerful financial insights.
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .transactions-container {
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
    
    /* Add Transaction Card */
    .add-transaction-card {
      margin-bottom: 2rem;
      border-radius: 10px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }
    
    .form-row mat-form-field {
      flex: 1;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
    
    /* Transactions List Card */
    .transactions-list-card {
      margin-bottom: 2rem;
      border-radius: 10px;
    }
    
    .card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
    
    .search-field {
      width: 240px;
      margin-bottom: -20px;
    }
    
    .table-container {
      position: relative;
      overflow: auto;
      min-height: 400px;
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
    
    /* Import Card */
    .import-card {
      border-radius: 10px;
    }
    
    .import-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .import-actions mat-chip-set {
      margin-left: auto;
    }
    
    .privacy-message {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 16px;
      padding: 16px;
      background-color: rgba(94, 53, 177, 0.05);
      border-radius: 8px;
    }
    
    .privacy-message p {
      margin: 0;
      color: var(--text-medium);
      font-size: 0.9rem;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .import-actions {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .import-actions mat-chip-set {
        margin-left: 0;
        margin-top: 16px;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactionForm: FormGroup;
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];
  
  categories: string[] = [
    'Income', 'Housing', 'Transportation', 'Food', 'Utilities',
    'Healthcare', 'Personal', 'Entertainment', 'Education', 'Debt',
    'Savings', 'Gifts/Donations', 'Travel', 'Shopping', 'Other'
  ];
  
  transactions = [
    { date: new Date('2023-03-15'), description: 'Salary Deposit', category: 'Income', amount: 3500.00 },
    { date: new Date('2023-03-14'), description: 'Grocery Store', category: 'Food', amount: -127.53 },
    { date: new Date('2023-03-12'), description: 'Electric Bill', category: 'Utilities', amount: -95.40 },
    { date: new Date('2023-03-10'), description: 'Freelance Work', category: 'Income', amount: 825.75 },
    { date: new Date('2023-03-08'), description: 'Restaurant', category: 'Food', amount: -68.25 },
    { date: new Date('2023-03-05'), description: 'Gas Station', category: 'Transportation', amount: -45.30 },
    { date: new Date('2023-03-03'), description: 'Movie Tickets', category: 'Entertainment', amount: -32.50 },
    { date: new Date('2023-03-01'), description: 'Rent Payment', category: 'Housing', amount: -1200.00 },
    { date: new Date('2023-02-28'), description: 'Internet Bill', category: 'Utilities', amount: -79.99 },
    { date: new Date('2023-02-25'), description: 'Pharmacy', category: 'Healthcare', amount: -47.32 },
    { date: new Date('2023-02-23'), description: 'Side Project', category: 'Income', amount: 350.00 },
    { date: new Date('2023-02-20'), description: 'Coffee Shop', category: 'Food', amount: -18.75 }
  ];
  
  originalTransactions = [...this.transactions];
  categoryColors: { [key: string]: string } = {};
  
  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
      amount: [null, [Validators.required]],
      category: ['', Validators.required]
    });
    
    // Generate consistent colors for categories
    this.categories.forEach(category => {
      this.categoryColors[category] = this.getCategoryColorValue(category);
    });
  }
  
  ngOnInit(): void {
    // In a real implementation, we would fetch transactions from a service
  }
  
  onSubmit(): void {
    if (this.transactionForm.valid) {
      const newTransaction = this.transactionForm.value;
      this.transactions.unshift(newTransaction);
      this.originalTransactions = [...this.transactions];
      this.resetForm();
    }
  }
  
  resetForm(): void {
    this.transactionForm.reset({
      date: new Date()
    });
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.transactions = this.originalTransactions.filter(t => 
      t.description.toLowerCase().includes(filterValue) || 
      t.category.toLowerCase().includes(filterValue)
    );
  }
  
  filterTransactions(type: string): void {
    switch (type) {
      case 'income':
        this.transactions = this.originalTransactions.filter(t => t.amount > 0);
        break;
      case 'expense':
        this.transactions = this.originalTransactions.filter(t => t.amount < 0);
        break;
      default:
        this.transactions = [...this.originalTransactions];
    }
  }
  
  filterByCategory(category: string): void {
    this.transactions = this.originalTransactions.filter(t => 
      t.category === category
    );
  }
  
  editTransaction(index: number): void {
    const transaction = this.transactions[index];
    this.transactionForm.patchValue({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category
    });
    
    // In a real app, we might delete the old one and add the edited one
  }
  
  deleteTransaction(index: number): void {
    this.transactions.splice(index, 1);
    this.originalTransactions = [...this.transactions];
  }
  
  exportTransactions(): void {
    // In a real app, this would export to CSV
    console.log('Exporting transactions');
  }
  
  getCategoryColor(category: string, opacity: number): string {
    const color = this.categoryColors[category] || '#5E35B1';
    return this.adjustColorOpacity(color, opacity);
  }
  
  private getCategoryColorValue(category: string): string {
    // Generate a deterministic color for each category
    const colors = {
      'Income': '#4CAF50',
      'Housing': '#5E35B1',
      'Transportation': '#1E88E5',
      'Food': '#FB8C00',
      'Utilities': '#7CB342',
      'Healthcare': '#E53935',
      'Personal': '#8E24AA',
      'Entertainment': '#FFB300',
      'Education': '#00897B',
      'Debt': '#C62828',
      'Savings': '#3949AB',
      'Gifts/Donations': '#D81B60',
      'Travel': '#00ACC1',
      'Shopping': '#F4511E',
      'Other': '#757575'
    };
    
    return colors[category as keyof typeof colors] || '#5E35B1';
  }
  
  private adjustColorOpacity(color: string, opacity: number): string {
    if (opacity === 1) return color;
    
    // Convert hex to rgb and add opacity
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
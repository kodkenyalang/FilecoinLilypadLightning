import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatDividerModule,
    NgChartsModule
  ],
  template: `
    <div class="budget-container">
      <header class="page-header">
        <h1>Budget Planner</h1>
        <p class="subheader">Plan and track your budget with zkML-powered insights</p>
      </header>
      
      <!-- Month Overview -->
      <mat-card class="month-overview-card">
        <mat-card-content>
          <div class="month-selector">
            <button mat-icon-button (click)="previousMonth()">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <h2 class="current-month">{{currentMonth}} {{currentYear}}</h2>
            <button mat-icon-button (click)="nextMonth()">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
          
          <div class="budget-summary">
            <div class="summary-item">
              <div class="summary-label">Income</div>
              <div class="summary-value income">${{income | number:'1.2-2'}}</div>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-item">
              <div class="summary-label">Expenses</div>
              <div class="summary-value expense">${{expenses | number:'1.2-2'}}</div>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-item">
              <div class="summary-label">Remaining</div>
              <div class="summary-value remaining">${{income - expenses | number:'1.2-2'}}</div>
            </div>
          </div>
          
          <div class="budget-progress">
            <div class="progress-info">
              <span>Budget Used</span>
              <span>{{(expenses / income) * 100 | number:'1.0-0'}}%</span>
            </div>
            <mat-progress-bar 
              mode="determinate" 
              [value]="(expenses / income) * 100" 
              [color]="expenses > income ? 'warn' : 'primary'"
            ></mat-progress-bar>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- Budget Categories -->
      <div class="budget-grid">
        <mat-card class="budget-categories-card">
          <mat-card-header>
            <mat-card-title>Budget Categories</mat-card-title>
            <mat-card-subtitle>Set and track spending limits</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table class="categories-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budgeted</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let category of budgetCategories">
                  <td>
                    <div class="category-name">
                      <span class="category-icon" [style.backgroundColor]="getCategoryColor(category.name, 0.1)">
                        <mat-icon [style.color]="getCategoryColor(category.name, 1)">{{getCategoryIcon(category.name)}}</mat-icon>
                      </span>
                      {{category.name}}
                    </div>
                  </td>
                  <td>${{category.budgeted | number:'1.2-2'}}</td>
                  <td>${{category.spent | number:'1.2-2'}}</td>
                  <td [class.negative]="category.budgeted - category.spent < 0">
                    ${{category.budgeted - category.spent | number:'1.2-2'}}
                  </td>
                  <td>
                    <div class="progress-bar-container">
                      <mat-progress-bar 
                        mode="determinate" 
                        [value]="(category.spent / category.budgeted) * 100" 
                        [color]="category.spent > category.budgeted ? 'warn' : 'primary'"
                      ></mat-progress-bar>
                      <span class="progress-percentage">
                        {{(category.spent / category.budgeted) * 100 | number:'1.0-0'}}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <button mat-icon-button color="primary" (click)="editCategory(category)">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div class="add-category">
              <button mat-stroked-button color="primary" (click)="showAddCategory = true" *ngIf="!showAddCategory">
                <mat-icon>add</mat-icon> Add Category
              </button>
              
              <form [formGroup]="categoryForm" (ngSubmit)="addCategory()" *ngIf="showAddCategory">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Category</mat-label>
                    <mat-select formControlName="name">
                      <mat-option *ngFor="let cat of availableCategories" [value]="cat">
                        {{cat}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Budget Amount</mat-label>
                    <input matInput type="number" formControlName="budgeted">
                    <span matTextPrefix>$&nbsp;</span>
                  </mat-form-field>
                  
                  <div class="form-actions">
                    <button mat-button type="button" (click)="cancelAddCategory()">Cancel</button>
                    <button mat-raised-button color="primary" type="submit" [disabled]="categoryForm.invalid">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </mat-card-content>
        </mat-card>
        
        <div class="budget-charts">
          <mat-card class="budget-chart-card">
            <mat-card-header>
              <mat-card-title>Monthly Breakdown</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas baseChart
                  [data]="pieChartData"
                  [options]="pieChartOptions"
                  [type]="'pie'">
                </canvas>
              </div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="tips-card">
            <mat-card-header>
              <mat-card-title>
                <div class="tips-header">
                  <mat-icon>lightbulb</mat-icon>
                  <span>Budget Tips</span>
                </div>
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="tips-container">
                <div class="tip" *ngFor="let tip of budgetTips">
                  <mat-icon class="tip-icon">check_circle</mat-icon>
                  <p>{{tip}}</p>
                </div>
                
                <div class="ai-badge">
                  <mat-icon>security</mat-icon>
                  <span>Insights powered by zkML</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
      
      <!-- Savings Goals -->
      <mat-card class="savings-goals-card">
        <mat-card-header>
          <mat-card-title>Savings Goals</mat-card-title>
          <mat-card-subtitle>Track progress towards your financial goals</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="goals-container">
            <div class="goal-card" *ngFor="let goal of savingsGoals; let i = index">
              <div class="goal-header">
                <div class="goal-icon" [style.backgroundColor]="getGoalColor(i, 0.1)">
                  <mat-icon [style.color]="getGoalColor(i, 1)">{{goal.icon}}</mat-icon>
                </div>
                <div class="goal-info">
                  <h3>{{goal.name}}</h3>
                  <p>Target: ${{goal.target | number:'1.0-0'}} by {{goal.targetDate | date:'MMM yyyy'}}</p>
                </div>
                <button mat-icon-button color="primary" class="goal-edit">
                  <mat-icon>edit</mat-icon>
                </button>
              </div>
              
              <div class="goal-progress">
                <div class="goal-amounts">
                  <span>${{goal.current | number:'1.0-0'}}</span>
                  <span>${{goal.target | number:'1.0-0'}}</span>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="(goal.current / goal.target) * 100" 
                  color="primary"
                ></mat-progress-bar>
                <div class="goal-percentage">
                  {{(goal.current / goal.target) * 100 | number:'1.0-0'}}% Complete
                </div>
              </div>
            </div>
            
            <div class="add-goal-card">
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                Add New Goal
              </button>
              <p>Create a new savings goal with automated tracking</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .budget-container {
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
    
    /* Month Overview */
    .month-overview-card {
      margin-bottom: 2rem;
      border-radius: 10px;
    }
    
    .month-selector {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    
    .current-month {
      margin: 0 1rem;
      font-size: 1.5rem;
      color: var(--primary-color);
    }
    
    .budget-summary {
      display: flex;
      justify-content: space-around;
      margin-bottom: 2rem;
    }
    
    .summary-item {
      text-align: center;
    }
    
    .summary-label {
      font-size: 0.9rem;
      color: var(--text-medium);
      margin-bottom: 0.5rem;
    }
    
    .summary-value {
      font-size: 2rem;
      font-weight: 500;
    }
    
    .income {
      color: var(--success-color);
    }
    
    .expense {
      color: var(--error-color);
    }
    
    .remaining {
      color: var(--primary-color);
    }
    
    .summary-divider {
      width: 1px;
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    .budget-progress {
      padding: 0 1rem;
    }
    
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-medium);
    }
    
    /* Budget Grid Layout */
    .budget-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    /* Categories Section */
    .budget-categories-card {
      border-radius: 10px;
    }
    
    .categories-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }
    
    .categories-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      color: var(--text-medium);
      font-weight: 500;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .categories-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      vertical-align: middle;
    }
    
    .category-name {
      display: flex;
      align-items: center;
    }
    
    .category-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 0.75rem;
    }
    
    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .progress-percentage {
      font-size: 0.85rem;
      color: var(--text-medium);
      width: 40px;
    }
    
    .negative {
      color: var(--error-color);
    }
    
    .add-category {
      margin-top: 1rem;
    }
    
    .form-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .form-row mat-form-field {
      flex: 1;
    }
    
    .form-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    /* Charts Section */
    .budget-charts {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .budget-chart-card, .tips-card {
      border-radius: 10px;
      flex: 1;
    }
    
    .chart-container {
      height: 250px;
      position: relative;
    }
    
    .tips-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .tips-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .tip {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .tip-icon {
      color: var(--primary-color);
      margin-top: 0.15rem;
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
    }
    
    .tip p {
      margin: 0;
      color: var(--text-medium);
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .ai-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.5rem 0.75rem;
      background-color: rgba(94, 53, 177, 0.08);
      border-radius: 4px;
      font-size: 0.85rem;
      color: var(--primary-color);
    }
    
    /* Savings Goals */
    .savings-goals-card {
      border-radius: 10px;
    }
    
    .goals-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    
    .goal-card {
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      padding: 1.25rem;
      border: 1px solid rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }
    
    .goal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    }
    
    .goal-header {
      display: flex;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    
    .goal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      margin-right: 0.75rem;
    }
    
    .goal-info {
      flex: 1;
    }
    
    .goal-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
    }
    
    .goal-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-medium);
    }
    
    .goal-edit {
      margin-left: auto;
    }
    
    .goal-progress {
      padding: 0 0.5rem;
    }
    
    .goal-amounts {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-medium);
    }
    
    .goal-percentage {
      text-align: center;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: var(--primary-color);
      font-weight: 500;
    }
    
    .add-goal-card {
      background-color: rgba(94, 53, 177, 0.04);
      border-radius: 8px;
      padding: 1.25rem;
      border: 1px dashed rgba(94, 53, 177, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    
    .add-goal-card p {
      margin: 1rem 0 0 0;
      color: var(--text-medium);
      font-size: 0.9rem;
    }
    
    /* Responsive design */
    @media (max-width: 991px) {
      .budget-grid {
        grid-template-columns: 1fr;
      }
      
      .goals-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .goals-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BudgetComponent implements OnInit {
  // Date handling
  currentDate = new Date();
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonth = this.months[this.currentDate.getMonth()];
  currentYear = this.currentDate.getFullYear();
  
  // Budget summary
  income: number = 4500.00;
  expenses: number = 3150.25;
  
  // Budget categories form
  categoryForm: FormGroup;
  showAddCategory = false;
  
  // Available categories
  availableCategories = [
    'Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare', 
    'Personal', 'Entertainment', 'Education', 'Debt', 'Savings'
  ];
  
  // Budget categories
  budgetCategories = [
    { name: 'Housing', budgeted: 1200, spent: 1200 },
    { name: 'Food', budgeted: 600, spent: 527.53 },
    { name: 'Transportation', budgeted: 400, spent: 385.40 },
    { name: 'Utilities', budgeted: 300, spent: 275.39 },
    { name: 'Entertainment', budgeted: 200, spent: 287.75 },
    { name: 'Savings', budgeted: 500, spent: 500 }
  ];
  
  // Budget tips based on spending patterns
  budgetTips = [
    'Your entertainment spending is 44% higher than last month. Consider setting a stricter limit.',
    'You\'ve reached your savings goal for this month! Great job.',
    'Try allocating 5% more towards your emergency fund for better financial security.',
    'Based on your spending patterns, you could save $125 on food by meal prepping.',
    'Consider reviewing your subscription services to eliminate unused ones.'
  ];
  
  // Savings goals
  savingsGoals = [
    { 
      name: 'Emergency Fund', 
      current: 2500, 
      target: 10000, 
      targetDate: new Date('2023-12-31'),
      icon: 'medical_services'
    },
    { 
      name: 'Down Payment', 
      current: 15000, 
      target: 50000, 
      targetDate: new Date('2024-06-30'),
      icon: 'home'
    },
    { 
      name: 'Vacation', 
      current: 1200, 
      target: 3000, 
      targetDate: new Date('2023-08-15'),
      icon: 'beach_access'
    }
  ];
  
  // Chart data
  pieChartData = {
    labels: this.budgetCategories.map(cat => cat.name),
    datasets: [
      {
        data: this.budgetCategories.map(cat => cat.spent),
        backgroundColor: [
          'rgba(94, 53, 177, 0.7)',  // Primary (Violet)
          'rgba(30, 136, 229, 0.7)', // Secondary (Azure)
          'rgba(76, 175, 80, 0.7)',  // Green
          'rgba(255, 152, 0, 0.7)',  // Orange
          'rgba(244, 67, 54, 0.7)',  // Red
          'rgba(121, 85, 72, 0.7)'   // Brown
        ]
      }
    ]
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
  
  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      budgeted: [null, [Validators.required, Validators.min(1)]]
    });
  }
  
  ngOnInit(): void {
    // In a real implementation, we would fetch budget data from a service
  }
  
  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCurrentMonth();
  }
  
  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCurrentMonth();
  }
  
  updateCurrentMonth(): void {
    this.currentMonth = this.months[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
    // In a real app, we would fetch data for the new month
  }
  
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Housing': 'home',
      'Food': 'restaurant',
      'Transportation': 'commute',
      'Utilities': 'power',
      'Healthcare': 'medical_services',
      'Personal': 'person',
      'Entertainment': 'sports_esports',
      'Education': 'school',
      'Debt': 'account_balance',
      'Savings': 'savings'
    };
    
    return icons[category] || 'category';
  }
  
  getCategoryColor(category: string, opacity: number): string {
    const colors: { [key: string]: string } = {
      'Housing': '#5E35B1',
      'Food': '#FB8C00',
      'Transportation': '#1E88E5',
      'Utilities': '#43A047',
      'Healthcare': '#E53935',
      'Personal': '#8E24AA',
      'Entertainment': '#FFB300',
      'Education': '#00897B',
      'Debt': '#C62828',
      'Savings': '#3949AB'
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
  
  getGoalColor(index: number, opacity: number): string {
    const colors = [
      '#5E35B1', // Primary (Violet)
      '#1E88E5', // Secondary (Azure)
      '#43A047', // Green
      '#FB8C00', // Orange
      '#E53935'  // Red
    ];
    
    const color = colors[index % colors.length];
    
    if (opacity === 1) return color;
    
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  addCategory(): void {
    if (this.categoryForm.valid) {
      const newCategory = this.categoryForm.value;
      newCategory.spent = 0; // New category starts with 0 spent
      this.budgetCategories.push(newCategory);
      
      // Update chart data
      this.updateChartData();
      
      // Reset form and hide
      this.categoryForm.reset();
      this.showAddCategory = false;
    }
  }
  
  cancelAddCategory(): void {
    this.categoryForm.reset();
    this.showAddCategory = false;
  }
  
  editCategory(category: any): void {
    // In a real app, this would open a dialog to edit the category
    this.categoryForm.setValue({
      name: category.name,
      budgeted: category.budgeted
    });
    this.showAddCategory = true;
  }
  
  updateChartData(): void {
    this.pieChartData = {
      labels: this.budgetCategories.map(cat => cat.name),
      datasets: [
        {
          data: this.budgetCategories.map(cat => cat.spent),
          backgroundColor: [
            'rgba(94, 53, 177, 0.7)',  // Primary (Violet)
            'rgba(30, 136, 229, 0.7)', // Secondary (Azure)
            'rgba(76, 175, 80, 0.7)',  // Green
            'rgba(255, 152, 0, 0.7)',  // Orange
            'rgba(244, 67, 54, 0.7)',  // Red
            'rgba(121, 85, 72, 0.7)',  // Brown
            'rgba(156, 39, 176, 0.7)', // Purple
            'rgba(0, 150, 136, 0.7)',  // Teal
            'rgba(63, 81, 181, 0.7)',  // Indigo
            'rgba(233, 30, 99, 0.7)'   // Pink
          ]
        }
      ]
    };
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    NgChartsModule
  ],
  template: `
    <div class="analysis-container">
      <header class="page-header">
        <h1>Financial Analysis</h1>
        <p class="subheader">AI-powered insights with zero-knowledge machine learning</p>
      </header>
      
      <!-- Zero-Knowledge ML Info -->
      <mat-card class="zkml-info-card">
        <mat-card-content>
          <div class="zkml-info">
            <div class="zkml-icon">
              <mat-icon>security</mat-icon>
            </div>
            <div class="zkml-text">
              <h2>Zero-Knowledge Machine Learning</h2>
              <p>
                All analyses are performed using encrypted data with zero-knowledge proofs.
                Your financial information never leaves your control, while still benefiting from advanced ML insights.
              </p>
            </div>
            <div class="zkml-status">
              <mat-icon class="status-icon">verified</mat-icon>
              <span>Active</span>
            </div>
          </div>
          
          <div class="network-info">
            <div class="network-items">
              <div class="network-item">
                <span class="label">Provider:</span>
                <span class="value">Lilypad zkML Network</span>
              </div>
              <div class="network-item">
                <span class="label">Encryption:</span>
                <span class="value">Homomorphic + Fully Encrypted</span>
              </div>
              <div class="network-item">
                <span class="label">Latest Proof:</span>
                <span class="value">{{latestProofTime | date:'short'}}</span>
              </div>
            </div>
            <button mat-stroked-button color="primary">
              <mat-icon>shield</mat-icon>
              Verify Proofs
            </button>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- Analysis Tabs -->
      <mat-card class="analysis-tabs-card">
        <mat-card-content>
          <mat-tab-group animationDuration="200ms">
            <!-- Spending Trends -->
            <mat-tab label="Spending Trends">
              <div class="tab-content">
                <div class="insight-header">
                  <h2>Private Spending Analysis</h2>
                  <p class="insight-description">
                    Your spending patterns analyzed privately. No raw data is ever exposed during analysis.
                  </p>
                </div>
                
                <div class="chart-section">
                  <div class="chart-container">
                    <canvas baseChart
                      [data]="spendingTrendsData"
                      [options]="lineChartOptions"
                      [type]="'line'">
                    </canvas>
                  </div>
                </div>
                
                <div class="insights-section">
                  <h3>Private Insights</h3>
                  <div class="insights-grid">
                    <div class="insight-card" *ngFor="let insight of spendingInsights">
                      <div class="insight-icon" [style.backgroundColor]="insight.color + '22'">
                        <mat-icon [style.color]="insight.color">{{insight.icon}}</mat-icon>
                      </div>
                      <div class="insight-content">
                        <h4>{{insight.title}}</h4>
                        <p>{{insight.description}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
            
            <!-- Anomaly Detection -->
            <mat-tab label="Anomaly Detection">
              <div class="tab-content">
                <div class="insight-header">
                  <h2>zkML Anomaly Detection</h2>
                  <p class="insight-description">
                    Unusual spending patterns detected using zero-knowledge proofs, ensuring your data privacy.
                  </p>
                </div>
                
                <div class="anomaly-timeline">
                  <div class="timeline-header">
                    <div>Transaction</div>
                    <div>Anomaly Score</div>
                    <div>Status</div>
                  </div>
                  
                  <div class="timeline-item" *ngFor="let anomaly of anomalies">
                    <div class="timeline-transaction">
                      <div class="timeline-date">{{anomaly.date | date:'MMM d'}}</div>
                      <div class="timeline-details">
                        <span class="transaction-description">{{anomaly.description}}</span>
                        <span class="transaction-amount" 
                              [class.positive]="anomaly.amount > 0" 
                              [class.negative]="anomaly.amount < 0">
                          {{anomaly.amount | currency}}
                        </span>
                      </div>
                    </div>
                    
                    <div class="timeline-score">
                      <mat-progress-bar 
                        mode="determinate" 
                        [value]="anomaly.score * 100" 
                        [color]="anomaly.score > 0.7 ? 'warn' : 'primary'">
                      </mat-progress-bar>
                      <span class="score-value">{{anomaly.score | percent:'1.0-0'}}</span>
                    </div>
                    
                    <div class="timeline-status">
                      <span class="status-chip" 
                            [class.high]="anomaly.score > 0.7" 
                            [class.medium]="anomaly.score <= 0.7 && anomaly.score > 0.4"
                            [class.low]="anomaly.score <= 0.4">
                        {{getAnomalyStatus(anomaly.score)}}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="insights-section">
                  <h3>Privacy-Preserving Features</h3>
                  <div class="feature-list">
                    <div class="feature-item">
                      <mat-icon>enhanced_encryption</mat-icon>
                      <span>Encrypted Model Training</span>
                    </div>
                    <div class="feature-item">
                      <mat-icon>visibility_off</mat-icon>
                      <span>Blind Inference</span>
                    </div>
                    <div class="feature-item">
                      <mat-icon>verified_user</mat-icon>
                      <span>Zero-Knowledge Proofs</span>
                    </div>
                    <div class="feature-item">
                      <mat-icon>security</mat-icon>
                      <span>Differential Privacy</span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
            
            <!-- Future Projections -->
            <mat-tab label="Future Projections">
              <div class="tab-content">
                <div class="insight-header">
                  <h2>Private Financial Forecast</h2>
                  <p class="insight-description">
                    Securely predict your future financial path using zero-knowledge machine learning.
                  </p>
                </div>
                
                <div class="chart-section">
                  <div class="chart-container">
                    <canvas baseChart
                      [data]="forecastData"
                      [options]="lineChartOptions"
                      [type]="'line'">
                    </canvas>
                  </div>
                </div>
                
                <div class="forecast-stats">
                  <div class="forecast-stat">
                    <div class="stat-value positive">${{projectedSavings | number:'1.0-0'}}</div>
                    <div class="stat-label">Projected Savings</div>
                  </div>
                  
                  <div class="forecast-stat">
                    <div class="stat-value negative">${{projectedExpenses | number:'1.0-0'}}</div>
                    <div class="stat-label">Projected Expenses</div>
                  </div>
                  
                  <div class="forecast-stat">
                    <div class="stat-value">{{savingsGrowthRate | percent:'1.1-1'}}</div>
                    <div class="stat-label">Savings Growth Rate</div>
                  </div>
                </div>
                
                <div class="recommendations-section">
                  <h3>AI Recommendations</h3>
                  <div class="recommendations-list">
                    <mat-card class="recommendation-card" *ngFor="let rec of recommendations">
                      <mat-card-content>
                        <div class="recommendation-header">
                          <mat-icon [style.color]="rec.color">{{rec.icon}}</mat-icon>
                          <h4>{{rec.title}}</h4>
                        </div>
                        <p>{{rec.description}}</p>
                        <div class="recommendation-impact">
                          <span class="impact-label">Potential Impact:</span>
                          <div class="impact-value">
                            <mat-icon *ngFor="let i of [1,2,3,4,5]" 
                              [class.filled]="i <= rec.impact" 
                              [class.empty]="i > rec.impact">
                              star
                            </mat-icon>
                          </div>
                        </div>
                      </mat-card-content>
                    </mat-card>
                  </div>
                  
                  <div class="privacy-badge">
                    <mat-icon>verified</mat-icon>
                    <span>All recommendations are generated privately with zkML. Your data never leaves your control.</span>
                  </div>
                </div>
              </div>
            </mat-tab>
            
            <!-- Decentralized Storage -->
            <mat-tab label="Storage & Verification">
              <div class="tab-content">
                <div class="insight-header">
                  <h2>Decentralized Privacy Storage</h2>
                  <p class="insight-description">
                    Your encrypted financial data is securely stored on decentralized networks through Lighthouse and Filecoin.
                  </p>
                </div>
                
                <div class="storage-info">
                  <div class="providers-section">
                    <h3>Storage Providers</h3>
                    <div class="providers-grid">
                      <div class="provider-card lighthouse">
                        <div class="provider-logo">
                          <mat-icon>lighthouse</mat-icon>
                          <span>Lighthouse</span>
                        </div>
                        <div class="provider-stats">
                          <div class="provider-stat">
                            <span class="stat-label">Status:</span>
                            <span class="stat-value active">Connected</span>
                          </div>
                          <div class="provider-stat">
                            <span class="stat-label">Files:</span>
                            <span class="stat-value">{{lighthouseFiles}}</span>
                          </div>
                          <div class="provider-stat">
                            <span class="stat-label">Latest CID:</span>
                            <span class="stat-value cid">{{latestLighthouseCID}}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="provider-card filecoin">
                        <div class="provider-logo">
                          <mat-icon>storage</mat-icon>
                          <span>Filecoin</span>
                        </div>
                        <div class="provider-stats">
                          <div class="provider-stat">
                            <span class="stat-label">Status:</span>
                            <span class="stat-value active">Active</span>
                          </div>
                          <div class="provider-stat">
                            <span class="stat-label">Deals:</span>
                            <span class="stat-value">{{filecoinDeals}}</span>
                          </div>
                          <div class="provider-stat">
                            <span class="stat-label">Storage Miners:</span>
                            <span class="stat-value">{{filecoinMiners}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="verification-section">
                    <h3>Verification & Proofs</h3>
                    <div class="verification-steps">
                      <mat-vertical-stepper linear="false">
                        <mat-step completed="true">
                          <ng-template matStepLabel>Data Encryption</ng-template>
                          <div class="step-content">
                            <p>Your financial data is encrypted locally with AES-256 encryption.</p>
                            <div class="step-status completed">
                              <mat-icon>check_circle</mat-icon>
                              <span>Completed</span>
                            </div>
                          </div>
                        </mat-step>
                        
                        <mat-step completed="true">
                          <ng-template matStepLabel>Decentralized Storage</ng-template>
                          <div class="step-content">
                            <p>Encrypted data is stored on the Lighthouse network and replicated to Filecoin.</p>
                            <div class="step-status completed">
                              <mat-icon>check_circle</mat-icon>
                              <span>Completed</span>
                            </div>
                          </div>
                        </mat-step>
                        
                        <mat-step completed="true">
                          <ng-template matStepLabel>Zero-Knowledge Processing</ng-template>
                          <div class="step-content">
                            <p>Secure analysis performed using Lilypad zkML platform, maintaining privacy.</p>
                            <div class="step-status completed">
                              <mat-icon>check_circle</mat-icon>
                              <span>Last Proof: {{latestProofTime | date:'MMM d, h:mm a'}}</span>
                            </div>
                          </div>
                        </mat-step>
                        
                        <mat-step completed="true">
                          <ng-template matStepLabel>Verification</ng-template>
                          <div class="step-content">
                            <p>All ML results verified with zero-knowledge proofs for authenticity.</p>
                            <div class="step-status completed">
                              <mat-icon>check_circle</mat-icon>
                              <span>Verified</span>
                            </div>
                          </div>
                        </mat-step>
                      </mat-vertical-stepper>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .analysis-container {
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
    
    /* zkML Info Card */
    .zkml-info-card {
      margin-bottom: 2rem;
      border-radius: 10px;
      border-left: 4px solid var(--primary-color);
    }
    
    .zkml-info {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .zkml-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background-color: rgba(94, 53, 177, 0.1);
      border-radius: 12px;
      margin-right: 1.5rem;
    }
    
    .zkml-icon mat-icon {
      color: var(--primary-color);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    .zkml-text {
      flex: 1;
    }
    
    .zkml-text h2 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
      font-size: 1.25rem;
      font-weight: 500;
    }
    
    .zkml-text p {
      margin: 0;
      color: var(--text-medium);
      font-size: 0.95rem;
      line-height: 1.5;
      max-width: 80%;
    }
    
    .zkml-status {
      display: flex;
      align-items: center;
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success-color);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .status-icon {
      margin-right: 0.5rem;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .network-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(94, 53, 177, 0.05);
      padding: 1rem 1.5rem;
      border-radius: 8px;
    }
    
    .network-items {
      display: flex;
      gap: 2rem;
    }
    
    .network-item {
      display: flex;
      flex-direction: column;
    }
    
    .network-item .label {
      font-size: 0.8rem;
      color: var(--text-medium);
      margin-bottom: 0.25rem;
    }
    
    .network-item .value {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-dark);
    }
    
    /* Analysis Tabs Card */
    .analysis-tabs-card {
      border-radius: 10px;
    }
    
    .analysis-tabs-card mat-card-content {
      padding: 0;
    }
    
    .tab-content {
      padding: 1.5rem;
    }
    
    .insight-header {
      margin-bottom: 2rem;
    }
    
    .insight-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
      font-size: 1.5rem;
    }
    
    .insight-description {
      color: var(--text-medium);
      font-size: 1rem;
      max-width: 700px;
      margin: 0;
    }
    
    /* Chart Section */
    .chart-section {
      margin-bottom: 2rem;
    }
    
    .chart-container {
      height: 350px;
      position: relative;
    }
    
    /* Insights Section */
    .insights-section {
      margin-top: 2rem;
    }
    
    .insights-section h3 {
      margin: 0 0 1.25rem 0;
      color: var(--primary-dark);
      font-size: 1.25rem;
      font-weight: 500;
    }
    
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .insight-card {
      display: flex;
      align-items: flex-start;
      padding: 1.25rem;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }
    
    .insight-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    }
    
    .insight-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      margin-right: 1rem;
    }
    
    .insight-content {
      flex: 1;
    }
    
    .insight-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-dark);
    }
    
    .insight-content p {
      margin: 0;
      color: var(--text-medium);
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    /* Anomaly Timeline */
    .anomaly-timeline {
      margin-bottom: 2rem;
    }
    
    .timeline-header {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
      padding: 0.75rem 1rem;
      background-color: rgba(0, 0, 0, 0.03);
      border-radius: 8px 8px 0 0;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-medium);
    }
    
    .timeline-item {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
      padding: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      align-items: center;
    }
    
    .timeline-transaction {
      display: flex;
      align-items: center;
    }
    
    .timeline-date {
      font-size: 0.9rem;
      color: var(--text-medium);
      width: 80px;
    }
    
    .timeline-details {
      display: flex;
      flex-direction: column;
    }
    
    .transaction-description {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .transaction-amount {
      font-size: 0.9rem;
    }
    
    .timeline-score {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .score-value {
      font-size: 0.9rem;
      font-weight: 500;
      width: 40px;
      text-align: right;
    }
    
    .status-chip {
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .status-chip.high {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
    }
    
    .status-chip.medium {
      background-color: rgba(255, 152, 0, 0.1);
      color: var(--warning-color);
    }
    
    .status-chip.low {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success-color);
    }
    
    /* Feature List */
    .feature-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background-color: rgba(94, 53, 177, 0.05);
      border-radius: 8px;
      color: var(--primary-color);
      font-weight: 500;
    }
    
    /* Forecast Stats */
    .forecast-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .forecast-stat {
      padding: 1.25rem;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      text-align: center;
    }
    
    .stat-value {
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .stat-value.positive {
      color: var(--success-color);
    }
    
    .stat-value.negative {
      color: var(--error-color);
    }
    
    .stat-label {
      color: var(--text-medium);
      font-size: 0.9rem;
    }
    
    /* Recommendations */
    .recommendations-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .recommendation-card {
      border-radius: 8px;
    }
    
    .recommendation-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .recommendation-header h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    .recommendation-impact {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    
    .impact-label {
      color: var(--text-medium);
    }
    
    .impact-value {
      display: flex;
      align-items: center;
    }
    
    .impact-value mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
    }
    
    .impact-value mat-icon.filled {
      color: var(--primary-color);
    }
    
    .impact-value mat-icon.empty {
      color: rgba(0, 0, 0, 0.1);
    }
    
    .privacy-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background-color: rgba(94, 53, 177, 0.08);
      border-radius: 8px;
      color: var(--primary-color);
      font-size: 0.9rem;
    }
    
    /* Storage & Verification */
    .storage-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .providers-section h3,
    .verification-section h3 {
      margin: 0 0 1.25rem 0;
      color: var(--primary-dark);
      font-size: 1.25rem;
      font-weight: 500;
    }
    
    .providers-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .provider-card {
      padding: 1.25rem;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .provider-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      font-weight: 500;
      font-size: 1.1rem;
    }
    
    .provider-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .provider-stat {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    
    .provider-stat .stat-label {
      color: var(--text-medium);
    }
    
    .provider-stat .stat-value {
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .provider-stat .stat-value.active {
      color: var(--success-color);
    }
    
    .provider-stat .stat-value.cid {
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--text-medium);
    }
    
    .step-content {
      padding: 0.75rem 0 1.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .step-content p {
      margin: 0;
      color: var(--text-medium);
      font-size: 0.95rem;
      max-width: 70%;
    }
    
    .step-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .step-status.completed {
      color: var(--success-color);
    }
    
    .positive {
      color: var(--success-color);
    }
    
    .negative {
      color: var(--error-color);
    }
    
    /* Responsive design */
    @media (max-width: 991px) {
      .insights-grid,
      .recommendations-list,
      .feature-list,
      .storage-info,
      .providers-grid {
        grid-template-columns: 1fr;
      }
      
      .forecast-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .network-items {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
    
    @media (max-width: 768px) {
      .timeline-header,
      .timeline-item {
        grid-template-columns: 2fr 1fr 1fr;
      }
      
      .forecast-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalysisComponent implements OnInit {
  // zkML and decentralized storage status
  latestProofTime = new Date('2023-03-15T14:35:00');
  lighthouseFiles = 14;
  latestLighthouseCID = 'bafybeie5gq...4ukbua';
  filecoinDeals = 8;
  filecoinMiners = 3;
  
  // Spending trends chart data
  spendingTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Housing',
        data: [1200, 1200, 1200, 1200, 1200, 1200],
        borderColor: 'rgba(94, 53, 177, 1)',
        backgroundColor: 'rgba(94, 53, 177, 0.1)'
      },
      {
        label: 'Food',
        data: [450, 480, 520, 490, 510, 530],
        borderColor: 'rgba(255, 152, 0, 1)',
        backgroundColor: 'rgba(255, 152, 0, 0.1)'
      },
      {
        label: 'Entertainment',
        data: [180, 220, 195, 250, 210, 290],
        borderColor: 'rgba(30, 136, 229, 1)',
        backgroundColor: 'rgba(30, 136, 229, 0.1)'
      },
      {
        label: 'Transportation',
        data: [350, 320, 290, 310, 330, 320],
        borderColor: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)'
      }
    ]
  };
  
  // Forecast chart data
  forecastData = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Expected Income',
        data: [4500, 4500, 4700, 4500, 4500, 4800, 5200],
        borderColor: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderDash: [0],
        fill: false
      },
      {
        label: 'Expected Expenses',
        data: [3150, 3250, 3300, 3200, 3400, 3600, 3800],
        borderColor: 'rgba(244, 67, 54, 1)',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderDash: [0],
        fill: false
      },
      {
        label: 'Projected Savings',
        data: [1350, 1250, 1400, 1300, 1100, 1200, 1400],
        borderColor: 'rgba(94, 53, 177, 1)',
        backgroundColor: 'rgba(94, 53, 177, 0.2)',
        borderDash: [5, 5],
        fill: true
      }
    ]
  };
  
  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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
  
  // Forecast statistics
  projectedSavings = 8000;
  projectedExpenses = 22500;
  savingsGrowthRate = 0.045;
  
  // Spending insights
  spendingInsights = [
    {
      title: 'Entertainment Trend',
      description: 'Your entertainment spending has increased by 22% compared to the previous quarter.',
      icon: 'movie',
      color: '#E53935'
    },
    {
      title: 'Consistent Housing',
      description: 'Housing costs remain stable, representing 38% of your monthly expenses.',
      icon: 'home',
      color: '#5E35B1'
    },
    {
      title: 'Food Spending',
      description: 'Food expenses are gradually increasing at a rate of 4% month-over-month.',
      icon: 'restaurant',
      color: '#FB8C00'
    },
    {
      title: 'Transportation Savings',
      description: 'Your transportation costs are trending downward, saving you $30/month on average.',
      icon: 'directions_car',
      color: '#43A047'
    }
  ];
  
  // Anomaly detection
  anomalies = [
    {
      date: new Date('2023-03-10'),
      description: 'Online Electronics Store',
      amount: -899.99,
      score: 0.92
    },
    {
      date: new Date('2023-02-25'),
      description: 'Subscription Renewal',
      amount: -95.00,
      score: 0.75
    },
    {
      date: new Date('2023-02-18'),
      description: 'Restaurant Charge',
      amount: -138.42,
      score: 0.65
    },
    {
      date: new Date('2023-01-30'),
      description: 'Travel Booking',
      amount: -450.00,
      score: 0.48
    },
    {
      date: new Date('2023-01-15'),
      description: 'Utility Payment',
      amount: -87.35,
      score: 0.23
    }
  ];
  
  // Financial recommendations
  recommendations = [
    {
      title: 'Reduce Entertainment Spending',
      description: 'Consider reducing your entertainment budget by 15% to increase your monthly savings rate.',
      icon: 'movie',
      color: '#E53935',
      impact: 4
    },
    {
      title: 'Auto-Transfer to Savings',
      description: 'Set up an automatic transfer of $200 to your savings account on paydays.',
      icon: 'account_balance',
      color: '#1E88E5',
      impact: 5
    },
    {
      title: 'Review Subscriptions',
      description: 'You have 7 active subscriptions totaling $78.35/month. Consider reviewing for unused services.',
      icon: 'subscriptions',
      color: '#FB8C00',
      impact: 3
    },
    {
      title: 'Meal Planning',
      description: 'Implementing a weekly meal plan could reduce your food expenses by up to 20%.',
      icon: 'restaurant',
      color: '#43A047',
      impact: 4
    }
  ];
  
  constructor() { }
  
  ngOnInit(): void {
    // In a real implementation, we would fetch data from a service
  }
  
  getAnomalyStatus(score: number): string {
    if (score > 0.7) {
      return 'High';
    } else if (score > 0.4) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }
}
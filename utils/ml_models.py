import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
from utils.lilypad_client import LilypadClient

class FinancialMLModels:
    """
    Machine learning models for financial analysis using Lilypad for zero-knowledge computation.
    """
    
    def __init__(self, lilypad_client=None):
        """
        Initialize the ML models manager.
        
        Args:
            lilypad_client: Optional LilypadClient instance
        """
        self.lilypad_client = lilypad_client or LilypadClient()
    
    def predict_spending(self, data, forecast_periods=30):
        """
        Predict future spending based on historical data using Lilypad's ZK-ML.
        
        Args:
            data: Prepared financial data
            forecast_periods: Number of days to forecast
            
        Returns:
            predictions: Dictionary with prediction results
        """
        # Prepare the payload for Lilypad
        payload = {
            "data": data,
            "task": "time_series_forecast",
            "parameters": {
                "forecast_periods": forecast_periods,
                "target": "amount"
            }
        }
        
        try:
            # Submit the job to Lilypad for zero-knowledge processing
            result = self.lilypad_client.run_ml_job_and_wait(
                model_name="financial_forecast",
                data=payload,
                hyperparameters={"privacy_level": "high"}
            )
            
            return result
        except Exception as e:
            # Fallback to local simulated forecast (for development/testing)
            print(f"Error with Lilypad: {str(e)}. Using fallback forecast.")
            return self._fallback_spending_forecast(data, forecast_periods)
    
    def _fallback_spending_forecast(self, data, forecast_periods):
        """
        Fallback method for spending forecast when Lilypad is unavailable.
        This should only be used for development/testing.
        
        Args:
            data: Prepared financial data
            forecast_periods: Number of days to forecast
            
        Returns:
            predictions: Dictionary with prediction results
        """
        # Extract data points from features
        features = data.get('features', [])
        dates = data.get('dates', [])
        
        if not features or not dates:
            return {"error": "Insufficient data for forecast"}
        
        # Convert features to DataFrame
        df = pd.DataFrame(features)
        
        if 'amount' not in df.columns:
            return {"error": "Amount data missing"}
        
        # Calculate simple moving average
        amounts = df['amount'].values
        
        # Use last 7-day spending as a baseline
        last_week_avg = np.mean([abs(a) for a in amounts[-7:] if a < 0])
        
        # Generate forecast dates
        last_date = datetime.strptime(dates[-1], '%Y-%m-%d')
        forecast_dates = [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d') 
                         for i in range(forecast_periods)]
        
        # Generate "forecast" values with some randomness
        np.random.seed(42)  # For reproducibility
        noise_factor = 0.2  # 20% noise
        
        forecast_values = []
        for i in range(forecast_periods):
            # Create a simple cyclic pattern with weekly seasonality
            day_factor = 1.0 + 0.3 * np.sin((i % 7) * np.pi / 3)
            # Add more spending on weekends (days 5 and 6)
            weekend_factor = 1.5 if i % 7 >= 5 else 1.0
            # Add some noise
            noise = np.random.normal(0, noise_factor * last_week_avg)
            # Compute forecasted amount (negative for expenses)
            value = -1 * day_factor * weekend_factor * last_week_avg + noise
            forecast_values.append(value)
        
        # Create prediction result similar to what Lilypad would return
        prediction_result = {
            "forecast": {
                "dates": forecast_dates,
                "values": forecast_values
            },
            "metadata": {
                "model": "fallback_forecast",
                "confidence": 0.6,  # Lower confidence as this is a fallback
                "baseline": last_week_avg
            }
        }
        
        return prediction_result
    
    def detect_anomalies(self, data):
        """
        Detect anomalies in spending patterns using Lilypad's ZK-ML.
        
        Args:
            data: Prepared financial data
            
        Returns:
            anomalies: Dictionary with detected anomalies
        """
        # Prepare the payload for Lilypad
        payload = {
            "data": data,
            "task": "anomaly_detection",
            "parameters": {
                "sensitivity": "medium",
                "target": "amount"
            }
        }
        
        try:
            # Submit the job to Lilypad for zero-knowledge processing
            result = self.lilypad_client.run_ml_job_and_wait(
                model_name="financial_anomaly_detector",
                data=payload,
                hyperparameters={"privacy_level": "high"}
            )
            
            return result
        except Exception as e:
            # Fallback to local simulated anomaly detection
            print(f"Error with Lilypad: {str(e)}. Using fallback anomaly detection.")
            return self._fallback_anomaly_detection(data)
    
    def _fallback_anomaly_detection(self, data):
        """
        Fallback method for anomaly detection when Lilypad is unavailable.
        This should only be used for development/testing.
        
        Args:
            data: Prepared financial data
            
        Returns:
            anomalies: Dictionary with detected anomalies
        """
        # Extract data points from features
        features = data.get('features', [])
        dates = data.get('dates', [])
        
        if not features or not dates:
            return {"error": "Insufficient data for anomaly detection"}
        
        # Convert features to DataFrame
        df = pd.DataFrame(features)
        df['date'] = dates
        
        if 'amount' not in df.columns:
            return {"error": "Amount data missing"}
        
        # Focus on expenses (negative amounts)
        expenses = df[df['amount'] < 0].copy()
        expenses['amount'] = expenses['amount'].abs()
        
        if len(expenses) == 0:
            return {"anomalies": []}
        
        # Calculate z-scores for spending amounts
        mean_expense = expenses['amount'].mean()
        std_expense = expenses['amount'].std() or 1.0  # Avoid division by zero
        
        expenses['z_score'] = (expenses['amount'] - mean_expense) / std_expense
        
        # Identify anomalies as expenses with z-score > 2.5
        anomalies = expenses[expenses['z_score'] > 2.5]
        
        # Format results
        anomaly_results = []
        for _, row in anomalies.iterrows():
            anomaly_results.append({
                "date": row['date'],
                "amount": -1 * row['amount'],  # Convert back to negative
                "z_score": row['z_score'],
                "severity": "high" if row['z_score'] > 3.5 else "medium"
            })
        
        return {
            "anomalies": anomaly_results,
            "metadata": {
                "model": "fallback_anomaly_detector",
                "threshold": 2.5,
                "mean_expense": mean_expense,
                "std_expense": std_expense
            }
        }
    
    def categorize_uncategorized(self, data):
        """
        Suggest categories for uncategorized transactions using Lilypad's ZK-ML.
        
        Args:
            data: Prepared financial data with uncategorized transactions
            
        Returns:
            suggestions: Dictionary with category suggestions
        """
        # Prepare the payload for Lilypad
        payload = {
            "data": data,
            "task": "classification",
            "parameters": {
                "target": "category_code"
            }
        }
        
        try:
            # Submit the job to Lilypad for zero-knowledge processing
            result = self.lilypad_client.run_ml_job_and_wait(
                model_name="transaction_categorizer",
                data=payload,
                hyperparameters={"privacy_level": "high"}
            )
            
            return result
        except Exception as e:
            # Fallback to simple category suggestion
            print(f"Error with Lilypad: {str(e)}. Using fallback categorization.")
            return {"error": "Unable to categorize transactions through Lilypad. Please try again later."}
    
    def generate_savings_plan(self, data, target_savings):
        """
        Generate a savings plan based on spending patterns using Lilypad's ZK-ML.
        
        Args:
            data: Prepared financial data
            target_savings: Target monthly savings amount
            
        Returns:
            plan: Dictionary with savings plan
        """
        # Extract features and process
        features = data.get('features', [])
        category_mapping = data.get('category_mapping', {})
        
        if not features:
            return {"error": "Insufficient data for savings plan"}
        
        # Convert features to DataFrame
        df = pd.DataFrame(features)
        
        # Convert category_code back to category name
        inv_category_mapping = {v: k for k, v in category_mapping.items()}
        df['category'] = df['category_code'].map(inv_category_mapping)
        
        # Calculate current spending by category (expenses only)
        expenses = df[df['amount'] < 0].copy()
        expenses['amount'] = expenses['amount'].abs()
        
        if len(expenses) == 0:
            return {"error": "No expense data available for savings plan"}
        
        # Group by category
        category_spending = expenses.groupby('category')['amount'].agg(['sum', 'count', 'mean'])
        category_spending = category_spending.reset_index()
        
        # Calculate total monthly expenses
        days_in_data = df['days_since_first'].max() + 1
        months_in_data = max(days_in_data / 30, 1)
        monthly_expenses = expenses['amount'].sum() / months_in_data
        
        # Current monthly savings (if income data is available)
        income = df[df['amount'] > 0]['amount'].sum() / months_in_data if len(df[df['amount'] > 0]) > 0 else 0
        current_savings = income - monthly_expenses
        
        # Calculate savings gap
        savings_gap = target_savings - current_savings
        
        # If already meeting or exceeding target, return positive message
        if savings_gap <= 0:
            return {
                "status": "on_track",
                "message": "You're already meeting or exceeding your savings target!",
                "current_monthly_savings": current_savings,
                "target_savings": target_savings,
                "surplus": -savings_gap
            }
        
        # Generate recommendations based on category spending
        # Sort by total spending (highest first)
        category_spending = category_spending.sort_values('sum', ascending=False)
        
        # Calculate potential savings for each category (suggest 10-20% reduction)
        recommendations = []
        remaining_gap = savings_gap
        
        for _, row in category_spending.iterrows():
            category = row['category']
            monthly_cat_spend = row['sum'] / months_in_data
            
            # Skip categories with very small spending
            if monthly_cat_spend < 20:
                continue
            
            # Determine reduction percentage based on category and remaining gap
            if remaining_gap <= 0:
                break
                
            if category in ['Housing', 'Insurance', 'Utilities']:
                # Essential categories - suggest smaller reductions
                reduction_pct = 0.05
            elif category in ['Transportation', 'Groceries', 'Healthcare']:
                # Semi-essential - moderate reductions
                reduction_pct = 0.1
            else:
                # Discretionary - larger reductions
                reduction_pct = 0.2
            
            # Calculate potential savings from this category
            potential_savings = monthly_cat_spend * reduction_pct
            
            # Add recommendation
            recommendations.append({
                "category": category,
                "current_monthly_spending": monthly_cat_spend,
                "suggested_reduction_percent": reduction_pct * 100,
                "potential_monthly_savings": potential_savings,
                "tips": self._get_savings_tips(category)
            })
            
            remaining_gap -= potential_savings
        
        # Generate summary
        total_potential_savings = sum(r["potential_monthly_savings"] for r in recommendations)
        
        savings_plan = {
            "status": "gap" if total_potential_savings < savings_gap else "achievable",
            "current_monthly_income": income,
            "current_monthly_expenses": monthly_expenses,
            "current_monthly_savings": current_savings,
            "target_savings": target_savings,
            "savings_gap": savings_gap,
            "potential_savings": total_potential_savings,
            "recommendations": recommendations
        }
        
        return savings_plan
    
    def _get_savings_tips(self, category):
        """
        Provide category-specific savings tips.
        
        Args:
            category: Spending category
            
        Returns:
            tips: List of savings tips
        """
        tips_by_category = {
            "Food": [
                "Cook meals at home instead of eating out",
                "Meal prep for the week to avoid impulse food purchases",
                "Use grocery store loyalty programs and coupons"
            ],
            "Shopping": [
                "Implement a 24-hour rule before making non-essential purchases",
                "Look for second-hand options for clothing and household items",
                "Unsubscribe from retail marketing emails to reduce temptation"
            ],
            "Entertainment": [
                "Look for free or low-cost entertainment options in your area",
                "Share subscription services with family or friends",
                "Use your local library for books, movies, and other media"
            ],
            "Transportation": [
                "Consider carpooling, biking, or public transit when possible",
                "Combine errands to reduce fuel consumption",
                "Shop around for better auto insurance rates"
            ],
            "Subscriptions": [
                "Audit all your subscriptions and cancel unused ones",
                "Look for annual payment options that offer discounts",
                "Share subscription costs with family members"
            ],
            "Utilities": [
                "Install energy-efficient light bulbs and appliances",
                "Adjust your thermostat by a few degrees to save on heating/cooling",
                "Fix leaky faucets and use water-saving fixtures"
            ],
            "Groceries": [
                "Plan meals around sales and seasonal produce",
                "Buy staples in bulk when on sale",
                "Use a shopping list and avoid impulse purchases"
            ],
            "Housing": [
                "Refinance your mortgage if interest rates have dropped",
                "Consider a roommate to share housing costs",
                "Negotiate rent when renewing your lease"
            ]
        }
        
        # Return tips for the category or default tips
        return tips_by_category.get(category, [
            "Track your spending in this category to identify potential cuts",
            "Look for lower-cost alternatives that provide similar value",
            "Set a monthly budget for this category and stick to it"
        ])

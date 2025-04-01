import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import re
import json

class DataProcessor:
    """
    Utility class for processing financial data.
    """
    
    @staticmethod
    def clean_transaction_data(df):
        """
        Clean and standardize transaction data.
        
        Args:
            df: Pandas DataFrame with transaction data
            
        Returns:
            cleaned_df: Cleaned DataFrame
        """
        # Make a copy to avoid modifying the original
        cleaned_df = df.copy()
        
        # Ensure required columns exist
        required_columns = ['date', 'amount', 'description', 'category']
        for col in required_columns:
            if col not in cleaned_df.columns:
                if col == 'category':
                    cleaned_df['category'] = 'Uncategorized'
                else:
                    raise ValueError(f"Required column '{col}' is missing")
        
        # Convert date to datetime if it's not already
        if not pd.api.types.is_datetime64_any_dtype(cleaned_df['date']):
            cleaned_df['date'] = pd.to_datetime(cleaned_df['date'], errors='coerce')
        
        # Drop rows with invalid dates
        cleaned_df = cleaned_df.dropna(subset=['date'])
        
        # Ensure amount is numeric
        cleaned_df['amount'] = pd.to_numeric(cleaned_df['amount'], errors='coerce')
        
        # Drop rows with invalid amounts
        cleaned_df = cleaned_df.dropna(subset=['amount'])
        
        # Clean description text
        cleaned_df['description'] = cleaned_df['description'].str.strip().fillna('Unknown')
        
        # Standardize categories (uppercase first letter, strip whitespace)
        if 'category' in cleaned_df.columns:
            cleaned_df['category'] = cleaned_df['category'].str.strip().str.capitalize().fillna('Uncategorized')
        
        # Sort by date (newest first)
        cleaned_df = cleaned_df.sort_values('date', ascending=False)
        
        return cleaned_df
    
    @staticmethod
    def categorize_transactions(df, custom_categories=None):
        """
        Automatically categorize transactions based on description.
        
        Args:
            df: Pandas DataFrame with transaction data
            custom_categories: Optional dict mapping keywords to categories
            
        Returns:
            categorized_df: DataFrame with updated categories
        """
        # Default category mapping
        default_categories = {
            'salary|payroll|deposit': 'Income',
            'uber|lyft|taxi|transit|train|bus': 'Transportation',
            'restaurant|dining|food|breakfast|lunch|dinner|meal': 'Food',
            'grocery|supermarket|market': 'Groceries',
            'rent|mortgage|housing': 'Housing',
            'doctor|medical|pharmacy|health|dental': 'Healthcare',
            'gym|fitness|workout': 'Fitness',
            'amazon|shopping|store|retail': 'Shopping',
            'netflix|spotify|hulu|disney|subscription': 'Subscriptions',
            'insurance': 'Insurance',
            'utility|electric|gas|water|internet|phone|bill': 'Utilities',
            'education|tuition|school|college|university': 'Education',
            'entertainment|movie|game|theater': 'Entertainment',
            'transfer|zelle|venmo|paypal': 'Transfers',
            'gas|gasoline|fuel': 'Transportation',
            'travel|hotel|flight|airbnb': 'Travel'
        }
        
        # Use custom categories if provided
        if custom_categories:
            category_mapping = {**default_categories, **custom_categories}
        else:
            category_mapping = default_categories
        
        # Make a copy of the dataframe
        categorized_df = df.copy()
        
        # Add category column if it doesn't exist
        if 'category' not in categorized_df.columns:
            categorized_df['category'] = 'Uncategorized'
        
        # Function to determine category based on description
        def get_category(description):
            if pd.isna(description):
                return 'Uncategorized'
            
            description = description.lower()
            
            for pattern, category in category_mapping.items():
                if re.search(pattern, description):
                    return category
            
            return 'Uncategorized'
        
        # Only categorize uncategorized transactions
        mask = categorized_df['category'].isin(['Uncategorized', 'uncategorized', ''])
        categorized_df.loc[mask, 'category'] = categorized_df.loc[mask, 'description'].apply(get_category)
        
        return categorized_df
    
    @staticmethod
    def calculate_monthly_summary(df):
        """
        Calculate monthly income, expenses, and savings.
        
        Args:
            df: Pandas DataFrame with transaction data
            
        Returns:
            monthly_summary: DataFrame with monthly summary
        """
        # Ensure date is in datetime format
        df = df.copy()
        if not pd.api.types.is_datetime64_any_dtype(df['date']):
            df['date'] = pd.to_datetime(df['date'])
        
        # Create month column
        df['month'] = df['date'].dt.to_period('M')
        
        # Group by month and calculate summary
        monthly = df.groupby('month').agg({
            'amount': [
                ('income', lambda x: x[x > 0].sum()),
                ('expenses', lambda x: abs(x[x < 0].sum())),
                ('net', 'sum')
            ]
        })
        
        # Flatten the multi-index columns
        monthly.columns = [col[1] for col in monthly.columns]
        
        # Add savings rate
        monthly['savings_rate'] = (monthly['income'] - monthly['expenses']) / monthly['income'] * 100
        monthly['savings_rate'] = monthly['savings_rate'].fillna(0)
        
        # Reset index to convert Period to column
        monthly = monthly.reset_index()
        
        # Convert Period to string for easier handling
        monthly['month'] = monthly['month'].astype(str)
        
        return monthly
    
    @staticmethod
    def calculate_category_spending(df):
        """
        Calculate spending by category.
        
        Args:
            df: Pandas DataFrame with transaction data
            
        Returns:
            category_spending: DataFrame with spending by category
        """
        # Filter for expenses only (negative amounts)
        expenses = df[df['amount'] < 0].copy()
        
        # Group by category and sum expenses
        category_spending = expenses.groupby('category').agg({
            'amount': [
                ('total', lambda x: abs(x.sum())),
                ('count', 'count'),
                ('avg', lambda x: abs(x.mean()))
            ]
        })
        
        # Flatten the multi-index columns
        category_spending.columns = [col[1] for col in category_spending.columns]
        
        # Calculate percentage of total spending
        total_spending = category_spending['total'].sum()
        category_spending['percentage'] = (category_spending['total'] / total_spending * 100)
        
        # Reset index to convert category to column
        category_spending = category_spending.reset_index()
        
        # Sort by total spending (descending)
        category_spending = category_spending.sort_values('total', ascending=False)
        
        return category_spending
    
    @staticmethod
    def anonymize_data(df):
        """
        Anonymize sensitive data for ML processing.
        
        Args:
            df: Pandas DataFrame with transaction data
            
        Returns:
            anonymized_df: DataFrame with anonymized data
        """
        # Make a copy of the dataframe
        anonymized_df = df.copy()
        
        # Replace descriptions with generic text + hash
        import hashlib
        
        def anonymize_text(text):
            if pd.isna(text):
                return "Unknown"
            
            # Create a hash of the original text
            text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
            
            # Use category-based generic description
            for cat, text_prefix in {
                'Income': 'Income',
                'Transportation': 'Transport',
                'Food': 'Food',
                'Groceries': 'Grocery',
                'Housing': 'Housing',
                'Healthcare': 'Health',
                'Fitness': 'Fitness',
                'Shopping': 'Shopping',
                'Subscriptions': 'Subscription',
                'Insurance': 'Insurance',
                'Utilities': 'Utility',
                'Education': 'Education',
                'Entertainment': 'Entertainment',
                'Transfers': 'Transfer',
                'Travel': 'Travel'
            }.items():
                if cat.lower() in anonymized_df.loc[text == text, 'category'].values[0].lower():
                    return f"{text_prefix}-{text_hash}"
            
            return f"Transaction-{text_hash}"
        
        # Only anonymize if there are any descriptions to anonymize
        if 'description' in anonymized_df.columns:
            # This is more efficient than applying to each row
            unique_desc = anonymized_df['description'].unique()
            desc_map = {}
            
            for desc in unique_desc:
                if isinstance(desc, str):  # Check if description is a string
                    desc_map[desc] = anonymize_text(desc)
            
            anonymized_df['description'] = anonymized_df['description'].map(desc_map).fillna(anonymized_df['description'])
        
        return anonymized_df
    
    @staticmethod
    def prepare_for_ml(df):
        """
        Prepare data for machine learning analysis.
        
        Args:
            df: Pandas DataFrame with transaction data
            
        Returns:
            ml_ready_data: Dictionary with ML-ready data
        """
        # Anonymize data first
        anon_df = DataProcessor.anonymize_data(df)
        
        # Extract month and day of week
        anon_df['month'] = anon_df['date'].dt.month
        anon_df['day_of_week'] = anon_df['date'].dt.dayofweek
        
        # Create numeric features from categories
        from sklearn.preprocessing import LabelEncoder
        
        le = LabelEncoder()
        if 'category' in anon_df.columns:
            anon_df['category_code'] = le.fit_transform(anon_df['category'])
            category_mapping = dict(zip(le.classes_, range(len(le.classes_))))
        else:
            anon_df['category_code'] = 0
            category_mapping = {}
        
        # Calculate days since first transaction
        min_date = anon_df['date'].min()
        anon_df['days_since_first'] = (anon_df['date'] - min_date).dt.days
        
        # Select features for ML
        features = [
            'amount',
            'month',
            'day_of_week',
            'category_code',
            'days_since_first'
        ]
        
        # Ensure all selected features exist
        valid_features = [f for f in features if f in anon_df.columns]
        
        # Prepare JSON-serializable dictionary with features and metadata
        ml_data = {
            'features': anon_df[valid_features].to_dict(orient='records'),
            'dates': anon_df['date'].dt.strftime('%Y-%m-%d').tolist(),
            'category_mapping': category_mapping
        }
        
        return ml_data

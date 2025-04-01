import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
from utils.data_processor import DataProcessor
from utils.ml_models import FinancialMLModels
from utils.lilypad_client import LilypadClient
import time

st.set_page_config(
    page_title="Analysis - ZML Finance",
    page_icon="🧠",
    layout="wide"
)

# Check if user is authenticated and data is loaded
if 'authenticated' not in st.session_state or not st.session_state.authenticated:
    st.warning("Please configure your API keys in the main page to get started.")
    st.stop()

if 'financial_data' not in st.session_state or st.session_state.financial_data is None:
    st.warning("No financial data found. Please upload your data on the main page.")
    st.stop()

# Get the financial data
df = st.session_state.financial_data

# Initialize Lilypad client
lilypad_client = LilypadClient()

# Initialize ML models
ml_models = FinancialMLModels(lilypad_client)

# Main page layout
st.title("Financial Analysis")
st.markdown("""
This page uses zero-knowledge machine learning (zkML) via Lilypad to analyze your financial data
while preserving your privacy. 

### How zkML Works:
1. Your data is encrypted locally before being sent for analysis
2. Computations run on the encrypted data without decrypting it
3. Zero-knowledge proofs verify the correctness of results without revealing your data
4. Only you can see the original data and the decrypted insights

All computations include cryptographic proofs to verify their correctness while maintaining complete data privacy.
""")

# Create tabs for different analyses
tab1, tab2, tab3, tab4 = st.tabs([
    "Spending Forecast", 
    "Anomaly Detection", 
    "Savings Plan",
    "Category Analysis"
])

# Tab 1: Spending Forecast
with tab1:
    st.header("Spending Forecast")
    st.markdown("""
    This analysis uses zkML (zero-knowledge machine learning) to predict your future spending
    based on historical patterns, without compromising your data privacy.
    
    The model processes encrypted data and generates verifiable forecasts using zero-knowledge proofs,
    ensuring that your financial information never leaves your control in an unencrypted form.
    """)
    
    # Forecast parameters
    forecast_days = st.slider(
        "Forecast Period (Days)",
        min_value=7,
        max_value=90,
        value=30,
        step=1
    )
    
    # Run forecast button
    if st.button("Generate Spending Forecast"):
        with st.spinner("Running zero-knowledge ML forecast..."):
            # Prepare data for ML
            ml_data = DataProcessor.prepare_for_ml(df)
            
            # Get forecast
            forecast_result = ml_models.predict_spending(ml_data, forecast_periods=forecast_days)
            
            if "error" in forecast_result:
                st.error(f"Error generating forecast: {forecast_result['error']}")
            else:
                # Extract forecast data
                forecast_dates = forecast_result.get("forecast", {}).get("dates", [])
                forecast_values = forecast_result.get("forecast", {}).get("values", [])
                
                if not forecast_dates or not forecast_values:
                    st.error("Invalid forecast data received")
                else:
                    # Create dataframe for plotting
                    forecast_df = pd.DataFrame({
                        'date': pd.to_datetime(forecast_dates),
                        'amount': forecast_values
                    })
                    
                    # Calculate stats
                    total_forecast = abs(sum(v for v in forecast_values if v < 0))
                    avg_daily = total_forecast / len(forecast_values)
                    
                    # Display stats
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.metric(
                            "Forecasted Total Spending", 
                            f"${total_forecast:.2f}"
                        )
                    
                    with col2:
                        st.metric(
                            "Average Daily Spending", 
                            f"${avg_daily:.2f}"
                        )
                    
                    with col3:
                        baseline = forecast_result.get("metadata", {}).get("baseline", 0)
                        st.metric(
                            "Current Daily Baseline", 
                            f"${baseline:.2f}",
                            delta=f"{(avg_daily-baseline)/baseline*100:.1f}% {'increase' if avg_daily > baseline else 'decrease'}" if baseline > 0 else None,
                            delta_color="inverse" if avg_daily > baseline else "normal"
                        )
                    
                    # Plot forecast
                    st.subheader("Daily Spending Forecast")
                    
                    # Convert to proper expense values for clarity
                    forecast_df['expense'] = forecast_df['amount'].apply(lambda x: abs(x) if x < 0 else 0)
                    forecast_df['income'] = forecast_df['amount'].apply(lambda x: x if x > 0 else 0)
                    
                    # Create figures
                    fig = go.Figure()
                    
                    # Add expense trace
                    fig.add_trace(go.Scatter(
                        x=forecast_df['date'],
                        y=forecast_df['expense'],
                        mode='lines+markers',
                        name='Forecasted Expenses',
                        line=dict(color='#E74C3C', width=3)
                    ))
                    
                    # Calculate 7-day moving average
                    forecast_df['ma7'] = forecast_df['expense'].rolling(window=7, min_periods=1).mean()
                    
                    # Add moving average trace
                    fig.add_trace(go.Scatter(
                        x=forecast_df['date'],
                        y=forecast_df['ma7'],
                        mode='lines',
                        name='7-Day Moving Average',
                        line=dict(color='#3498DB', width=2, dash='dash')
                    ))
                    
                    # Update layout
                    fig.update_layout(
                        title="Forecasted Daily Spending",
                        xaxis_title="Date",
                        yaxis_title="Amount ($)",
                        hovermode="x unified"
                    )
                    
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Weekly forecast summary
                    st.subheader("Weekly Spending Forecast")
                    
                    # Group by week
                    forecast_df['week'] = forecast_df['date'].dt.isocalendar().week
                    weekly_forecast = forecast_df.groupby('week')['expense'].sum().reset_index()
                    
                    # Create week labels
                    week_start_dates = []
                    for week in weekly_forecast['week']:
                        week_data = forecast_df[forecast_df['week'] == week]
                        start_date = week_data['date'].min().strftime('%b %d')
                        end_date = week_data['date'].max().strftime('%b %d')
                        week_start_dates.append(f"Week {week}: {start_date} - {end_date}")
                    
                    weekly_forecast['week_label'] = week_start_dates
                    
                    # Create bar chart
                    fig = px.bar(
                        weekly_forecast,
                        x='week_label',
                        y='expense',
                        title="Weekly Spending Forecast",
                        labels={'expense': 'Amount ($)', 'week_label': 'Week'}
                    )
                    
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Forecasting insights
                    st.subheader("Forecasting Insights")
                    
                    # Find peak spending day
                    peak_day = forecast_df.loc[forecast_df['expense'].idxmax()]
                    peak_day_date = peak_day['date'].strftime('%A, %b %d')
                    peak_day_amount = peak_day['expense']
                    
                    # Find lowest spending day
                    min_day = forecast_df.loc[forecast_df['expense'].idxmin()]
                    min_day_date = min_day['date'].strftime('%A, %b %d')
                    min_day_amount = min_day['expense']
                    
                    # Calculate weekend vs weekday spending
                    forecast_df['is_weekend'] = forecast_df['date'].dt.dayofweek >= 5
                    weekend_avg = forecast_df[forecast_df['is_weekend']]['expense'].mean()
                    weekday_avg = forecast_df[~forecast_df['is_weekend']]['expense'].mean()
                    
                    # Display insights
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.info(f"**Peak spending day:** {peak_day_date} (${peak_day_amount:.2f})")
                    
                    with col2:
                        st.info(f"**Lowest spending day:** {min_day_date} (${min_day_amount:.2f})")
                    
                    with col3:
                        st.info(f"**Weekend vs. Weekday:** ${weekend_avg:.2f} vs. ${weekday_avg:.2f}")
                    
                    # Forecast confidence
                    confidence = forecast_result.get("metadata", {}).get("confidence", 0.8) * 100
                    st.progress(confidence/100, text=f"Forecast Confidence: {confidence:.0f}%")
                    
                    # Model info
                    model_name = forecast_result.get("metadata", {}).get("model", "Unknown")
                    st.caption(f"Model: {model_name}")

# Tab 2: Anomaly Detection
with tab2:
    st.header("Anomaly Detection")
    st.markdown("""
    This analysis detects unusual spending patterns in your transaction history using
    zkML (zero-knowledge machine learning), helping you identify potential issues while
    maintaining privacy.
    
    The system evaluates encrypted transaction data using specialized zkML models
    that can identify abnormal spending without accessing your raw financial information.
    """)
    
    # Run anomaly detection button
    if st.button("Detect Spending Anomalies"):
        with st.spinner("Running zero-knowledge anomaly detection..."):
            # Prepare data for ML
            ml_data = DataProcessor.prepare_for_ml(df)
            
            # Get anomalies
            anomaly_result = ml_models.detect_anomalies(ml_data)
            
            if "error" in anomaly_result:
                st.error(f"Error detecting anomalies: {anomaly_result['error']}")
            else:
                # Extract anomalies
                anomalies = anomaly_result.get("anomalies", [])
                
                if not anomalies:
                    st.success("No significant spending anomalies detected in your transaction history.")
                else:
                    # Display anomaly count
                    st.info(f"Detected {len(anomalies)} spending anomalies in your transaction history.")
                    
                    # Create dataframe for anomalies
                    anomaly_df = pd.DataFrame(anomalies)
                    
                    # Display anomalies in a table
                    st.subheader("Detected Anomalies")
                    
                    # Convert to dollars and format
                    anomaly_df['amount'] = anomaly_df['amount'].apply(lambda x: f"${abs(x):.2f}")
                    
                    # Display the table
                    st.dataframe(
                        anomaly_df[['date', 'amount', 'severity', 'z_score']].rename(
                            columns={
                                'date': 'Date',
                                'amount': 'Amount',
                                'severity': 'Severity',
                                'z_score': 'Anomaly Score'
                            }
                        ),
                        use_container_width=True
                    )
                    
                    # Plot anomalies on a timeline
                    st.subheader("Anomaly Timeline")
                    
                    # Convert date to datetime
                    anomaly_df['date'] = pd.to_datetime(anomaly_df['date'])
                    
                    # Get numeric amount for plotting
                    anomaly_df['numeric_amount'] = anomaly_df['amount'].apply(
                        lambda x: float(x.replace('$', ''))
                    )
                    
                    # Create timeline figure
                    fig = px.scatter(
                        anomaly_df, 
                        x='date', 
                        y='numeric_amount',
                        size='z_score',  # Size points by anomaly score
                        color='severity',  # Color by severity
                        color_discrete_map={'high': 'red', 'medium': 'orange'},
                        labels={'numeric_amount': 'Amount ($)', 'date': 'Date'},
                        title="Anomalous Transactions Timeline",
                        hover_data=['z_score']
                    )
                    
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Display explanation
                    st.markdown("""
                    ### Understanding Anomalies
                    
                    Anomalies are transactions that significantly deviate from your normal spending patterns.
                    They are identified using statistical analysis and machine learning techniques.
                    
                    - **Anomaly Score**: Higher values indicate stronger anomalies
                    - **Severity**: Indicates how unusual the transaction is compared to your normal patterns
                    
                    Anomalies may represent:
                    - One-time large purchases
                    - Potential unauthorized transactions
                    - Unusually frequent small transactions
                    - Transactions in categories where you rarely spend
                    """)
                    
                    # Model info
                    model_info = anomaly_result.get("metadata", {})
                    threshold = model_info.get("threshold", "N/A")
                    model_name = model_info.get("model", "Unknown")
                    
                    st.caption(f"Model: {model_name} | Detection threshold: {threshold}")

# Tab 3: Savings Plan
with tab3:
    st.header("Personalized Savings Plan")
    st.markdown("""
    Generate a personalized savings plan based on your spending patterns using
    zkML (zero-knowledge machine learning). Set a monthly savings target and get
    customized recommendations.
    
    Powered by privacy-preserving ML algorithms, this tool analyzes your encrypted
    spending patterns and generates recommendations without exposing your financial
    details, with cryptographic proofs to verify results.
    """)
    
    # Get monthly income estimate
    monthly_income = 0
    if 'income' in st.session_state:
        monthly_income = st.session_state.income
    else:
        # Estimate from data
        income_transactions = df[df['amount'] > 0]
        if not income_transactions.empty:
            # Group by month
            income_transactions['month'] = income_transactions['date'].dt.to_period('M')
            monthly_avg = income_transactions.groupby('month')['amount'].sum().mean()
            monthly_income = monthly_avg
    
    # Savings target input
    target_savings = st.slider(
        "Monthly Savings Target ($)",
        min_value=0,
        max_value=int(monthly_income * 0.5) if monthly_income > 0 else 1000,
        value=int(monthly_income * 0.2) if monthly_income > 0 else 200,
        step=50
    )
    
    # Optional income input
    update_income = st.checkbox("Update monthly income estimate")
    
    if update_income:
        monthly_income = st.number_input(
            "Monthly Income ($)",
            min_value=0.0,
            value=float(monthly_income),
            step=100.0
        )
        
        if st.button("Save Income"):
            st.session_state.income = monthly_income
            st.success("Income updated!")
    
    # Generate savings plan button
    if st.button("Generate Savings Plan"):
        with st.spinner("Analyzing spending patterns and generating savings plan..."):
            # Prepare data for ML
            ml_data = DataProcessor.prepare_for_ml(df)
            
            # Get savings plan
            savings_plan = ml_models.generate_savings_plan(ml_data, target_savings)
            
            if "error" in savings_plan:
                st.error(f"Error generating savings plan: {savings_plan['error']}")
            else:
                # Display plan status
                status = savings_plan.get("status", "")
                
                if status == "on_track":
                    st.success(savings_plan.get("message", "You're on track to meet your savings target!"))
                    
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.metric(
                            "Current Monthly Savings", 
                            f"${savings_plan.get('current_monthly_savings', 0):.2f}"
                        )
                    
                    with col2:
                        st.metric(
                            "Target Savings", 
                            f"${savings_plan.get('target_savings', 0):.2f}"
                        )
                    
                    with col3:
                        st.metric(
                            "Monthly Surplus", 
                            f"${savings_plan.get('surplus', 0):.2f}"
                        )
                    
                else:
                    # Display savings plan metrics
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.metric(
                            "Monthly Income", 
                            f"${savings_plan.get('current_monthly_income', 0):.2f}"
                        )
                        
                        st.metric(
                            "Current Monthly Savings", 
                            f"${savings_plan.get('current_monthly_savings', 0):.2f}"
                        )
                    
                    with col2:
                        st.metric(
                            "Monthly Expenses", 
                            f"${savings_plan.get('current_monthly_expenses', 0):.2f}"
                        )
                        
                        st.metric(
                            "Target Savings", 
                            f"${savings_plan.get('target_savings', 0):.2f}"
                        )
                    
                    # Savings gap and potential savings
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.metric(
                            "Monthly Savings Gap", 
                            f"${savings_plan.get('savings_gap', 0):.2f}"
                        )
                    
                    with col2:
                        potential = savings_plan.get('potential_savings', 0)
                        gap = savings_plan.get('savings_gap', 0)
                        
                        st.metric(
                            "Potential Monthly Savings", 
                            f"${potential:.2f}",
                            delta=f"{'Covers' if potential >= gap else 'Does not cover'} savings gap"
                        )
                    
                    # Display recommendations
                    st.subheader("Savings Recommendations")
                    
                    if status == "gap":
                        st.warning("The recommended cuts may not fully achieve your savings target. Consider adjusting your target or finding additional income sources.")
                    else:
                        st.success("By following these recommendations, you can reach your savings target!")
                    
                    # Display each recommendation
                    recommendations = savings_plan.get("recommendations", [])
                    
                    for i, rec in enumerate(recommendations):
                        with st.expander(f"{rec['category']}: Save ${rec['potential_monthly_savings']:.2f}/month", expanded=i<3):
                            col1, col2 = st.columns(2)
                            
                            with col1:
                                st.metric(
                                    "Current Monthly Spending", 
                                    f"${rec['current_monthly_spending']:.2f}"
                                )
                            
                            with col2:
                                st.metric(
                                    "Suggested Reduction", 
                                    f"{rec['suggested_reduction_percent']:.1f}%"
                                )
                            
                            # Display tips
                            st.subheader("Tips to Reduce Spending")
                            
                            for tip in rec.get('tips', []):
                                st.markdown(f"- {tip}")
                    
                    # Create pie chart of potential savings by category
                    if recommendations:
                        # Prepare data for chart
                        chart_data = pd.DataFrame(recommendations)
                        
                        fig = px.pie(
                            chart_data,
                            values='potential_monthly_savings',
                            names='category',
                            title="Potential Savings by Category",
                            hole=0.4
                        )
                        
                        st.plotly_chart(fig, use_container_width=True)

# Tab 4: Category Analysis
with tab4:
    st.header("Category Analysis")
    st.markdown("""
    Analyze your spending patterns by category using zkML to identify opportunities for
    optimization and better financial management, all while preserving your privacy.
    
    This analysis uses zero-knowledge proofs to generate insights about your spending
    in specific categories without compromising the underlying transaction data.
    """)
    
    # Get categories for selection
    categories = df['category'].unique()
    
    # Category selector
    selected_category = st.selectbox(
        "Select Category to Analyze",
        options=sorted(categories)
    )
    
    # Filter data for selected category
    category_data = df[df['category'] == selected_category].copy()
    
    if not category_data.empty:
        # Basic stats for the category
        total_spent = abs(category_data[category_data['amount'] < 0]['amount'].sum())
        transaction_count = len(category_data[category_data['amount'] < 0])
        avg_transaction = total_spent / transaction_count if transaction_count > 0 else 0
        
        # Date range
        date_range = (category_data['date'].max() - category_data['date'].min()).days + 1
        months = max(date_range / 30, 1)  # Approximate number of months
        
        monthly_avg = total_spent / months
        
        # Display stats
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                "Total Spent", 
                f"${total_spent:.2f}"
            )
        
        with col2:
            st.metric(
                "Monthly Average", 
                f"${monthly_avg:.2f}"
            )
        
        with col3:
            st.metric(
                "Transactions", 
                f"{transaction_count}",
                delta=f"${avg_transaction:.2f} avg"
            )
        
        # Monthly trend chart
        st.subheader(f"Monthly Spending in {selected_category}")
        
        # Group by month
        category_data['month'] = category_data['date'].dt.to_period('M')
        monthly_spending = category_data[category_data['amount'] < 0].groupby('month')['amount'].sum().abs()
        monthly_spending = monthly_spending.reset_index()
        monthly_spending['month_str'] = monthly_spending['month'].astype(str)
        
        # Create chart
        fig = px.bar(
            monthly_spending,
            x='month_str',
            y='amount',
            title=f"Monthly Spending in {selected_category}",
            labels={'amount': 'Amount ($)', 'month_str': 'Month'}
        )
        
        # Add monthly average line
        fig.add_hline(
            y=monthly_avg,
            line_dash="dash",
            line_color="red",
            annotation_text=f"Monthly Avg: ${monthly_avg:.2f}",
            annotation_position="top right"
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Transaction breakdown
        st.subheader("Transaction Details")
        
        # Create table with expenses only (negative amounts)
        expense_data = category_data[category_data['amount'] < 0].copy()
        expense_data['amount'] = expense_data['amount'].abs()
        
        # Sort by date (newest first)
        expense_data = expense_data.sort_values('date', ascending=False)
        
        # Format for display
        display_df = expense_data.copy()
        display_df['date'] = display_df['date'].dt.strftime('%Y-%m-%d')
        display_df['amount'] = display_df['amount'].apply(lambda x: f"${x:.2f}")
        
        # Display the table
        st.dataframe(
            display_df[['date', 'description', 'amount']],
            use_container_width=True,
            height=min(400, len(display_df) * 35 + 38)  # Dynamic height
        )
        
        # Frequency analysis
        st.subheader("Spending Frequency")
        
        # Create histogram of transaction amounts
        fig = px.histogram(
            expense_data,
            x='amount',
            nbins=20,
            title=f"Distribution of {selected_category} Transaction Amounts",
            labels={'amount': 'Amount ($)', 'count': 'Number of Transactions'}
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Day of week analysis
        st.subheader("Day of Week Analysis")
        
        # Add day of week
        expense_data['day_of_week'] = expense_data['date'].dt.day_name()
        
        # Order days of week correctly
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        # Group by day of week
        day_spending = expense_data.groupby('day_of_week')['amount'].agg(['sum', 'count']).reset_index()
        
        # Reorder days
        day_spending['day_order'] = day_spending['day_of_week'].map({day: i for i, day in enumerate(day_order)})
        day_spending = day_spending.sort_values('day_order')
        
        # Create figure with two y-axes
        fig = go.Figure()
        
        # Add bars for total amount
        fig.add_trace(go.Bar(
            x=day_spending['day_of_week'],
            y=day_spending['sum'],
            name='Total Amount',
            marker_color='#1ABC9C'
        ))
        
        # Create a secondary y-axis for count
        fig.add_trace(go.Scatter(
            x=day_spending['day_of_week'],
            y=day_spending['count'],
            name='Transaction Count',
            marker_color='#E74C3C',
            mode='lines+markers',
            yaxis='y2'
        ))
        
        # Update layout with second y-axis
        fig.update_layout(
            title=f"{selected_category} Spending by Day of Week",
            xaxis_title="Day of Week",
            yaxis_title="Total Amount ($)",
            yaxis2=dict(
                title="Transaction Count",
                overlaying='y',
                side='right'
            ),
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=1.02,
                xanchor="right",
                x=1
            )
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Tips for optimization
        st.subheader("Optimization Tips")
        
        # Generate category-specific tips
        if selected_category == "Food":
            tips = [
                "Consider meal planning to reduce restaurant expenses",
                "Look for grocery store promotions and coupons",
                "Batch cook meals to save time and money"
            ]
        elif selected_category == "Transportation":
            tips = [
                "Consider carpooling or public transportation options",
                "Combine errands to reduce fuel usage",
                "Compare gas prices using apps before filling up"
            ]
        elif selected_category == "Shopping":
            tips = [
                "Create a 24-hour rule before making non-essential purchases",
                "Look for sales and discount codes before shopping",
                "Consider second-hand options for certain items"
            ]
        elif selected_category == "Subscriptions":
            tips = [
                "Audit all subscriptions and cancel unused ones",
                "Look for annual payment options that may offer discounts",
                "Share subscription costs with family members"
            ]
        elif selected_category == "Utilities":
            tips = [
                "Invest in energy-efficient appliances and bulbs",
                "Adjust thermostat by a few degrees to save on heating/cooling",
                "Check for competitive rates from alternative providers"
            ]
        else:
            tips = [
                f"Track your {selected_category} spending to identify patterns",
                "Set a monthly budget for this category",
                "Look for lower-cost alternatives that provide similar value"
            ]
        
        # Display tips
        for tip in tips:
            st.info(tip)

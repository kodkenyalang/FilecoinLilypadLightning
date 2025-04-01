import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
from utils.lighthouse_client import LighthouseClient
import os
import json

st.set_page_config(
    page_title="Budget - ZML Finance",
    page_icon="📝",
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

# Initialize Lighthouse client
lighthouse_client = LighthouseClient(st.session_state.lighthouse_api_key)

# Initialize budget session state if it doesn't exist
if 'budget' not in st.session_state:
    # Calculate default budgets based on historical spending
    expenses_df = df[df['amount'] < 0].copy()
    expenses_df['amount'] = expenses_df['amount'].abs()
    
    # Get unique categories and their average monthly spending
    today = pd.to_datetime(datetime.now().date())
    date_range = (today - df['date'].min()).days
    months = max(1, date_range / 30)  # Approximate number of months in the data
    
    category_budgets = {}
    
    if not expenses_df.empty:
        for category in expenses_df['category'].unique():
            category_total = expenses_df[expenses_df['category'] == category]['amount'].sum()
            monthly_avg = category_total / months
            # Round to nearest 10
            category_budgets[category] = round(monthly_avg / 10) * 10
    
    st.session_state.budget = category_budgets

# Save budget to Lighthouse
def save_budget():
    budget_data = {
        'budget': st.session_state.budget,
        'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Save to temporary file
    temp_file = "temp_budget.json"
    with open(temp_file, 'w') as f:
        json.dump(budget_data, f)
    
    try:
        cid = lighthouse_client.upload_file(temp_file)
        st.session_state.budget_cid = cid
        
        # Clean up temporary file
        if os.path.exists(temp_file):
            os.remove(temp_file)
            
        return True, cid
    except Exception as e:
        return False, str(e)

# Calculate current month's spending
def calculate_current_month_spending():
    today = pd.to_datetime(datetime.now().date())
    current_month_data = df[
        (df['date'].dt.year == today.year) & 
        (df['date'].dt.month == today.month)
    ]
    
    # Filter for expenses only
    expenses = current_month_data[current_month_data['amount'] < 0].copy()
    expenses['amount'] = expenses['amount'].abs()
    
    # Group by category
    category_spending = expenses.groupby('category')['amount'].sum()
    
    return category_spending

# Main page layout
st.title("Budget Planner")

# Tabs for different budget views
tab1, tab2, tab3 = st.tabs(["Budget Overview", "Set Budgets", "Budget Analysis"])

# Tab 1: Budget Overview
with tab1:
    st.header("Monthly Budget Overview")
    
    # Get current month's spending
    current_spending = calculate_current_month_spending()
    current_month = datetime.now().strftime('%B %Y')
    
    # Display current month and days remaining
    today = datetime.now().date()
    days_in_month = (datetime(today.year, today.month % 12 + 1, 1) - timedelta(days=1)).day
    days_remaining = days_in_month - today.day
    
    st.info(f"Current month: **{current_month}** • Days remaining: **{days_remaining}**")
    
    # Create progress bars for each category
    budget_data = []
    
    for category, budget in st.session_state.budget.items():
        spent = current_spending.get(category, 0)
        percentage = min(100, (spent / budget * 100)) if budget > 0 else 0
        remaining = max(0, budget - spent)
        
        budget_data.append({
            'category': category,
            'budget': budget,
            'spent': spent,
            'remaining': remaining,
            'percentage': percentage
        })
    
    # Sort categories by percentage spent (descending)
    budget_data = sorted(budget_data, key=lambda x: x['percentage'], reverse=True)
    
    # Create columns for stats
    col1, col2, col3 = st.columns(3)
    
    with col1:
        total_budget = sum(item['budget'] for item in budget_data)
        st.metric("Total Budget", f"${total_budget:.2f}")
    
    with col2:
        total_spent = sum(item['spent'] for item in budget_data)
        st.metric(
            "Total Spent", 
            f"${total_spent:.2f}", 
            delta=f"{total_spent/total_budget*100:.1f}% of budget" if total_budget > 0 else "N/A"
        )
    
    with col3:
        total_remaining = sum(item['remaining'] for item in budget_data)
        st.metric(
            "Remaining Budget", 
            f"${total_remaining:.2f}",
            delta=f"{days_remaining} days left"
        )
    
    # Display budget progress bars
    for item in budget_data:
        col1, col2 = st.columns([3, 1])
        
        with col1:
            # Determine color based on percentage
            color = "normal"
            if item['percentage'] >= 90:
                color = "error"
            elif item['percentage'] >= 75:
                color = "warning"
            
            # Display progress bar
            st.progress(item['percentage'] / 100, text=f"{item['category']}: ${item['spent']:.2f} of ${item['budget']:.2f} ({item['percentage']:.1f}%)")
        
        with col2:
            st.write(f"Remaining: **${item['remaining']:.2f}**")
    
    # Display budget visualization
    st.subheader("Budget Visualization")
    
    # Create DataFrame for plotting
    plot_data = pd.DataFrame(budget_data)
    
    if not plot_data.empty:
        # Budget vs spending chart
        fig = go.Figure()
        
        # Add budget bars
        fig.add_trace(go.Bar(
            x=plot_data['category'],
            y=plot_data['budget'],
            name='Budget',
            marker_color='rgba(26, 188, 156, 0.5)'
        ))
        
        # Add spending bars
        fig.add_trace(go.Bar(
            x=plot_data['category'],
            y=plot_data['spent'],
            name='Spent',
            marker_color='rgba(231, 76, 60, 0.8)'
        ))
        
        # Update layout
        fig.update_layout(
            title='Budget vs. Actual Spending by Category',
            xaxis_title='Category',
            yaxis_title='Amount ($)',
            barmode='overlay',
            xaxis={'categoryorder':'total descending'}
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Daily spending rate
        days_passed = today.day
        daily_spending_rate = total_spent / days_passed if days_passed > 0 else 0
        projected_total = daily_spending_rate * days_in_month
        
        st.subheader("Spending Projection")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric(
                "Daily Spending Rate", 
                f"${daily_spending_rate:.2f}",
                delta=f"${daily_spending_rate * days_remaining:.2f} projected for remaining days"
            )
        
        with col2:
            over_under = total_budget - projected_total
            st.metric(
                "Projected Month Total", 
                f"${projected_total:.2f}",
                delta=f"${over_under:.2f} {'' if over_under >= 0 else 'over budget'}",
                delta_color="normal" if over_under >= 0 else "inverse"
            )
        
        # Create gauge chart for overall budget
        fig = go.Figure(go.Indicator(
            mode="gauge+number+delta",
            value=total_spent,
            title={'text': "Monthly Budget Usage"},
            delta={'reference': total_budget, 'relative': True, 'valueformat': '.1%'},
            gauge={
                'axis': {'range': [None, total_budget * 1.2], 'tickformat': '$,.0f'},
                'bar': {'color': "darkblue"},
                'bgcolor': "white",
                'borderwidth': 2,
                'bordercolor': "gray",
                'steps': [
                    {'range': [0, total_budget * 0.7], 'color': 'lightgreen'},
                    {'range': [total_budget * 0.7, total_budget], 'color': 'lightyellow'},
                    {'range': [total_budget, total_budget * 1.2], 'color': 'lightcoral'}
                ],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': total_budget
                }
            }
        ))
        
        st.plotly_chart(fig, use_container_width=True)

# Tab 2: Set Budgets
with tab2:
    st.header("Set Monthly Budgets")
    
    # Get unique categories from transactions
    expense_categories = df[df['amount'] < 0]['category'].unique()
    
    # Create a form for budget setting
    with st.form("budget_form"):
        # Display explanation
        st.markdown("""
        Set your monthly budget for each spending category. These values will be used to track
        your spending against your budget goals.
        """)
        
        # Create budget input fields for each category
        budget_inputs = {}
        
        for category in sorted(expense_categories):
            current_budget = st.session_state.budget.get(category, 0)
            budget_inputs[category] = st.number_input(
                f"Budget for {category} ($)",
                min_value=0.0,
                value=float(current_budget),
                step=10.0
            )
        
        # Add option to add a new category
        st.markdown("---")
        st.subheader("Add New Budget Category")
        
        new_category = st.text_input("New Category Name")
        new_budget = st.number_input(
            "Budget Amount ($)",
            min_value=0.0,
            value=0.0,
            step=10.0
        )
        
        # Submit button
        submitted = st.form_submit_button("Save Budgets")
        
        if submitted:
            # Update budgets in session state
            for category, budget in budget_inputs.items():
                st.session_state.budget[category] = budget
            
            # Add new category if provided
            if new_category and new_category not in st.session_state.budget:
                st.session_state.budget[new_category] = new_budget
            
            # Save to Lighthouse
            success, result = save_budget()
            
            if success:
                st.success(f"Budgets saved successfully! Data saved to Lighthouse (CID: {result})")
            else:
                st.error(f"Error saving budgets: {result}")

# Tab 3: Budget Analysis
with tab3:
    st.header("Budget Analysis")
    
    # Get historical data
    months = sorted(df['date'].dt.to_period('M').unique())
    months_str = [str(m) for m in months]
    
    if len(months_str) <= 1:
        st.info("Need at least two months of data for historical budget analysis.")
    else:
        # Group by month and category
        df['month'] = df['date'].dt.to_period('M')
        expenses = df[df['amount'] < 0].copy()
        expenses['amount'] = expenses['amount'].abs()
        
        monthly_category_spending = expenses.groupby(['month', 'category'])['amount'].sum().reset_index()
        
        # Compare with budget
        st.subheader("Monthly Category Spending")
        
        # Create selection for category
        selected_category = st.selectbox(
            "Select Category",
            options=sorted(expenses['category'].unique())
        )
        
        # Filter for selected category
        category_data = monthly_category_spending[monthly_category_spending['category'] == selected_category]
        
        if not category_data.empty:
            # Get budget for this category
            category_budget = st.session_state.budget.get(selected_category, 0)
            
            # Create chart
            fig = px.bar(
                category_data,
                x='month',
                y='amount',
                title=f"Monthly Spending for {selected_category}",
                labels={'amount': 'Amount ($)', 'month': 'Month'}
            )
            
            # Add budget line if budget exists
            if category_budget > 0:
                fig.add_hline(
                    y=category_budget,
                    line_dash="dash",
                    line_color="red",
                    annotation_text=f"Budget: ${category_budget}",
                    annotation_position="top right"
                )
            
            st.plotly_chart(fig, use_container_width=True)
            
            # Calculate statistics
            avg_spending = category_data['amount'].mean()
            max_spending = category_data['amount'].max()
            min_spending = category_data['amount'].min()
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Average Monthly Spending", f"${avg_spending:.2f}")
            
            with col2:
                st.metric("Maximum Monthly Spending", f"${max_spending:.2f}")
            
            with col3:
                st.metric("Minimum Monthly Spending", f"${min_spending:.2f}")
            
            if category_budget > 0:
                avg_difference = category_budget - avg_spending
                st.metric(
                    "Average vs. Budget", 
                    f"${abs(avg_difference):.2f}",
                    delta=f"{'Under' if avg_difference >= 0 else 'Over'} budget on average",
                    delta_color="normal" if avg_difference >= 0 else "inverse"
                )
        
        # Overall budget trend
        st.subheader("Overall Monthly Spending")
        
        # Group by month
        monthly_total = expenses.groupby('month')['amount'].sum().reset_index()
        
        # Convert month to string for better display
        monthly_total['month_str'] = monthly_total['month'].astype(str)
        
        # Calculate total budget for expenses
        total_monthly_budget = sum(st.session_state.budget.values())
        
        # Create chart
        fig = px.line(
            monthly_total,
            x='month_str',
            y='amount',
            markers=True,
            title="Total Monthly Spending",
            labels={'amount': 'Amount ($)', 'month_str': 'Month'}
        )
        
        # Add budget line
        fig.add_hline(
            y=total_monthly_budget,
            line_dash="dash",
            line_color="red",
            annotation_text=f"Total Budget: ${total_monthly_budget}",
            annotation_position="top right"
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Budget recommendations based on historical data
        st.subheader("Budget Recommendations")
        
        # Calculate average spending by category
        avg_by_category = expenses.groupby('category')['amount'].mean().reset_index()
        avg_by_category = avg_by_category.rename(columns={'amount': 'avg_spending'})
        
        # Compare with current budgets
        recommendations = []
        
        for _, row in avg_by_category.iterrows():
            category = row['category']
            avg_spending = row['avg_spending']
            current_budget = st.session_state.budget.get(category, 0)
            
            if current_budget == 0:
                # No budget set
                recommendations.append({
                    'category': category,
                    'avg_spending': avg_spending,
                    'current_budget': current_budget,
                    'recommended_budget': round(avg_spending / 10) * 10,  # Round to nearest 10
                    'recommendation': "Set a budget based on historical spending"
                })
            elif avg_spending > current_budget * 1.2:
                # Significantly over budget
                recommendations.append({
                    'category': category,
                    'avg_spending': avg_spending,
                    'current_budget': current_budget,
                    'recommended_budget': round(avg_spending / 10) * 10,
                    'recommendation': "Increase budget to match actual spending or reduce spending"
                })
            elif avg_spending < current_budget * 0.8:
                # Significantly under budget
                recommendations.append({
                    'category': category,
                    'avg_spending': avg_spending,
                    'current_budget': current_budget,
                    'recommended_budget': round(avg_spending / 10) * 10,
                    'recommendation': "Consider reducing budget to free up funds for other categories"
                })
        
        if recommendations:
            # Display recommendations
            for rec in recommendations:
                st.info(f"**{rec['category']}**: {rec['recommendation']}. Average spending: ${rec['avg_spending']:.2f}, Current budget: ${rec['current_budget']:.2f}, Recommended: ${rec['recommended_budget']:.2f}")
        else:
            st.success("Your budgets appear to be well-aligned with your spending patterns.")

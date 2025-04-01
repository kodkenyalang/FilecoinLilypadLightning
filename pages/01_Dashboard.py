import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from utils.data_processor import DataProcessor

st.set_page_config(
    page_title="Dashboard - ZML Finance",
    page_icon="📊",
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

# Function to create donut chart for income vs expenses
def create_income_vs_expenses_chart(df):
    # Calculate total income and expenses
    income = df[df["amount"] > 0]["amount"].sum()
    expenses = abs(df[df["amount"] < 0]["amount"].sum())
    
    # Create data for the donut chart
    labels = ['Income', 'Expenses']
    values = [income, expenses]
    colors = ['#1ABC9C', '#E74C3C']
    
    # Create the donut chart
    fig = go.Figure(data=[go.Pie(
        labels=labels,
        values=values,
        hole=.6,
        marker_colors=colors
    )])
    
    fig.update_layout(
        showlegend=True,
        margin=dict(t=0, b=0, l=0, r=0),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="center", x=0.5),
        annotations=[dict(text=f"<b>${income - expenses:.2f}</b><br>Net", x=0.5, y=0.5, font_size=16, showarrow=False)]
    )
    
    return fig

# Function to create spending by category chart
def create_spending_by_category_chart(df):
    # Get category spending
    category_spending = DataProcessor.calculate_category_spending(df)
    
    # Create the bar chart
    fig = px.bar(
        category_spending.head(8),  # Top 8 categories
        x='category',
        y='total',
        color='category',
        labels={'total': 'Amount ($)', 'category': 'Category'},
        title="Top Spending Categories"
    )
    
    fig.update_layout(showlegend=False, xaxis_tickangle=-45)
    
    return fig

# Function to create monthly trend chart
def create_monthly_trend_chart(df):
    # Get monthly summary
    monthly_summary = DataProcessor.calculate_monthly_summary(df)
    
    # Convert month to datetime for better x-axis display
    monthly_summary['month_dt'] = pd.to_datetime(monthly_summary['month'])
    
    # Sort by month
    monthly_summary = monthly_summary.sort_values('month_dt')
    
    # Create the line chart
    fig = go.Figure()
    
    # Add income line
    fig.add_trace(go.Scatter(
        x=monthly_summary['month_dt'],
        y=monthly_summary['income'],
        mode='lines+markers',
        name='Income',
        line=dict(color='#1ABC9C', width=3)
    ))
    
    # Add expenses line
    fig.add_trace(go.Scatter(
        x=monthly_summary['month_dt'],
        y=monthly_summary['expenses'],
        mode='lines+markers',
        name='Expenses',
        line=dict(color='#E74C3C', width=3)
    ))
    
    # Add net line
    fig.add_trace(go.Scatter(
        x=monthly_summary['month_dt'],
        y=monthly_summary['net'],
        mode='lines+markers',
        name='Net',
        line=dict(color='#3498DB', width=3)
    ))
    
    # Update layout
    fig.update_layout(
        title="Monthly Financial Trend",
        xaxis_title="Month",
        yaxis_title="Amount ($)",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="center", x=0.5),
        margin=dict(l=20, r=20, t=40, b=20),
    )
    
    return fig

# Function to create recent transactions table
def display_recent_transactions(df, num_transactions=5):
    st.subheader("Recent Transactions")
    
    # Sort by date (most recent first)
    recent_df = df.sort_values('date', ascending=False).head(num_transactions)
    
    # Format for display
    display_df = recent_df.copy()
    display_df['date'] = display_df['date'].dt.strftime('%Y-%m-%d')
    display_df['amount'] = display_df['amount'].apply(lambda x: f"${x:.2f}")
    
    # Display the table
    st.dataframe(
        display_df[['date', 'description', 'category', 'amount']], 
        use_container_width=True,
        column_config={
            "date": "Date",
            "description": "Description",
            "category": "Category",
            "amount": "Amount"
        }
    )

# Main dashboard layout
st.title("Financial Dashboard")

# Basic stats at the top
total_income = df[df["amount"] > 0]["amount"].sum()
total_expenses = abs(df[df["amount"] < 0]["amount"].sum())
balance = total_income - total_expenses
num_transactions = len(df)

# Display stats in columns
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Total Balance",
        f"${balance:.2f}",
        delta=f"{(balance/total_income*100):.1f}% of income" if total_income > 0 else "N/A"
    )

with col2:
    st.metric(
        "Total Income",
        f"${total_income:.2f}"
    )

with col3:
    st.metric(
        "Total Expenses",
        f"${total_expenses:.2f}",
        delta=f"{(total_expenses/total_income*100):.1f}% of income" if total_income > 0 else "N/A",
        delta_color="inverse"
    )

with col4:
    st.metric(
        "Transactions",
        f"{num_transactions}"
    )

# Main dashboard charts
col1, col2 = st.columns(2)

with col1:
    # Income vs expenses donut chart
    st.subheader("Income vs Expenses")
    income_vs_expenses_fig = create_income_vs_expenses_chart(df)
    st.plotly_chart(income_vs_expenses_fig, use_container_width=True)
    
    # Spending by category
    spending_by_category_fig = create_spending_by_category_chart(df)
    st.plotly_chart(spending_by_category_fig, use_container_width=True)

with col2:
    # Monthly trend chart
    monthly_trend_fig = create_monthly_trend_chart(df)
    st.plotly_chart(monthly_trend_fig, use_container_width=True)
    
    # Recent transactions table
    display_recent_transactions(df)

# Additional insights
st.subheader("Financial Insights")

# Calculate insights
category_spending = DataProcessor.calculate_category_spending(df)
top_category = category_spending.iloc[0]['category'] if not category_spending.empty else "N/A"
top_category_pct = category_spending.iloc[0]['percentage'] if not category_spending.empty else 0

# Average daily spending
daily_spending = df[df['amount'] < 0].groupby(df['date'].dt.date)['amount'].sum().mean()
daily_spending = abs(daily_spending) if not pd.isna(daily_spending) else 0

# Date range
date_range = (df['date'].max() - df['date'].min()).days + 1

# Display insights in expandable section
with st.expander("View Insights", expanded=True):
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.info(f"Your biggest spending category is **{top_category}** at **{top_category_pct:.1f}%** of total expenses.")
    
    with col2:
        st.info(f"Your average daily spending is **${daily_spending:.2f}**.")
    
    with col3:
        savings_rate = (total_income - total_expenses) / total_income * 100 if total_income > 0 else 0
        st.info(f"Your savings rate is **{savings_rate:.1f}%** of income.")
    
    # Additional context
    st.markdown(f"""
    **Analysis period:** {df['date'].min().strftime('%Y-%m-%d')} to {df['date'].max().strftime('%Y-%m-%d')} ({date_range} days)
    
    > 💰 **ZML Finance Tip:** Financial experts recommend a savings rate of at least 20% of your income.
    """)

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import os
import json
from datetime import datetime, timedelta
import time

# Custom CSS
def load_css():
    # Load main custom CSS
    with open(".streamlit/custom.css") as f:
        main_css = f.read()

    # Load dashboard-specific CSS
    with open(".streamlit/dashboard.css") as f:
        dashboard_css = f.read()

    # Combine and apply both CSS files
    st.markdown(f'<style>{main_css}\n{dashboard_css}</style>', unsafe_allow_html=True)

# Banner display
def display_banner():
    st.markdown("""
    <div class="banner">
        <div class="banner-content">
            <h1>FinSecure</h1>
            <p>Personal finance with zero-knowledge machine learning</p>
        </div>
        <div class="banner-badges">
            <div class="badge">
                <span class="badge-icon">🔒</span>
                <span class="badge-text">zkML</span>
            </div>
            <div class="badge">
                <span class="badge-icon">⛓️</span>
                <span class="badge-text">Filecoin</span>
            </div>
            <div class="badge">
                <span class="badge-icon">🔐</span>
                <span class="badge-text">Lighthouse</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Generate sample data
def generate_sample_data():
    # Dates for the last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    dates = pd.date_range(start=start_date, end=end_date, freq='D')

    # Categories
    categories = ['Housing', 'Food', 'Transportation', 'Utilities', 
                  'Entertainment', 'Shopping', 'Healthcare', 'Education', 
                  'Debt Payment', 'Savings', 'Income']

    # Create transactions with some patterns
    np.random.seed(42)  # For reproducibility

    transactions = []

    # Add recurring income (bi-weekly)
    for i in range(0, len(dates), 14):
        if i < len(dates):
            transactions.append({
                'date': dates[i],
                'description': 'Salary',
                'category': 'Income',
                'amount': np.random.normal(3500, 100)
            })

    # Add recurring expenses
    for i in range(0, len(dates), 30):
        if i < len(dates):
            # Rent/Mortgage
            transactions.append({
                'date': dates[i],
                'description': 'Rent/Mortgage',
                'category': 'Housing',
                'amount': -np.random.normal(1200, 10)
            })

            # Utilities
            transactions.append({
                'date': dates[i + 1] if i + 1 < len(dates) else dates[-1],
                'description': 'Electric Bill',
                'category': 'Utilities',
                'amount': -np.random.normal(120, 20)
            })

            transactions.append({
                'date': dates[i + 2] if i + 2 < len(dates) else dates[-1],
                'description': 'Water Bill',
                'category': 'Utilities',
                'amount': -np.random.normal(80, 10)
            })

            transactions.append({
                'date': dates[i + 3] if i + 3 < len(dates) else dates[-1],
                'description': 'Internet',
                'category': 'Utilities',
                'amount': -np.random.normal(70, 5)
            })

    # Add random food expenses
    for i in range(0, len(dates), 4):
        if i < len(dates):
            transactions.append({
                'date': dates[i],
                'description': 'Grocery Shopping',
                'category': 'Food',
                'amount': -np.random.normal(120, 30)
            })

    # Add random restaurant expenses
    for i in range(0, len(dates), 10):
        if i < len(dates):
            transactions.append({
                'date': dates[i],
                'description': 'Restaurant',
                'category': 'Food',
                'amount': -np.random.normal(50, 20)
            })

    # Add random transportation expenses
    for i in range(0, len(dates), 7):
        if i < len(dates):
            transactions.append({
                'date': dates[i],
                'description': 'Gas',
                'category': 'Transportation',
                'amount': -np.random.normal(40, 10)
            })

    # Add random entertainment expenses
    for i in range(0, len(dates), 15):
        if i < len(dates):
            transactions.append({
                'date': dates[i],
                'description': 'Movie/Entertainment',
                'category': 'Entertainment',
                'amount': -np.random.normal(60, 20)
            })

    # Add random shopping expenses
    for i in range(0, len(dates), 20):
        if i < len(dates):
            transactions.append({
                'date': dates[i],
                'description': 'Online Shopping',
                'category': 'Shopping',
                'amount': -np.random.normal(80, 40)
            })

    # Convert to DataFrame and sort by date
    df = pd.DataFrame(transactions)
    df = df.sort_values('date', ascending=False)

    return df

# Placeholder functions -  These need to be implemented
def animated_progress(percent, text):
    st.markdown(f"<div style='width: 100%; height: 20px; background-color: #e0e0e0; border-radius: 5px;'><div style='width: {percent}%; height: 100%; background-color: #4CAF50; border-radius: 5px;'></div></div><p>{text}</p>", unsafe_allow_html=True)

def create_animated_metric(label, value, delta_label, prefix="$", animation_duration=0.8):
    st.metric(label=label, value=value, delta=delta_label, delta_color="normal")

def create_animated_balance_card(income, expenses):
    balance = income - expenses
    st.markdown(f"""
        <div class="balance-card">
            <div class="balance-title">Balance</div>
            <div class="balance-amount">${balance:,.2f}</div>
        </div>
    """, unsafe_allow_html=True)


def create_interactive_transaction_feed(df, num_items=5):
    recent_transactions = df.head(num_items).copy()
    recent_transactions['date'] = recent_transactions['date'].dt.strftime('%b %d, %Y')
    recent_transactions['amount'] = recent_transactions['amount'].apply(lambda x: f"${x:,.2f}")

    st.dataframe(recent_transactions)


# Main function
def main():
    st.set_page_config(
        page_title="FinSecure - Personal Finance with zkML",
        page_icon="💰",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Set maximum width for the page content and improve container layout
    st.markdown("""
        <style>
        .reportview-container .main .block-container {
            max-width: 1200px;
            padding: 1rem;
            margin: 0 auto;
        }
        
        /* Fix width constraints */
        .row-widget.stButton, div[data-testid="column"] {
            width: 100% !important;
        }
        
        /* Ensure charts and plots are contained */
        .stPlotlyChart, .stDataFrame {
            width: 100% !important;
            max-width: 100% !important;
        }
        </style>
    """, unsafe_allow_html=True)

    # Load custom CSS
    load_css()

    # Display loading animation
    with st.spinner("Loading your financial data..."):
        # Simulate data loading delay
        time.sleep(0.8)

    # Display banner with animation
    display_banner()

    # Create sidebar with navigation
    st.sidebar.title("Navigation")

    # Generate sample data (in a real app, this would come from a database)
    df = generate_sample_data()

    # Store the data in session state for use across pages
    if 'transactions_data' not in st.session_state:
        st.session_state.transactions_data = df

        # Show a success message the first time data is loaded
        st.success("✅ Financial data loaded successfully!")
        time.sleep(1)

    # Display info about the zkML approach
    st.markdown("<h2 class='fade-in'>Privacy-Preserving Finance</h2>", unsafe_allow_html=True)

    # Simulate a quick loading progress
    animated_progress(100, "Loading secure environment...")

    col1, col2 = st.columns([2, 1])

    with col1:
        st.markdown("""
        <div class="fade-in">
        FinSecure is a personal finance application that uses <strong>Zero-Knowledge Machine Learning (zkML)</strong> 
        to provide financial insights while ensuring complete privacy of your data. 

        <h3>Key Features:</h3>

        <ul>
            <li class="slide-in" style="animation-delay: 0.1s"><strong>Privacy-First Analysis</strong>: All data processing happens through zero-knowledge proofs, ensuring your financial information never leaves your control.</li>
            <li class="slide-in" style="animation-delay: 0.2s"><strong>Decentralized Storage</strong>: Your encrypted data is securely stored on Lighthouse and Filecoin, giving you full ownership.</li>
            <li class="slide-in" style="animation-delay: 0.3s"><strong>ML-Powered Insights</strong>: Get intelligent budget recommendations and spending alerts without compromising privacy.</li>
            <li class="slide-in" style="animation-delay: 0.4s"><strong>Anomaly Detection</strong>: Advanced machine learning identifies unusual spending patterns while maintaining confidentiality.</li>
        </ul>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        # Zero-knowledge info card
        st.markdown("""
        <div class="info-card hover-zoom fade-in" style="animation-delay: 0.2s">
            <div class="info-card-title">
                <span class="info-icon">🔒</span>
                <span>Zero-Knowledge Proofs</span>
            </div>
            <div class="info-card-content">
                Zero-knowledge proofs allow a prover to prove to a verifier that a statement is true, without revealing any information beyond the validity of the statement itself.
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Lighthouse info card
        st.markdown("""
        <div class="info-card hover-zoom fade-in" style="animation-delay: 0.4s">
            <div class="info-card-title">
                <span class="info-icon">🔐</span>
                <span>Lighthouse Storage</span>
            </div>
            <div class="info-card-content">
                Encrypted decentralized storage powered by Lighthouse.storage protocol, ensuring data ownership and security.
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Filecoin info card
        st.markdown("""
        <div class="info-card hover-zoom fade-in" style="animation-delay: 0.6s">
            <div class="info-card-title">
                <span class="info-icon">⛓️</span>
                <span>Filecoin Integration</span>
            </div>
            <div class="info-card-content">
                Storage deals are secured on the Filecoin blockchain for redundancy and permanence of your encrypted financial data.
            </div>
        </div>
        """, unsafe_allow_html=True)

    # Display sample financial metrics
    st.markdown("<h2 class='fade-in'>Financial Overview</h2>", unsafe_allow_html=True)

    # Calculate metrics
    total_income = df[df['amount'] > 0]['amount'].sum()
    total_expenses = abs(df[df['amount'] < 0]['amount'].sum())
    balance = total_income - total_expenses
    savings_rate = (balance / total_income) * 100 if total_income > 0 else 0

    # Display animated metrics
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        create_animated_metric("Total Income", total_income, "Last 6 months")

    with col2:
        create_animated_metric("Total Expenses", total_expenses, "Last 6 months")

    with col3:
        create_animated_metric("Balance", balance, f"{balance/6:,.2f}/month")

    with col4:
        create_animated_metric("Savings Rate", savings_rate, "of income", prefix="", animation_duration=1.0)

    # Display animated balance card
    create_animated_balance_card(total_income, total_expenses)

    # Display spending by category chart
    st.markdown("<h2 class='fade-in'>Spending Analysis</h2>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:
        # Display a loading spinner
        with st.spinner("Analyzing spending patterns..."):
            time.sleep(0.5)

        # Spending by category with animated chart
        expenses_by_category = df[df['amount'] < 0].groupby('category')['amount'].sum().abs().sort_values(ascending=False)

        # Create interactive pie chart
        fig = px.pie(
            names=expenses_by_category.index,
            values=expenses_by_category.values,
            title="Spending by Category",
            color_discrete_sequence=px.colors.qualitative.Vivid,
            hole=0.4
        )

        # Make it more interactive
        fig.update_traces(
            hoverinfo='label+percent+value',
            textinfo='label+percent',
            textfont_size=12,
            marker=dict(line=dict(color='#ffffff', width=2)),
            pull=[0.05 if i == 0 else 0 for i in range(len(expenses_by_category))],
        )

        fig.update_layout(
            legend=dict(orientation="h", y=-0.1),
            margin=dict(l=20, r=20, t=40, b=20),
            height=400,
            annotations=[dict(
                text=f'<b>Total</b><br>${expenses_by_category.sum():,.2f}',
                x=0.5, y=0.5,
                font_size=14,
                showarrow=False
            )],
            hoverlabel=dict(
                bgcolor="white",
                font_size=14
            )
        )

        st.plotly_chart(fig, use_container_width=True)

    with col2:
        # Display a loading spinner
        with st.spinner("Generating monthly trends..."):
            time.sleep(0.5)

        # Monthly income vs expenses
        monthly_df = df.copy()
        monthly_df['month'] = monthly_df['date'].dt.strftime('%Y-%m')
        monthly_income = monthly_df[monthly_df['amount'] > 0].groupby('month')['amount'].sum()
        monthly_expenses = monthly_df[monthly_df['amount'] < 0].groupby('month')['amount'].sum().abs()

        # Get unique months from both series
        months = sorted(list(set(monthly_income.index) | set(monthly_expenses.index)))

        # Create interactive bar chart
        fig = go.Figure()

        # Add income bars with hover effects
        fig.add_trace(go.Bar(
            x=months,
            y=[monthly_income.get(month, 0) for month in months],
            name="Income",
            marker_color='rgba(76, 175, 80, 0.8)',
            hovertemplate='Month: %{x}<br>Income: $%{y:,.2f}<extra></extra>',
            texttemplate='$%{y:,.0f}',
            textposition='outside'
        ))

        # Add expenses bars with hover effects
        fig.add_trace(go.Bar(
            x=months,
            y=[monthly_expenses.get(month, 0) for month in months],
            name="Expenses",
            marker_color='rgba(255, 87, 34, 0.8)',
            hovertemplate='Month: %{x}<br>Expenses: $%{y:,.2f}<extra></extra>',
            texttemplate='$%{y:,.0f}',
            textposition='outside'
        ))

        # Add a line for net income
        net_values = [monthly_income.get(month, 0) - monthly_expenses.get(month, 0) for month in months]
        fig.add_trace(go.Scatter(
            x=months,
            y=net_values,
            name="Net",
            mode='lines+markers',
            line=dict(color='rgba(33, 150, 243, 1)', width=3),
            marker=dict(size=8),
            hovertemplate='Month: %{x}<br>Net: $%{y:,.2f}<extra></extra>'
        ))

        # Update layout with better interactivity
        fig.update_layout(
            title={
                'text': "Monthly Income vs Expenses",
                'y': 0.9,
                'x': 0.5,
                'xanchor': 'center',
                'yanchor': 'top'
            },
            barmode='group',
            xaxis_title="Month",
            yaxis_title="Amount ($)",
            legend=dict(orientation="h", y=1.1, x=0.5, xanchor="center"),
            margin=dict(l=20, r=20, t=60, b=20),
            height=400,
            hovermode="x unified",
            hoverlabel=dict(
                bgcolor="white",
                font_size=14
            )
        )

        st.plotly_chart(fig, use_container_width=True)

    # Display recent transactions as interactive feed
    st.markdown("<h2 class='fade-in'>Recent Activity</h2>", unsafe_allow_html=True)

    # Display transactions using the interactive component
    create_interactive_transaction_feed(df, num_items=5)

# Run the application
if __name__ == "__main__":
    main()
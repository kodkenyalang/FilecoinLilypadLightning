
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time

def create_animated_metric(label, value, delta=None, prefix="$", animation_duration=1.5):
    """Creates an animated metric that counts up to the final value"""
    container = st.container()
    placeholder = container.empty()
    
    # Format the final value for display
    formatted_value = f"{prefix}{value:,.2f}" if isinstance(value, (int, float)) else value
    
    # Animation logic
    if isinstance(value, (int, float)):
        steps = 25
        delay = animation_duration / steps
        
        for i in range(steps + 1):
            progress = i / steps
            current_value = value * progress
            current_formatted = f"{prefix}{current_value:,.2f}"
            
            # Display metric with current value
            placeholder.metric(
                label=label,
                value=current_formatted,
                delta=delta
            )
            
            if i < steps:
                time.sleep(delay)
    else:
        # If not a number, just display the value
        placeholder.metric(
            label=label,
            value=formatted_value,
            delta=delta
        )
    
    return container

def pulse_animation_css():
    """Returns CSS for a pulsing animation effect"""
    return """
    <style>
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(94, 53, 177, 0.4);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(94, 53, 177, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(94, 53, 177, 0);
        }
    }
    
    .pulse-effect {
        animation: pulse 2s infinite;
    }
    
    .hover-zoom {
        transition: transform 0.3s ease;
    }
    
    .hover-zoom:hover {
        transform: scale(1.03);
    }
    
    .fade-in {
        animation: fadeIn 0.8s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .slide-in {
        animation: slideIn 0.8s ease-in-out;
    }
    
    @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .spin-loader {
        border: 5px solid var(--background-color);
        border-top: 5px solid var(--primary-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    </style>
    """

def animated_progress(percent, text=None):
    """Creates an animated progress bar"""
    if text:
        st.markdown(f"<p class='fade-in'>{text}</p>", unsafe_allow_html=True)
    
    # Create progress bar placeholder
    progress_placeholder = st.empty()
    
    # Animate progress
    for i in range(0, int(percent) + 1, 4):
        progress_placeholder.progress(min(i, 100))
        time.sleep(0.01)
    
    # Set final value
    progress_placeholder.progress(percent)

def create_animated_chart(df, chart_type="spending"):
    """Create a chart with animation and interactions"""
    if chart_type == "spending":
        # Prepare data
        expenses_by_category = df[df['amount'] < 0].groupby('category')['amount'].sum().abs().sort_values(ascending=False)
        
        # Create animated donut chart
        fig = go.Figure()
        
        fig.add_trace(go.Pie(
            labels=expenses_by_category.index,
            values=expenses_by_category.values,
            hole=0.4,
            textinfo='label+percent',
            marker=dict(
                colors=px.colors.qualitative.Vivid,
                line=dict(color='white', width=2)
            ),
            textfont=dict(size=14),
            hoverinfo='label+value+percent',
            hovertemplate='%{label}: $%{value:.2f} (%{percent})<extra></extra>'
        ))
        
        fig.update_layout(
            title={
                'text': "Spending by Category",
                'y': 0.95,
                'x': 0.5,
                'xanchor': 'center',
                'yanchor': 'top',
                'font': dict(size=20)
            },
            legend=dict(orientation="h", y=-0.1),
            margin=dict(l=20, r=20, t=60, b=20),
            height=400,
            annotations=[dict(
                text='<b>Total</b><br>$' + f"{expenses_by_category.sum():,.2f}",
                x=0.5, y=0.5,
                font_size=16,
                showarrow=False
            )],
            # Add animation settings
            updatemenus=[{
                'type': 'buttons',
                'showactive': False,
                'buttons': [
                    {
                        'label': 'Play',
                        'method': 'animate',
                        'args': [None, {
                            'frame': {'duration': 500, 'redraw': True},
                            'fromcurrent': True,
                            'mode': 'immediate',
                            'transition': {'duration': 500}
                        }]
                    }
                ],
                'x': 0.1,
                'y': 1.1,
            }]
        )
        
        # Add animation frames
        frames = []
        for i in range(0, 101, 10):
            scale = i / 100.0
            frame = go.Frame(
                data=[go.Pie(
                    labels=expenses_by_category.index,
                    values=expenses_by_category.values * scale,
                    hole=0.4,
                    textinfo='label+percent',
                    marker=dict(colors=px.colors.qualitative.Vivid)
                )],
                name=f'frame{i}'
            )
            frames.append(frame)
        
        fig.frames = frames
        
        return fig

def create_interactive_transaction_feed(df, num_items=5):
    """Creates an interactive feed of recent transactions"""
    if df.empty:
        st.info("No transactions available.")
        return
    
    # Sort transactions by date (most recent first)
    recent_df = df.sort_values('date', ascending=False).head(num_items).copy()
    
    # Format date
    recent_df['formatted_date'] = recent_df['date'].dt.strftime('%b %d, %Y')
    
    # Display each transaction as a card
    st.markdown("<h3 class='fade-in'>Recent Transactions</h3>", unsafe_allow_html=True)
    
    for i, (_, row) in enumerate(recent_df.iterrows()):
        amount = row['amount']
        is_positive = amount > 0
        amount_color = "positive" if is_positive else "negative"
        amount_prefix = "+" if is_positive else ""
        delay = i * 0.1  # Staggered animation delay
        
        # Generate a CSS class for the animation with a delay
        animation_class = f"slide-in"
        
        category_icon = "💰" if is_positive else get_category_icon(row['category'])
        
        st.markdown(f"""
        <div class="activity-item {animation_class} hover-zoom" style="animation-delay: {delay}s;">
            <div class="activity-icon">
                {category_icon}
            </div>
            <div class="activity-content">
                <div class="activity-title">{row['description']}</div>
                <div class="activity-subtitle">{row['category']} • {row['formatted_date']}</div>
            </div>
            <div class="activity-amount {amount_color}">{amount_prefix}${abs(amount):.2f}</div>
        </div>
        """, unsafe_allow_html=True)

def get_category_icon(category):
    """Returns an emoji icon for the given spending category"""
    icons = {
        'Housing': '🏠',
        'Food': '🍔',
        'Transportation': '🚗',
        'Utilities': '💡',
        'Entertainment': '🎭',
        'Shopping': '🛍️',
        'Healthcare': '⚕️',
        'Education': '📚',
        'Debt Payment': '💳',
        'Savings': '💰',
        'Income': '💵',
    }
    
    return icons.get(category, '💸')

def create_animated_balance_card(income, expenses):
    """Creates an animated card showing income vs expenses balance"""
    balance = income - expenses
    savings_rate = (balance / income) * 100 if income > 0 else 0
    
    st.markdown(pulse_animation_css(), unsafe_allow_html=True)
    
    # Create a card with the pulse effect if balance is positive
    card_class = "dashboard-card hover-zoom pulse-effect" if balance > 0 else "dashboard-card hover-zoom"
    
    st.markdown(f"""
    <div class="{card_class}">
        <div class="dashboard-card-title">
            <div class="dashboard-card-title-icon">💰</div>
            <div>Financial Balance</div>
        </div>
        <div class="quick-stat">
            <div class="quick-stat-icon">💵</div>
            <div class="quick-stat-content">
                <div class="quick-stat-label">Total Income</div>
                <div class="quick-stat-value">${income:,.2f}</div>
            </div>
        </div>
        <div class="quick-stat">
            <div class="quick-stat-icon">📉</div>
            <div class="quick-stat-content">
                <div class="quick-stat-label">Total Expenses</div>
                <div class="quick-stat-value">${expenses:,.2f}</div>
            </div>
        </div>
        <div class="quick-stat">
            <div class="quick-stat-icon">⚖️</div>
            <div class="quick-stat-content">
                <div class="quick-stat-label">Net Balance</div>
                <div class="quick-stat-value" style="color: {'green' if balance >= 0 else 'red'};">${balance:,.2f}</div>
                <div class="quick-stat-secondary">Savings Rate: {savings_rate:.1f}%</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

def loading_animation(seconds=1.5):
    """Displays a loading animation for the specified duration"""
    with st.spinner("Loading..."):
        time.sleep(seconds)

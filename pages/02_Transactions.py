import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import numpy as np
from utils.data_processor import DataProcessor
from utils.lighthouse_client import LighthouseClient
import os

st.set_page_config(
    page_title="Transactions - ZML Finance",
    page_icon="💸",
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

# Function to add new transaction
def add_transaction(date, description, amount, category):
    global df
    
    # Create new transaction
    new_transaction = pd.DataFrame({
        'date': [pd.to_datetime(date)],
        'description': [description],
        'amount': [amount],
        'category': [category]
    })
    
    # Add to existing dataframe
    df = pd.concat([new_transaction, df]).reset_index(drop=True)
    
    # Update session state
    st.session_state.financial_data = df
    
    # Save to Lighthouse
    temp_csv = "temp_financial_data.csv"
    df.to_csv(temp_csv, index=False)
    
    try:
        cid = lighthouse_client.upload_file(temp_csv)
        st.session_state.last_cid = cid
        
        # Clean up temp file
        if os.path.exists(temp_csv):
            os.remove(temp_csv)
            
        return True, cid
    except Exception as e:
        return False, str(e)

# Main page layout
st.title("Transactions")

# Add transaction section
with st.expander("Add New Transaction", expanded=False):
    st.subheader("Add New Transaction")
    
    col1, col2 = st.columns(2)
    
    with col1:
        transaction_date = st.date_input(
            "Date",
            value=datetime.now().date()
        )
        
        transaction_amount = st.number_input(
            "Amount ($)",
            value=0.0,
            step=0.01,
            help="Enter a positive value for income, negative for expenses"
        )
    
    with col2:
        transaction_description = st.text_input("Description")
        
        # Get unique categories from existing data
        existing_categories = sorted(df['category'].unique().tolist())
        transaction_category = st.selectbox(
            "Category",
            options=existing_categories + ["Add new category..."]
        )
        
        if transaction_category == "Add new category...":
            transaction_category = st.text_input("Enter new category")
    
    if st.button("Add Transaction"):
        if not transaction_description:
            st.error("Please enter a description")
        elif transaction_amount == 0:
            st.error("Amount cannot be zero")
        elif not transaction_category or transaction_category == "Add new category...":
            st.error("Please select or enter a category")
        else:
            success, result = add_transaction(
                transaction_date,
                transaction_description,
                transaction_amount,
                transaction_category
            )
            
            if success:
                st.success(f"Transaction added successfully! Data saved to Lighthouse (CID: {result})")
            else:
                st.error(f"Error saving transaction: {result}")

# Transactions filter section
st.subheader("Filter Transactions")

col1, col2, col3 = st.columns(3)

with col1:
    date_options = [
        "All Time",
        "Last 30 Days",
        "Last 90 Days",
        "This Month",
        "Last Month",
        "This Year",
        "Custom Range"
    ]
    date_filter = st.selectbox("Date Range", date_options)
    
    if date_filter == "Custom Range":
        start_date = st.date_input("Start Date", value=df['date'].min().date())
        end_date = st.date_input("End Date", value=df['date'].max().date())

with col2:
    transaction_type = st.selectbox(
        "Transaction Type",
        options=["All", "Income", "Expenses"]
    )

with col3:
    # Get categories for filter
    all_categories = sorted(df['category'].unique().tolist())
    selected_categories = st.multiselect(
        "Categories",
        options=all_categories,
        default=[]
    )

# Search bar
search_query = st.text_input("Search Transactions", placeholder="Search by description...")

# Apply filters
filtered_df = df.copy()

# Date filter
today = pd.to_datetime(datetime.now().date())
if date_filter == "Last 30 Days":
    filtered_df = filtered_df[filtered_df['date'] >= today - timedelta(days=30)]
elif date_filter == "Last 90 Days":
    filtered_df = filtered_df[filtered_df['date'] >= today - timedelta(days=90)]
elif date_filter == "This Month":
    filtered_df = filtered_df[
        (filtered_df['date'].dt.year == today.year) & 
        (filtered_df['date'].dt.month == today.month)
    ]
elif date_filter == "Last Month":
    last_month = today.replace(day=1) - timedelta(days=1)
    filtered_df = filtered_df[
        (filtered_df['date'].dt.year == last_month.year) & 
        (filtered_df['date'].dt.month == last_month.month)
    ]
elif date_filter == "This Year":
    filtered_df = filtered_df[filtered_df['date'].dt.year == today.year]
elif date_filter == "Custom Range":
    filtered_df = filtered_df[
        (filtered_df['date'].dt.date >= start_date) & 
        (filtered_df['date'].dt.date <= end_date)
    ]

# Transaction type filter
if transaction_type == "Income":
    filtered_df = filtered_df[filtered_df['amount'] > 0]
elif transaction_type == "Expenses":
    filtered_df = filtered_df[filtered_df['amount'] < 0]

# Category filter
if selected_categories:
    filtered_df = filtered_df[filtered_df['category'].isin(selected_categories)]

# Search filter
if search_query:
    filtered_df = filtered_df[filtered_df['description'].str.contains(search_query, case=False)]

# Display transaction statistics
income = filtered_df[filtered_df['amount'] > 0]['amount'].sum()
expenses = abs(filtered_df[filtered_df['amount'] < 0]['amount'].sum())
balance = income - expenses

# Display stats in columns
st.subheader("Transaction Summary")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Balance",
        f"${balance:.2f}"
    )

with col2:
    st.metric(
        "Income",
        f"${income:.2f}"
    )

with col3:
    st.metric(
        "Expenses",
        f"${expenses:.2f}"
    )

with col4:
    st.metric(
        "Transactions",
        f"{len(filtered_df)}"
    )

# Display transactions
st.subheader("Transactions")

if filtered_df.empty:
    st.info("No transactions match your filters.")
else:
    # Prepare dataframe for display
    display_df = filtered_df.copy()
    display_df['date'] = display_df['date'].dt.strftime('%Y-%m-%d')
    
    # Add color coding for amount
    def color_amount(val):
        try:
            amount = float(val.replace('$', ''))
            return 'color: green' if amount > 0 else 'color: red'
        except:
            return ''
    
    # Format amount column
    display_df['formatted_amount'] = display_df['amount'].apply(lambda x: f"${x:.2f}")
    
    # Display the table with pagination
    table_height = min(400, len(display_df) * 35 + 38)  # Dynamic height based on number of rows
    
    st.dataframe(
        display_df[['date', 'description', 'category', 'formatted_amount']].rename(
            columns={
                'date': 'Date',
                'description': 'Description',
                'category': 'Category',
                'formatted_amount': 'Amount'
            }
        ),
        use_container_width=True,
        height=table_height
    )
    
    # Download button for filtered transactions
    csv = filtered_df.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="Download Filtered Transactions",
        data=csv,
        file_name="filtered_transactions.csv",
        mime="text/csv",
    )
    
    # Data visualization based on filtered transactions
    st.subheader("Visualization")
    
    chart_type = st.radio(
        "Select Chart Type",
        options=["Transactions Over Time", "Category Breakdown"],
        horizontal=True
    )
    
    if chart_type == "Transactions Over Time":
        # Group by date
        daily_data = filtered_df.groupby(filtered_df['date'].dt.date).agg({
            'amount': [
                ('income', lambda x: x[x > 0].sum()),
                ('expenses', lambda x: abs(x[x < 0].sum())),
                ('net', 'sum')
            ]
        })
        
        # Flatten the column hierarchy
        daily_data.columns = daily_data.columns.droplevel(0)
        daily_data = daily_data.reset_index()
        
        # Create figure
        fig = px.line(
            daily_data,
            x='date',
            y=['income', 'expenses', 'net'],
            labels={'value': 'Amount ($)', 'date': 'Date', 'variable': 'Type'},
            title="Transactions Over Time",
            color_discrete_map={
                'income': '#1ABC9C',
                'expenses': '#E74C3C',
                'net': '#3498DB'
            }
        )
        
        st.plotly_chart(fig, use_container_width=True)
    else:
        # Category breakdown
        if transaction_type == "Income" or transaction_type == "All" and filtered_df[filtered_df['amount'] > 0].shape[0] > 0:
            # Income by category
            income_by_category = filtered_df[filtered_df['amount'] > 0].groupby('category')['amount'].sum().reset_index()
            income_by_category = income_by_category.sort_values('amount', ascending=False)
            
            fig = px.pie(
                income_by_category,
                values='amount',
                names='category',
                title="Income by Category",
                color_discrete_sequence=px.colors.sequential.Greens
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        if transaction_type == "Expenses" or transaction_type == "All" and filtered_df[filtered_df['amount'] < 0].shape[0] > 0:
            # Expenses by category
            expenses_by_category = filtered_df[filtered_df['amount'] < 0].copy()
            expenses_by_category['amount'] = expenses_by_category['amount'].abs()
            expenses_by_category = expenses_by_category.groupby('category')['amount'].sum().reset_index()
            expenses_by_category = expenses_by_category.sort_values('amount', ascending=False)
            
            fig = px.pie(
                expenses_by_category,
                values='amount',
                names='category',
                title="Expenses by Category",
                color_discrete_sequence=px.colors.sequential.Reds
            )
            
            st.plotly_chart(fig, use_container_width=True)

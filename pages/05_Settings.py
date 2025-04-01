import streamlit as st
import pandas as pd
import os
import json
from datetime import datetime
from utils.lighthouse_client import LighthouseClient
from utils.filecoin_client import FilecoinClient
from utils.data_processor import DataProcessor
import time

st.set_page_config(
    page_title="Settings - ZML Finance",
    page_icon="⚙️",
    layout="wide"
)

# Check if user is authenticated
if 'authenticated' not in st.session_state or not st.session_state.authenticated:
    st.warning("Please configure your API keys in the main page to get started.")
    st.stop()

# Initialize clients
lighthouse_client = LighthouseClient(st.session_state.lighthouse_api_key)
filecoin_client = FilecoinClient(st.session_state.lighthouse_api_key)

# Main page layout
st.title("Settings & Data Management")

# Create tabs for different settings
tab1, tab2, tab3, tab4 = st.tabs([
    "API Configuration", 
    "Data Management", 
    "Filecoin Storage",
    "App Information"
])

# Tab 1: API Configuration
with tab1:
    st.header("API Configuration")
    st.markdown("""
    Configure the API keys required for this application to function. These keys are used to 
    securely store your data on decentralized networks and to perform privacy-preserving
    machine learning analysis.
    """)
    
    with st.form("api_form"):
        # Lighthouse API Key
        lighthouse_api_key = st.text_input(
            "Lighthouse API Key",
            value=st.session_state.lighthouse_api_key,
            type="password",
            help="API key for Lighthouse.storage for decentralized storage"
        )
        
        # Lilypad API Key (optional)
        lilypad_api_key = st.text_input(
            "Lilypad API Key (Optional)",
            value=os.getenv("LILYPAD_API_KEY", ""),
            type="password",
            help="Optional API key for enhanced Lilypad.tech zML capabilities"
        )
        
        # Save button
        if st.form_submit_button("Save API Keys"):
            if lighthouse_api_key:
                st.session_state.lighthouse_api_key = lighthouse_api_key
                
                # Also update environment variable for Lilypad if provided
                if lilypad_api_key:
                    os.environ["LILYPAD_API_KEY"] = lilypad_api_key
                
                st.success("API keys saved successfully!")
            else:
                st.error("Lighthouse API Key is required")

# Tab 2: Data Management
with tab2:
    st.header("Data Management")
    
    # Data overview
    if 'financial_data' in st.session_state and st.session_state.financial_data is not None:
        df = st.session_state.financial_data
        
        st.subheader("Current Data Overview")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Total Transactions", len(df))
        
        with col2:
            date_range = (df['date'].max() - df['date'].min()).days + 1
            st.metric("Date Range", f"{date_range} days")
        
        with col3:
            categories = len(df['category'].unique())
            st.metric("Categories", categories)
        
        # Data management actions
        st.subheader("Data Actions")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Export data
            if st.button("Export Data to CSV"):
                csv = df.to_csv(index=False).encode('utf-8')
                
                st.download_button(
                    label="Download CSV",
                    data=csv,
                    file_name=f"financial_data_{datetime.now().strftime('%Y%m%d')}.csv",
                    mime="text/csv",
                )
        
        with col2:
            # Reset data
            if st.button("Reset All Data", help="This will delete all your financial data"):
                st.warning("Are you sure you want to delete all your financial data? This action cannot be undone.")
                
                confirm = st.button("Yes, delete all data")
                
                if confirm:
                    st.session_state.financial_data = None
                    st.session_state.data_loaded = False
                    st.session_state.last_cid = None
                    st.success("All data has been reset. You can upload new data from the home page.")
                    time.sleep(2)
                    st.rerun()
        
        # Backup and restore
        st.subheader("Backup Management")
        
        if st.button("Create Backup on Lighthouse"):
            with st.spinner("Creating backup..."):
                # Clean and anonymize data for secure backup
                cleaned_df = DataProcessor.clean_transaction_data(df)
                
                # Save to temp file and upload
                temp_file = f"backup_financial_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
                cleaned_df.to_csv(temp_file, index=False)
                
                try:
                    cid = lighthouse_client.upload_file(temp_file)
                    
                    # Clean up temp file
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                    
                    st.success(f"Backup created successfully! CID: {cid}")
                    st.info("Save this CID to restore your data later.")
                    
                    # Store in session state
                    if 'backups' not in st.session_state:
                        st.session_state.backups = []
                    
                    st.session_state.backups.append({
                        'cid': cid,
                        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'transactions': len(df)
                    })
                    
                except Exception as e:
                    st.error(f"Error creating backup: {str(e)}")
        
        # Restore from CID
        with st.expander("Restore from CID"):
            restore_cid = st.text_input("Enter Backup CID to Restore")
            
            if st.button("Restore Data") and restore_cid:
                with st.spinner("Restoring data from Lighthouse..."):
                    # Download from Lighthouse
                    temp_restore_file = "temp_restore.csv"
                    
                    try:
                        lighthouse_client.download_file(restore_cid, temp_restore_file)
                        
                        # Load the CSV
                        restored_df = pd.read_csv(temp_restore_file)
                        
                        # Convert date to datetime
                        restored_df['date'] = pd.to_datetime(restored_df['date'])
                        
                        # Update session state
                        st.session_state.financial_data = restored_df
                        st.session_state.data_loaded = True
                        st.session_state.last_cid = restore_cid
                        
                        # Clean up temp file
                        if os.path.exists(temp_restore_file):
                            os.remove(temp_restore_file)
                        
                        st.success(f"Data restored successfully! Loaded {len(restored_df)} transactions.")
                        time.sleep(2)
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error restoring data: {str(e)}")
        
        # Previous backups
        if 'backups' in st.session_state and st.session_state.backups:
            st.subheader("Previous Backups")
            
            # Create dataframe for display
            backup_df = pd.DataFrame(st.session_state.backups)
            
            st.dataframe(
                backup_df,
                column_config={
                    "cid": "CID",
                    "timestamp": "Backup Time",
                    "transactions": "Transactions"
                },
                use_container_width=True
            )
    else:
        st.info("No financial data loaded. Please upload your data on the home page.")

# Tab 3: Filecoin Storage
with tab3:
    st.header("Filecoin Long-term Storage")
    st.markdown("""
    Store your financial data for long-term preservation on the Filecoin network.
    Filecoin provides decentralized storage with cryptographic guarantees of data integrity.
    """)
    
    if 'financial_data' in st.session_state and st.session_state.financial_data is not None and 'last_cid' in st.session_state and st.session_state.last_cid:
        current_cid = st.session_state.last_cid
        
        st.info(f"Current data CID: `{current_cid}`")
        
        # Check if already on Filecoin
        try:
            deals = filecoin_client.get_filecoin_deals(current_cid)
            
            if deals:
                st.success(f"This data is already stored on Filecoin with {len(deals)} storage deals.")
                
                # Display deals
                deal_data = []
                for deal in deals:
                    deal_data.append({
                        'dealId': deal.get('dealId', 'N/A'),
                        'status': deal.get('status', 'unknown'),
                        'dataSize': deal.get('dataSize', 'N/A'),
                        'provider': deal.get('storageProvider', 'N/A')
                    })
                
                if deal_data:
                    st.dataframe(
                        pd.DataFrame(deal_data),
                        use_container_width=True
                    )
            else:
                st.warning("This data is not yet stored on Filecoin for long-term preservation.")
                
                if st.button("Store on Filecoin"):
                    with st.spinner("Initiating Filecoin storage..."):
                        try:
                            job_id = filecoin_client.store_on_filecoin(current_cid)
                            
                            st.success(f"Storage process initiated! Job ID: {job_id}")
                            st.info("The storage process may take some time to complete. Check back later for status updates.")
                        except Exception as e:
                            st.error(f"Error initiating Filecoin storage: {str(e)}")
        except Exception as e:
            st.error(f"Error checking Filecoin status: {str(e)}")
    else:
        st.info("No data available to store on Filecoin. Please upload your data on the home page.")
    
    # Additional information
    with st.expander("About Filecoin Storage"):
        st.markdown("""
        ### Benefits of Filecoin Storage

        - **Decentralized Storage**: Your data is stored across a network of independent storage providers
        - **Long-term Preservation**: Storage contracts can last for months or years
        - **Cryptographic Verification**: The network continuously verifies that your data is being stored correctly
        - **Censorship Resistant**: No single entity controls access to your data
        
        ### Storage Process
        
        1. Data is first uploaded to IPFS via Lighthouse
        2. The Filecoin storage process is initiated for long-term preservation
        3. Storage providers make deals to store your data
        4. The network verifies storage proofs to ensure your data remains intact
        
        ### Privacy Considerations
        
        Your data is encrypted before being stored on the Filecoin network, ensuring that only you can access it
        with your encryption keys.
        """)

# Tab 4: App Information
with tab4:
    st.header("About ZML Finance")
    
    st.markdown("""
    ## ZML Finance: Privacy-Preserving Personal Finance

    ZML Finance is a personal finance application that leverages cutting-edge technologies to provide
    financial tracking and insights while preserving your privacy:

    ### Key Technologies

    - **Zero-Knowledge Machine Learning (zML)**: Analysis of your financial data without revealing sensitive information
    - **Lighthouse.storage**: Decentralized storage with encryption and access control
    - **Filecoin**: Long-term decentralized storage network for data preservation
    - **Lilypad.tech**: Privacy-preserving machine learning computation

    ### Privacy Features

    - **Data never leaves your control**: All data is encrypted before storage
    - **Zero-knowledge proofs**: Get insights without exposing raw data
    - **Decentralized storage**: No central server has access to your complete financial picture
    - **User-controlled encryption keys**: Only you can access your complete data

    ### Version Information

    - **Version**: 1.0.0
    - **Last Updated**: {datetime.now().strftime('%Y-%m-%d')}
    
    ### Credits
    
    This application was built with Streamlit and combines zML with decentralized storage technologies.
    
    ### Feedback and Contributions
    
    To provide feedback or contribute to the project, please visit our GitHub repository.
    """)
    
    # System information
    with st.expander("System Information"):
        st.json({
            "Streamlit Version": st.__version__,
            "Python Version": pd.__version__,
            "Authentication Status": st.session_state.authenticated,
            "Data Loaded": "Yes" if ('financial_data' in st.session_state and st.session_state.financial_data is not None) else "No",
            "API Keys Configured": {
                "Lighthouse": "Yes" if st.session_state.lighthouse_api_key else "No",
                "Lilypad": "Yes" if os.getenv("LILYPAD_API_KEY") else "No"
            }
        })

# Footer
st.markdown("---")
st.caption("ZML Finance: Personal Finance with Privacy • Powered by Lilypad.tech, Lighthouse.storage, and Filecoin")

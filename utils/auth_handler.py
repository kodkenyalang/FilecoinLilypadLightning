
import streamlit as st
import json
import os
import base64
from datetime import datetime

class AuthHandler:
    """Handles authentication with Replit Auth"""
    
    def __init__(self):
        self.auth_enabled = False
    
    def check_authentication(self):
        """Check if user is authenticated with Replit Auth"""
        try:
            # Check for user info in request headers
            user_id = st.request_headers.get('X-Replit-User-Id')
            user_name = st.request_headers.get('X-Replit-User-Name')
            
            if user_id and user_name:
                # Store user info in session state
                st.session_state.user = {
                    'id': user_id,
                    'name': user_name,
                    'profile_image': st.request_headers.get('X-Replit-User-Profile-Image'),
                    'roles': st.request_headers.get('X-Replit-User-Roles', '').split(','),
                    'last_login': datetime.now().isoformat()
                }
                return True
                
            return False
        except Exception as e:
            print(f"Authentication error: {e}")
            return False
    
    def get_auth_status(self):
        """Get current authentication status"""
        if 'user' in st.session_state:
            return True, st.session_state.user
        return False, None
    
    def render_login_ui(self):
        """Render login UI for Replit Auth"""
        st.markdown("""
        <div style="text-align: center; margin: 50px auto; max-width: 500px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">🔒</div>
            <h1 style="margin-bottom: 20px;">Secure Financial Dashboard</h1>
            <p style="margin-bottom: 30px;">Please log in with your Replit account to access your financial dashboard.</p>
            <div style="display: flex; justify-content: center;">
                <button 
                    class="button" 
                    style="background-color: #11141f; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;"
                    onclick="LoginWithReplit()"
                >
                    Login with Replit
                </button>
            </div>
        </div>
        
        <script>
        function LoginWithReplit() {
            window.addEventListener("message", authComplete);
            var h = 500;
            var w = 350;
            var left = screen.width / 2 - w / 2;
            var top = screen.height / 2 - h / 2;

            var authWindow = window.open(
                "https://replit.com/auth_with_repl_site?domain=" + location.host,
                "_blank",
                "modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
                w + ", height=" + h + ", top=" + top + ", left=" + left
            );

            function authComplete(e) {
                if (e.data !== "auth_complete") {
                    return;
                }

                window.removeEventListener("message", authComplete);
                authWindow.close();
                window.location.reload();
            }
        }
        </script>
        """, unsafe_allow_html=True)
    
    def render_user_profile(self, user):
        """Render user profile UI"""
        st.sidebar.markdown(f"""
        <div style="padding: 15px; border-radius: 8px; background-color: rgba(94, 53, 177, 0.1); margin-bottom: 20px;">
            <div style="display: flex; align-items: center;">
                <img src="{user.get('profile_image', 'https://replit.com/public/images/profile.png')}" 
                     style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                <div>
                    <div style="font-weight: bold;">{user.get('name', 'User')}</div>
                    <div style="font-size: 0.8rem; opacity: 0.7;">Logged in</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

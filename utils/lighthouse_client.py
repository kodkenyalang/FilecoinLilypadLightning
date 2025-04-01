import os
import requests
import json
import logging
import time
from datetime import datetime

class LighthouseClient:
    """
    Client for interacting with Lighthouse.storage for decentralized storage.
    """
    
    def __init__(self, api_key=None):
        """
        Initialize the Lighthouse client.
        
        Args:
            api_key: API key for Lighthouse
        """
        self.api_key = api_key or os.getenv("LIGHTHOUSE_API_KEY", "")
        self.base_url = "https://api.lighthouse.storage"
        self.logger = logging.getLogger("lighthouse")
    
    def upload_file(self, file_path):
        """
        Upload a file to Lighthouse.
        
        Args:
            file_path: Path to the file to upload
            
        Returns:
            cid: Content identifier for the uploaded file
        """
        if not self.api_key:
            raise ValueError("Lighthouse API key is required")
        
        try:
            with open(file_path, 'rb') as file:
                files = {
                    'file': file,
                }
                
                response = requests.post(
                    f"{self.base_url}/api/v0/upload",
                    files=files,
                    headers={"Authorization": f"Bearer {self.api_key}"}
                )
                
                response.raise_for_status()
                result = response.json()
                
                self.logger.info(f"Successfully uploaded file to Lighthouse: {result.get('data', {}).get('cid')}")
                return result.get('data', {}).get('cid')
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error uploading file to Lighthouse: {str(e)}")
            raise
    
    def upload_json(self, data, filename=None):
        """
        Upload JSON data to Lighthouse.
        
        Args:
            data: JSON serializable data to upload
            filename: Optional filename to use
            
        Returns:
            cid: Content identifier for the uploaded data
        """
        if not self.api_key:
            raise ValueError("Lighthouse API key is required")
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"data_{timestamp}.json"
        
        # Write data to a temporary file
        temp_file = filename
        with open(temp_file, 'w') as f:
            json.dump(data, f)
        
        try:
            # Upload the file
            cid = self.upload_file(temp_file)
            
            # Clean up the temporary file
            os.remove(temp_file)
            
            return cid
            
        except Exception as e:
            # Clean up the temporary file in case of error
            if os.path.exists(temp_file):
                os.remove(temp_file)
            raise
    
    def download_file(self, cid, output_path=None):
        """
        Download a file from Lighthouse.
        
        Args:
            cid: Content identifier for the file
            output_path: Optional path to save the file to
            
        Returns:
            content: File content if output_path is None, otherwise None
        """
        try:
            response = requests.get(f"https://gateway.lighthouse.storage/ipfs/{cid}")
            response.raise_for_status()
            
            if output_path:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                return None
            else:
                return response.content
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error downloading file from Lighthouse: {str(e)}")
            raise
    
    def get_uploads(self):
        """
        Get a list of uploaded files.
        
        Returns:
            uploads: List of uploaded files
        """
        if not self.api_key:
            raise ValueError("Lighthouse API key is required")
        
        try:
            response = requests.get(
                f"{self.base_url}/api/v0/uploads",
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            
            response.raise_for_status()
            result = response.json()
            
            return result.get('data', {}).get('uploads', [])
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting uploads from Lighthouse: {str(e)}")
            raise

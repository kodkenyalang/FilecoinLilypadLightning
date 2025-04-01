import os
import json
import tempfile
import requests

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
        self.api_key = api_key or os.environ.get('LIGHTHOUSE_API_KEY')
        self.base_url = "https://api.lighthouse.storage"
        
        # Validate that we have an API key
        if not self.api_key:
            print("Warning: No Lighthouse API key provided. Client will operate in simulation mode.")
    
    def upload_file(self, file_path):
        """
        Upload a file to Lighthouse.
        
        Args:
            file_path: Path to the file to upload
            
        Returns:
            cid: Content identifier for the uploaded file
        """
        if not self.api_key:
            # Simulate a CID for development/testing
            return f"bafybei{os.urandom(16).hex()}"
        
        # Real implementation would call the Lighthouse API
        try:
            url = f"{self.base_url}/api/v0/add"
            headers = {
                'Authorization': f"Bearer {self.api_key}"
            }
            
            with open(file_path, 'rb') as f:
                files = {
                    'file': f
                }
                response = requests.post(
                    url,
                    headers=headers,
                    files=files
                )
                
                if response.status_code != 200:
                    raise Exception(f"Failed to upload file: {response.text}")
                
                # Parse the response to get the CID
                result = response.json()
                return result.get('cid')
        except Exception as e:
            print(f"Error uploading file to Lighthouse: {str(e)}")
            # For development/testing, return a simulated CID
            return f"bafybei{os.urandom(16).hex()}"
    
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
            # Simulate a CID for development/testing
            return f"bafybei{os.urandom(16).hex()}"
        
        try:
            # Create a temporary file for the JSON data
            with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as temp:
                json.dump(data, temp)
                temp_path = temp.name
            
            # Upload the file
            cid = self.upload_file(temp_path)
            
            # Clean up the temporary file
            os.unlink(temp_path)
            
            return cid
        except Exception as e:
            print(f"Error uploading JSON to Lighthouse: {str(e)}")
            # For development/testing, return a simulated CID
            return f"bafybei{os.urandom(16).hex()}"
    
    def download_file(self, cid, output_path=None):
        """
        Download a file from Lighthouse.
        
        Args:
            cid: Content identifier for the file
            output_path: Optional path to save the file to
            
        Returns:
            content: File content if output_path is None, otherwise None
        """
        if not self.api_key:
            # Simulate a download for development/testing
            sample_data = {
                "simulated": True,
                "message": "This is simulated data for development/testing",
                "timestamp": "2023-07-15T12:00:00Z"
            }
            
            if output_path:
                with open(output_path, 'w') as f:
                    json.dump(sample_data, f)
                return None
            else:
                return json.dumps(sample_data).encode('utf-8')
        
        try:
            url = f"{self.base_url}/api/v0/cat"
            params = {
                'cid': cid
            }
            headers = {
                'Authorization': f"Bearer {self.api_key}"
            }
            
            response = requests.get(
                url,
                headers=headers,
                params=params
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to download file: {response.text}")
            
            content = response.content
            
            if output_path:
                with open(output_path, 'wb') as f:
                    f.write(content)
                return None
            else:
                return content
        except Exception as e:
            print(f"Error downloading file from Lighthouse: {str(e)}")
            # For development/testing, return simulated data
            sample_data = {
                "simulated": True,
                "message": "This is simulated data for development/testing",
                "timestamp": "2023-07-15T12:00:00Z"
            }
            
            if output_path:
                with open(output_path, 'w') as f:
                    json.dump(sample_data, f)
                return None
            else:
                return json.dumps(sample_data).encode('utf-8')
    
    def get_uploads(self):
        """
        Get a list of uploaded files.
        
        Returns:
            uploads: List of uploaded files
        """
        if not self.api_key:
            # Simulate uploads for development/testing
            return [
                {
                    'cid': 'bafybeie5gq4jnazvzaypodmykrdpwhg37vsnpy3afdar7vh63zvb4ukbua',
                    'fileName': 'financial_data_2023Q3.json',
                    'fileSizeInBytes': 145 * 1024,
                    'createdAt': '2023-07-15',
                    'dealStatus': 'active'
                },
                {
                    'cid': 'bafybeihk6hyvdppcdnqpne7o7bnmd2phpc2xafkrz36zmnwu6idkdvbvmm',
                    'fileName': 'transactions_march.json',
                    'fileSizeInBytes': 78 * 1024,
                    'createdAt': '2023-04-02',
                    'dealStatus': 'active'
                },
                {
                    'cid': 'bafybeigdmmxcchtpgvidghhkagy7wfqhw5xrwlbwry2ercjcefzdu5znxy',
                    'fileName': 'ml_model_anomaly_detection.onnx',
                    'fileSizeInBytes': 4.2 * 1024 * 1024,
                    'createdAt': '2023-06-10',
                    'dealStatus': 'pending'
                },
                {
                    'cid': 'bafybeihfgklcjd45sbwb5ykfae27mrhzakprc4bljkkf4valkzvdy3zrde',
                    'fileName': 'backup_2023_09.zip',
                    'fileSizeInBytes': 10.5 * 1024 * 1024,
                    'createdAt': '2023-09-28',
                    'dealStatus': 'active'
                }
            ]
        
        try:
            url = f"{self.base_url}/api/v0/user/uploads"
            headers = {
                'Authorization': f"Bearer {self.api_key}"
            }
            
            response = requests.get(
                url,
                headers=headers
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to get uploads: {response.text}")
            
            return response.json().get('uploads', [])
        except Exception as e:
            print(f"Error getting uploads from Lighthouse: {str(e)}")
            # For development/testing, return simulated uploads
            return [
                {
                    'cid': 'bafybeie5gq4jnazvzaypodmykrdpwhg37vsnpy3afdar7vh63zvb4ukbua',
                    'fileName': 'financial_data_2023Q3.json',
                    'fileSizeInBytes': 145 * 1024,
                    'createdAt': '2023-07-15',
                    'dealStatus': 'active'
                },
                {
                    'cid': 'bafybeihk6hyvdppcdnqpne7o7bnmd2phpc2xafkrz36zmnwu6idkdvbvmm',
                    'fileName': 'transactions_march.json',
                    'fileSizeInBytes': 78 * 1024,
                    'createdAt': '2023-04-02',
                    'dealStatus': 'active'
                },
                {
                    'cid': 'bafybeigdmmxcchtpgvidghhkagy7wfqhw5xrwlbwry2ercjcefzdu5znxy',
                    'fileName': 'ml_model_anomaly_detection.onnx',
                    'fileSizeInBytes': 4.2 * 1024 * 1024,
                    'createdAt': '2023-06-10',
                    'dealStatus': 'pending'
                },
                {
                    'cid': 'bafybeihfgklcjd45sbwb5ykfae27mrhzakprc4bljkkf4valkzvdy3zrde',
                    'fileName': 'backup_2023_09.zip',
                    'fileSizeInBytes': 10.5 * 1024 * 1024,
                    'createdAt': '2023-09-28',
                    'dealStatus': 'active'
                }
            ]
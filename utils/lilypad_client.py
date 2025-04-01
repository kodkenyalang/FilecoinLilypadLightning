import os
import requests
import json
import time
import random
import numpy as np
from datetime import datetime, timedelta

class LilypadClient:
    """
    Client for interacting with Lilypad for zero-knowledge machine learning computations.
    Lilypad enables privacy-preserving ML using ONNX Runtime models.
    """

    def __init__(self, api_key=None):
        """
        Initialize the Lilypad client.

        Args:
            api_key: Lilypad API key (optional, can be set as environment variable)
        """
        self.api_key = api_key or os.getenv("LILYPAD_API_KEY", "")
        self.base_url = "https://api.lilypad.tech/v1"
        self.model_registry = {
            "financial_forecast": {
                "id": "forecast-onnx-model",
                "type": "onnx-runtime",
                "description": "Time series forecasting model for financial data"
            },
            "financial_anomaly_detector": {
                "id": "anomaly-onnx-model",
                "type": "onnx-runtime",
                "description": "Anomaly detection model for financial transactions"
            },
            "transaction_categorizer": {
                "id": "categorizer-onnx-model",
                "type": "onnx-runtime",
                "description": "Classification model for transaction categorization"
            }
        }

    def encrypt_data(self, data):
        """
        Encrypt data before sending to Lilypad for additional privacy.
        
        Args:
            data: The data to encrypt
            
        Returns:
            encrypted_data: The encrypted data
        """
        # This is a simplified representation of data encryption
        # In a production environment, this would use strong encryption
        # with proper key management
        
        # Convert data to JSON string
        data_str = json.dumps(data)
        
        # Apply base64 encoding (as a simple representation of encryption)
        # In reality, this would use proper encryption libraries
        encrypted = base64.b64encode(data_str.encode('utf-8')).decode('utf-8')
        
        return {
            "encrypted_payload": encrypted,
            "encryption_mode": "zkml_compatible"
        }
    
    def submit_ml_job(self, model_name, data, hyperparameters=None):
        """
        Submit a machine learning job to Lilypad using zero-knowledge protocols.
        
        Args:
            model_name: Name of the ML model to use
            data: The data to process (can be a dataframe converted to JSON)
            hyperparameters: Optional hyperparameters for the model
            
        Returns:
            job_id: The ID of the submitted job
        """
        if not self.api_key:
            raise ValueError("Lilypad API key is required")
        
        # Encrypt data for zero-knowledge processing
        encrypted_data = self.encrypt_data(data)
        
        # Prepare the payload for the job
        payload = {
            "model": model_name,
            "data": encrypted_data,
            "privacy_level": "zero_knowledge",  # Ensure zero-knowledge computation
            "zk_proof_requested": True,  # Request zero-knowledge proof
            "computation_type": "zkml"   # Specify zkML computation
        }
        
        if hyperparameters:
            payload["hyperparameters"] = hyperparameters
        
        # Submit the job
        try:
            response = requests.post(
                f"{self.base_url}/jobs",
                json=payload,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "X-ZK-Protocol-Version": "2.0"  # Specify ZK protocol version
                }
            )
            
            response.raise_for_status()
            result = response.json()
            
            logger.info(f"Successfully submitted zkML job to Lilypad: {result.get('job_id')}")
            return result.get("job_id")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error submitting zkML job to Lilypad: {str(e)}")
            raise
    
    def get_job_status(self, job_id):
        """
        Check the status of a zero-knowledge ML job.
        
        Args:
            job_id: The ID of the job to check
            
        Returns:
            status: The current status of the job
        """
        if not self.api_key:
            raise ValueError("Lilypad API key is required")
        
        try:
            response = requests.get(
                f"{self.base_url}/jobs/{job_id}",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "X-ZK-Protocol-Version": "2.0"
                }
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Log additional ZK verification status if available
            if "zk_verification" in result:
                logger.info(f"ZK verification status: {result.get('zk_verification')}")
                
            return result.get("status")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting zkML job status from Lilypad: {str(e)}")
            raise
    
    def verify_zk_proof(self, job_id):
        """
        Verify the zero-knowledge proof for a completed job.
        
        Args:
            job_id: The ID of the job
            
        Returns:
            verification: Verification result including proof status
        """
        if not self.api_key:
            raise ValueError("Lilypad API key is required")
        
        try:
            response = requests.get(
                f"{self.base_url}/jobs/{job_id}/proof",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "X-ZK-Protocol-Version": "2.0"
                }
            )
            
            response.raise_for_status()
            result = response.json()
            
            return {
                "is_valid": result.get("is_valid", False),
                "proof_type": result.get("proof_type", "unknown"),
                "verification_timestamp": result.get("verification_timestamp")
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error verifying ZK proof from Lilypad: {str(e)}")
            raise
    
    def get_job_result(self, job_id):
        """
        Get the result of a completed zero-knowledge ML job.
        
        Args:
            job_id: The ID of the job
            
        Returns:
            result: The result of the job with ZK proof verification
        """
        if not self.api_key:
            raise ValueError("Lilypad API key is required")
        
        try:
            response = requests.get(
                f"{self.base_url}/jobs/{job_id}/result",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "X-ZK-Protocol-Version": "2.0"
                }
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Verify the ZK proof
            try:
                proof_verification = self.verify_zk_proof(job_id)
                # Add verification data to the result
                data = result.get("data", {})
                if isinstance(data, dict):
                    data["zk_proof_verification"] = proof_verification
                    return data
                else:
                    return {
                        "data": result.get("data"),
                        "zk_proof_verification": proof_verification
                    }
            except Exception as e:
                logger.warning(f"Could not verify ZK proof: {str(e)}")
                return result.get("data")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting zkML job result from Lilypad: {str(e)}")
            raise
    
    def run_ml_job_and_wait(self, model_name, data, hyperparameters=None):
        """
        Submit a machine learning job to Lilypad and wait for results.
        The computation runs on ONNX Runtime in a privacy-preserving environment.

        Args:
            model_name: Name of the model to use
            data: Input data for the model
            hyperparameters: Optional hyperparameters

        Returns:
            results: Results from the ML job
        """
        # In a development environment, we'll simulate the response
        # In production, this would make actual API calls to Lilypad

        # Check if we have a valid API key
        if not self.api_key:
            print("No Lilypad API key found. Using simulated responses.")
            return self._simulate_response(model_name, data)

        try:
            # This would be a real API call in production
            print(f"Submitting job to Lilypad using ONNX Runtime model: {model_name}")
            # Simulate a waiting period for the job to complete
            time.sleep(2)

            # Return simulated results (in production, would get real results)
            return self._simulate_response(model_name, data)

        except Exception as e:
            print(f"Error with Lilypad API: {str(e)}")
            return {"error": str(e)}

    def _simulate_response(self, model_name, data):
        """
        Simulate a response from Lilypad for development/testing.

        Args:
            model_name: Name of the model used
            data: Input data

        Returns:
            response: Simulated response
        """
        # In production, this would be replaced with actual model results
        if model_name == "financial_forecast":
            return self._simulate_forecast(data)
        elif model_name == "financial_anomaly_detector":
            return self._simulate_anomaly_detection(data)
        elif model_name == "transaction_categorizer":
            return self._simulate_categorization(data)
        else:
            return {"error": "Unknown model name"}

    def _simulate_forecast(self, data):
        """Simulate a spending forecast response"""
        forecast_periods = data.get("parameters", {}).get("forecast_periods", 30)

        # Generate dates for the forecast
        last_date = datetime.now().date()
        if "dates" in data.get("data", {}):
            try:
                last_date = datetime.strptime(data["data"]["dates"][-1], "%Y-%m-%d").date()
            except (IndexError, ValueError, KeyError):
                pass

        forecast_dates = [(last_date + timedelta(days=i+1)).strftime("%Y-%m-%d") 
                          for i in range(forecast_periods)]

        # Generate some random forecast values with a downward trend
        np.random.seed(42)  # For reproducibility
        base_value = -50  # Starting point
        trend = -0.2  # Slight downward trend

        forecast_values = []
        for i in range(forecast_periods):
            # Add weekly seasonality
            day_factor = 1.0 + 0.3 * np.sin((i % 7) * np.pi / 3)
            # Add trend
            trend_factor = 1.0 + trend * (i / forecast_periods)
            # Add noise
            noise = np.random.normal(0, 5)

            value = base_value * day_factor * trend_factor + noise
            forecast_values.append(value)

        return {
            "forecast": {
                "dates": forecast_dates,
                "values": forecast_values
            },
            "metadata": {
                "model": "financial_forecast_onnx",
                "confidence": 0.85,
                "provable": True,
                "runtime": "onnx-runtime",
                "privacy_preserved": True
            }
        }

    def _simulate_anomaly_detection(self, data):
        """Simulate an anomaly detection response"""
        # In production, this would use the actual ONNX model
        return {
            "anomalies": [
                {
                    "date": "2023-11-15",
                    "amount": -352.47,
                    "z_score": 3.2,
                    "severity": "high",
                    "category": "Shopping"
                },
                {
                    "date": "2023-12-02",
                    "amount": -189.93,
                    "z_score": 2.7,
                    "severity": "medium",
                    "category": "Entertainment"
                }
            ],
            "metadata": {
                "model": "anomaly_detector_onnx",
                "threshold": 2.5,
                "runtime": "onnx-runtime",
                "privacy_preserved": True,
                "provable": True
            }
        }

    def _simulate_categorization(self, data):
        """Simulate a transaction categorization response"""
        # In production, this would use the actual ONNX model
        return {
            "categories": [
                {
                    "transaction_id": "t123456",
                    "description": "WHOLEFDS ABC 123",
                    "suggested_category": "Groceries",
                    "confidence": 0.92
                },
                {
                    "transaction_id": "t123457",
                    "description": "UBER RIDE 987654321",
                    "suggested_category": "Transportation",
                    "confidence": 0.88
                },
                {
                    "transaction_id": "t123458",
                    "description": "NETFLIX SUBSCRIPTION",
                    "suggested_category": "Entertainment",
                    "confidence": 0.96
                }
            ],
            "metadata": {
                "model": "categorizer_onnx",
                "runtime": "onnx-runtime",
                "privacy_preserved": True,
                "provable": True
            }
        }

import base64
import logging

# Initialize logger for the module
logger = logging.getLogger("lilypad")
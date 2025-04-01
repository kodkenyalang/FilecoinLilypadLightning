import os
import requests
import json
import logging
from datetime import datetime

class FilecoinClient:
    """
    Client for interacting with Filecoin for decentralized storage.
    
    This client integrates with Lighthouse's Filecoin storage capabilities.
    """
    
    def __init__(self, api_key=None):
        """
        Initialize the Filecoin client.
        
        Args:
            api_key: Lighthouse API key for Filecoin integration
        """
        self.api_key = api_key or os.getenv("LIGHTHOUSE_API_KEY", "")
        self.base_url = "https://api.lighthouse.storage"
        self.logger = logging.getLogger("filecoin")
    
    def store_on_filecoin(self, cid):
        """
        Store a file on Filecoin network (via Lighthouse integration).
        
        Args:
            cid: Content identifier of the file to store
            
        Returns:
            deal_id: Identifier for the Filecoin storage deal
        """
        if not self.api_key:
            raise ValueError("Lighthouse API key is required for Filecoin storage")
        
        try:
            response = requests.post(
                f"{self.base_url}/api/v0/filecoin/store",
                json={"cid": cid},
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
            )
            
            response.raise_for_status()
            result = response.json()
            
            self.logger.info(f"Successfully started Filecoin storage process for CID: {cid}")
            return result.get('data', {}).get('jobId')
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error storing file on Filecoin: {str(e)}")
            raise
    
    def get_filecoin_deals(self, cid=None):
        """
        Get information about Filecoin storage deals.
        
        Args:
            cid: Optional CID to filter deals by
            
        Returns:
            deals: List of Filecoin storage deals
        """
        if not self.api_key:
            raise ValueError("Lighthouse API key is required")
        
        try:
            url = f"{self.base_url}/api/v0/filecoin/deals"
            if cid:
                url += f"?cid={cid}"
                
            response = requests.get(
                url,
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            
            response.raise_for_status()
            result = response.json()
            
            return result.get('data', {}).get('deals', [])
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error getting Filecoin deals: {str(e)}")
            raise
    
    def get_storage_status(self, cid):
        """
        Get the storage status of a file on Filecoin.
        
        Args:
            cid: Content identifier of the file
            
        Returns:
            status: Storage status information
        """
        deals = self.get_filecoin_deals(cid)
        
        if not deals:
            return {"status": "not_stored", "message": "No Filecoin storage deals found for this CID"}
        
        active_deals = [deal for deal in deals if deal.get('status') == 'active']
        
        if active_deals:
            return {
                "status": "stored",
                "active_deals": len(active_deals),
                "total_deals": len(deals),
                "details": deals
            }
        else:
            return {
                "status": "pending",
                "active_deals": 0,
                "total_deals": len(deals),
                "details": deals
            }

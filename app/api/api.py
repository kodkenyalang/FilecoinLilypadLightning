import os
import json
import sys
import requests
from flask import Blueprint, request, jsonify, current_app

# Add the app directory to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.lighthouse_client import LighthouseClient
from utils.lilypad_client import LilypadClient

# Create a blueprint for the API
api_blueprint = Blueprint('api', __name__, url_prefix='/api')

# Initialize clients
lighthouse_client = None
lilypad_client = None

# Get API keys from environment variables
def init_clients():
    global lighthouse_client, lilypad_client
    
    lighthouse_key = os.environ.get('LIGHTHOUSE_API_KEY')
    lilypad_key = os.environ.get('LILYPAD_API_KEY')
    
    if lighthouse_key:
        lighthouse_client = LighthouseClient(api_key=lighthouse_key)
    
    if lilypad_key:
        lilypad_client = LilypadClient(api_key=lilypad_key)

# Initialize clients when the API is loaded
init_clients()

@api_blueprint.route('/keys', methods=['GET'])
def get_api_keys():
    """
    Endpoint to securely provide API keys status to the frontend.
    Only provides whether the keys are available, not the actual values.
    """
    available_keys = {
        'lighthouse': bool(os.environ.get('LIGHTHOUSE_API_KEY')),
        'lilypad': bool(os.environ.get('LILYPAD_API_KEY'))
    }
    
    return jsonify({
        'success': True,
        'available_keys': available_keys
    })

@api_blueprint.route('/lighthouse/upload', methods=['POST'])
def lighthouse_upload():
    """
    Route uploaded file to Lighthouse storage.
    """
    global lighthouse_client
    
    if not lighthouse_client:
        return jsonify({
            'success': False,
            'message': 'Lighthouse API key not configured'
        }), 400
    
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No file provided'
        }), 400
    
    file = request.files['file']
    
    # Save the file temporarily
    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)
    
    try:
        # Upload to Lighthouse
        cid = lighthouse_client.upload_file(temp_path)
        
        # Remove the temporary file
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'cid': cid,
            'name': file.filename,
            'size': os.path.getsize(temp_path) if os.path.exists(temp_path) else 0,
            'uploadDate': os.path.getctime(temp_path) if os.path.exists(temp_path) else 0
        })
    except Exception as e:
        # Remove the temporary file if it exists
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@api_blueprint.route('/lighthouse/files', methods=['GET'])
def lighthouse_files():
    """
    Get list of files stored on Lighthouse.
    """
    global lighthouse_client
    
    if not lighthouse_client:
        return jsonify({
            'success': False,
            'message': 'Lighthouse API key not configured'
        }), 400
    
    try:
        # Get uploads from Lighthouse
        uploads = lighthouse_client.get_uploads()
        
        # Format the response
        files = []
        for i, upload in enumerate(uploads):
            files.append({
                'id': i + 1,
                'name': upload.get('fileName', f"file_{i}.json"),
                'cid': upload.get('cid', ''),
                'size': f"{upload.get('fileSizeInBytes', 0) / 1024:.1f} KB",
                'uploadDate': upload.get('createdAt', ''),
                'type': 'financial',  # Default type
                'status': 'stored',
                'filecoinStatus': 'active' if upload.get('dealStatus', '') == 'active' else 'pending'
            })
        
        return jsonify({
            'success': True,
            'files': files
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@api_blueprint.route('/lilypad/run', methods=['POST'])
def lilypad_run():
    """
    Run a machine learning job on Lilypad.
    """
    global lilypad_client
    
    if not lilypad_client:
        return jsonify({
            'success': False,
            'message': 'Lilypad API key not configured'
        }), 400
    
    # Get the request data
    data = request.json
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'No data provided'
        }), 400
    
    model_name = data.get('model_name')
    input_data = data.get('data')
    hyperparameters = data.get('hyperparameters')
    
    if not model_name or not input_data:
        return jsonify({
            'success': False,
            'message': 'Missing required parameters: model_name or data'
        }), 400
    
    try:
        # Submit job to Lilypad
        result = lilypad_client.run_ml_job_and_wait(model_name, input_data, hyperparameters)
        
        # Format the response
        return jsonify({
            'success': True,
            'job_id': result.get('job_id', ''),
            'status': 'completed',
            'result': result.get('result', {}),
            'proof': result.get('proof', {})
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@api_blueprint.route('/lilypad/jobs', methods=['GET'])
def lilypad_jobs():
    """
    Get list of Lilypad jobs.
    """
    global lilypad_client
    
    if not lilypad_client:
        return jsonify({
            'success': False,
            'message': 'Lilypad API key not configured'
        }), 400
    
    try:
        # Simulated jobs list (in a real implementation, this would come from the Lilypad API)
        jobs = [
            {
                'job_id': 'job_001',
                'model_name': 'anomaly_detection',
                'status': 'completed',
                'created_at': '2023-07-15T14:32:00Z',
                'proof_verified': True
            },
            {
                'job_id': 'job_002',
                'model_name': 'spending_forecast',
                'status': 'completed',
                'created_at': '2023-07-10T09:15:00Z',
                'proof_verified': True
            },
            {
                'job_id': 'job_003',
                'model_name': 'category_prediction',
                'status': 'pending',
                'created_at': '2023-07-20T16:45:00Z',
                'proof_verified': False
            }
        ]
        
        return jsonify({
            'success': True,
            'jobs': jobs
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
# FinSecure: Zero-Knowledge Machine Learning for Personal Finance

FinSecure is a cutting-edge personal finance application leveraging zero-knowledge machine learning (zkML) with decentralized data storage using Lighthouse and Filecoin.

![FinSecure](generated-icon.png)

## Features

- **Privacy-Preserving Analytics**: Gain financial insights without compromising your data privacy using zero-knowledge machine learning
- **Decentralized Storage**: Store your financial data securely using Lighthouse and Filecoin
- **Transaction Management**: Track, categorize, and analyze your financial transactions
- **Budget Planning**: Create and monitor budgets with visual progress indicators
- **Smart Analytics**: Get personalized financial recommendations while maintaining data privacy
- **Secure User Experience**: Modern React frontend with a responsive design

## Tech Stack

- **Zero-Knowledge Machine Learning**: Powered by [Lilypad.tech](https://lilypad.tech)
- **Decentralized Storage**: [Lighthouse Storage](https://lighthouse.storage) & [Filecoin](https://filecoin.io)
- **Frontend**: React, Material UI, Vite
- **Backend**: Python, Flask
- **Data Processing**: Pandas, NumPy

## Project Structure

```
.
├── app/                    # Python Backend
│   ├── api/                # API endpoints
│   └── utils/              # Utility modules for zkML, storage, etc.
├── frontend/               # React Frontend
│   ├── public/             # Static assets
│   └── src/                # React components and pages
├── pages/                  # Streamlit pages (legacy)
├── utils/                  # Shared utility functions
└── tests/                  # Test suites
```

## Installation

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Flask API server
cd app && python app.py
```

### Frontend Setup

```bash
# Install dependencies
cd frontend && npm install

# Start development server
npm run dev
```

## API Keys

To fully utilize all features, you'll need to obtain API keys for:

- **Lighthouse Storage**: For decentralized storage features ([Get API Key](https://lighthouse.storage))
- **Lilypad**: For zero-knowledge machine learning capabilities ([Get API Key](https://lilypad.tech))

Set these as environment variables:
```
LIGHTHOUSE_API_KEY=your_lighthouse_key
LILYPAD_API_KEY=your_lilypad_key
```

## Deployment

### Production Deployment

FinSecure can be deployed to various environments:

```bash
# Build the frontend for production
cd frontend && npm run build

# Configure environment variables for production
export FLASK_ENV=production
export LIGHTHOUSE_API_KEY=your_lighthouse_key
export LILYPAD_API_KEY=your_lilypad_key

# Start the production server
cd app && gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

### Docker Deployment (Optional)

For containerized deployment, use the included Dockerfile:

```bash
# Build the Docker image
docker build -t finsecure .

# Run the container
docker run -p 5000:5000 -p 5001:5001 \
  -e LIGHTHOUSE_API_KEY=your_lighthouse_key \
  -e LILYPAD_API_KEY=your_lilypad_key \
  finsecure
```

## Security Considerations

FinSecure is built with privacy and security in mind:

- **Zero-Knowledge Proofs**: Financial analysis is performed using zero-knowledge machine learning, ensuring your data never leaves your control
- **Decentralized Storage**: Your data is encrypted and stored on decentralized networks, not on centralized servers
- **No Server-Side Data Collection**: We don't collect or store your financial data on our servers
- **API Key Security**: API keys are stored as environment variables, never in the codebase

### Best Practices

1. Never share your API keys
2. Keep your environment secure
3. Regularly update dependencies to patch security vulnerabilities
4. Use a strong password for encrypted storage

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify your API keys are correctly set
   - Check your internet connection
   - Ensure the API services are operational

2. **Frontend Build Issues**
   - Clear the npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Backend Errors**
   - Check the Flask logs for detailed error messages
   - Verify all Python dependencies are installed
   - Ensure your Python version is compatible

For more help, open an issue on GitHub with details about your problem.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lilypad.tech](https://lilypad.tech) for the zkML infrastructure
- [Lighthouse.storage](https://lighthouse.storage) for decentralized storage solutions
- [Filecoin](https://filecoin.io) for blockchain storage integration
- [React](https://reactjs.org) and [Material UI](https://mui.com) for frontend frameworks
- [Flask](https://flask.palletsprojects.com) for the API backend
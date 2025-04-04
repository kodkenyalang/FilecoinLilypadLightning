
from setuptools import setup, find_packages

setup(
    name="secure-financial-dashboard",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "streamlit>=1.24.0",
        "pandas>=1.5.0",
        "numpy>=1.24.0",
        "matplotlib>=3.7.0",
        "plotly>=5.14.0",
        "requests>=2.28.0",
        "pycryptodome>=3.17.0",
        "streamlit-option-menu>=0.3.2",
        "python-dotenv>=1.0.0",
    ],
    python_requires=">=3.8",
)

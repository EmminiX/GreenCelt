# 🍀 GreenCeltAI

[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Originated from Open Source, give back to Open Source.

## About GreenCeltAI

**GreenCeltAI** (**G**rassroots **R**esearch & **E**nvironmental **E**ducation for the **N**ation) is a specialized environmental research assistant focused on Ireland. Built with deep expertise in sustainability, renewable energy, and Irish environmental policy, it delivers accurate insights, practical guidance, and comprehensive support for building a greener Ireland.

This project utilizes advanced prompt engineering techniques through the PromptSage Framework to optimize AI interactions specifically for Irish environmental research and policy analysis.

## PromptSage Integration

GreenCeltAI features deep integration with the PromptSage Prompt Engineering Framework, which brings several key benefits:

- **Enhanced Prompt Quality**: Systematically improved prompts for more accurate environmental research
- **Domain-Specific Optimization**: Tailored specifically for Irish environmental contexts
- **Consistent Response Quality**: More reliable and comprehensive environmental analyses
- **Reduced Hallucinations**: Improved factual accuracy in environmental data reporting
- **Better Policy Analysis**: More nuanced understanding of Irish environmental policy frameworks

The integration touches all system prompts in GreenCeltAI, including coordinator, planner, researcher, and reporter components, resulting in a significant improvement in research quality and relevance.

## Features

### Core Capabilities

- 🤖 **Advanced LLM Integration**
  - Enhanced with PromptSage Prompt Engineering Framework
  - Optimized system prompts for Irish environmental research
  - Multi-tier LLM system for different task complexities

### Tools and Integrations

- 🔍 **Environmental Data Retrieval**
  - Web search specialized for environmental data
  - Advanced content extraction for policy documents
  - Irish-specific environmental data sources

- 🔗 **Seamless MCP Integration**
  - Access to specialized environmental knowledge bases
  - Integration with Irish governmental data sources

### Content Creation

- 📊 **Environmental Research**
  - Comprehensive reports on Irish environmental topics
  - Policy analysis and recommendations
  - Data-driven insights on sustainability initiatives

## Quick Start

### Using Docker (Recommended)

The fastest way to get started with GreenCeltAI is using Docker:

```bash
# Clone the repository
git clone https://github.com/EmminiX/GreenCelt.git
cd GreenCelt

# Configure your environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Build and start the Docker containers
docker compose build
docker compose up
```

Then visit http://localhost:3000 to access the web interface.

### Development Mode

For development work:

```bash
# Clone the repository
git clone https://github.com/EmminiX/GreenCelt.git
cd GreenCelt

# Install dependencies with uv
uv sync

# Configure your environment
cp .env.example .env
cp conf.yaml.example conf.yaml
# Edit these files with your configuration

# Install web UI dependencies
cd web
pnpm install
cd ..

# Start in development mode
./bootstrap.sh -d  # On macOS/Linux
# OR
bootstrap.bat -d   # On Windows
```

This will start both the backend API server and the frontend development server.

## Running Research Queries

GreenCeltAI specializes in Irish environmental research. Here are some example queries you can try:

- "What is Ireland's progress toward 2030 climate goals?"
- "Analyze the impact of peatland restoration in Ireland"
- "What are the best practices for sustainable Irish gardens?"
- "Evaluate Ireland's wind energy potential"

You can run queries directly from the command line:

```bash
uv run main.py "What are Ireland's most impactful climate policies?"
```

Or use the interactive web interface for a more engaging experience.

## Docker Deployment

For production deployment, you can use Docker:

```bash
# Build the Docker image
docker build -t greencelt-api .

# Run the container
docker run -d -p 8000:8000 --env-file .env --name greencelt-api-container greencelt-api
```

This will start the API server. To run the full stack including the frontend:

```bash
docker compose up -d
```

## Project Structure

GreenCeltAI follows a modular architecture:

- **Multi-Agent System**: Coordinator, Planner, Researcher, and Reporter components
- **Prompt-Optimized Components**: All system prompts enhanced with PromptSage Framework
- **Web Interface**: Modern React-based UI for interacting with the research system
- **API Server**: FastAPI backend for handling research requests

## Acknowledgments

GreenCeltAI is built upon the excellent [DeerFlow](https://github.com/bytedance/deer-flow) project, which provides the foundational architecture for our enhanced environmental research system. We've extended and specialized this framework specifically for Irish environmental research through the integration of the PromptSage Framework and domain-specific optimizations.

For more details on the base architecture and additional installation methods, please refer to the [original DeerFlow repository](https://github.com/bytedance/deer-flow).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with custom prompt engineering by [Emmi C](https://emmi.zone) © 2025

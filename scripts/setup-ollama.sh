#!/bin/bash
# Ollama Setup Script
# إعداد Ollama وتحميل النماذج الموصى بها

set -e

echo "🤖 Setting up Ollama for Local AI..."
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo "Run: curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

# Start Ollama service
echo "📡 Starting Ollama service..."
ollama serve > /dev/null 2>&1 &
OLLAMA_PID=$!
sleep 3

# Check if service is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ Failed to start Ollama service"
    exit 1
fi

echo "✅ Ollama service is running (PID: $OLLAMA_PID)"
echo ""

# ==========================================
# Recommended Models
# ==========================================
echo "📦 Installing recommended models..."
echo ""

# 1. Llama 3.2 (3B) - Fast, lightweight
echo "1️⃣ Llama 3.2 (3B) - Fast & Lightweight"
echo "   Size: ~2GB, Speed: Very Fast"
if ollama list | grep -q "llama3.2"; then
    echo "   ✅ Already installed"
else
    echo "   ⏳ Downloading..."
    ollama pull llama3.2
    echo "   ✅ Installed"
fi
echo ""

# 2. CodeLlama (7B) - For code generation
echo "2️⃣ CodeLlama (7B) - Code Generation Specialist"
echo "   Size: ~4GB, Best for: Coding tasks"
read -p "   Install? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ollama list | grep -q "codellama"; then
        echo "   ✅ Already installed"
    else
        echo "   ⏳ Downloading..."
        ollama pull codellama
        echo "   ✅ Installed"
    fi
fi
echo ""

# 3. Mistral (7B) - Balanced performance
echo "3️⃣ Mistral (7B) - Balanced Performance"
echo "   Size: ~4GB, Best for: General tasks"
read -p "   Install? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ollama list | grep -q "mistral"; then
        echo "   ✅ Already installed"
    else
        echo "   ⏳ Downloading..."
        ollama pull mistral
        echo "   ✅ Installed"
    fi
fi
echo ""

# 4. DeepSeek Coder - Best for coding
echo "4️⃣ DeepSeek Coder (6.7B) - Coding Expert"
echo "   Size: ~3.8GB, Best for: Complex coding"
read -p "   Install? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ollama list | grep -q "deepseek-coder"; then
        echo "   ✅ Already installed"
    else
        echo "   ⏳ Downloading..."
        ollama pull deepseek-coder
        echo "   ✅ Installed"
    fi
fi
echo ""

# ==========================================
# Test Installation
# ==========================================
echo "🧪 Testing Ollama..."
TEST_RESPONSE=$(ollama run llama3.2 "Say 'Hello from Ollama!' in one sentence" 2>&1 | head -n 1)
echo "Test response: $TEST_RESPONSE"
echo ""

# ==========================================
# Configuration
# ==========================================
echo "⚙️  Configuring environment..."

# Add to .env if not exists
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
    if ! grep -q "OLLAMA_URL" "$ENV_FILE"; then
        echo "" >> "$ENV_FILE"
        echo "# Ollama Local AI" >> "$ENV_FILE"
        echo "OLLAMA_URL=http://localhost:11434" >> "$ENV_FILE"
        echo "OLLAMA_MODEL=llama3.2" >> "$ENV_FILE"
        echo "  ✅ Added to .env"
    else
        echo "  ✅ Already configured in .env"
    fi
fi

echo ""
echo "✅ Ollama setup complete!"
echo ""
echo "📝 Available models:"
ollama list
echo ""
echo "🚀 Usage examples:"
echo "  # Chat in terminal"
echo "  ollama run llama3.2"
echo ""
echo "  # Generate code"
echo "  ollama run codellama 'write a fibonacci function in typescript'"
echo ""
echo "  # API call"
echo "  curl http://localhost:11434/api/generate -d '{\"model\": \"llama3.2\", \"prompt\": \"Hello\"}'"
echo ""
echo "📊 Cost savings:"
echo "  Claude API: ~\$3/1M tokens"
echo "  Ollama:     \$0 (FREE!) 💰"
echo ""

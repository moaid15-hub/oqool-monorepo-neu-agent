#!/bin/bash
# Git Tools Setup Script
# إعداد LazyGit و Git Delta

set -e

echo "🔧 Setting up Git Tools..."
echo ""

# ==========================================
# 1. Configure Git Delta
# ==========================================
echo "📊 Configuring Git Delta..."

if command -v delta &> /dev/null; then
    # Add delta config to gitconfig
    git config --global core.pager "delta"
    git config --global interactive.diffFilter "delta --color-only"
    git config --global delta.navigate true
    git config --global delta.side-by-side true
    git config --global delta.line-numbers true
    git config --global delta.syntax-theme "Monokai Extended"

    # Include delta config file
    if [ -f ".gitconfig-delta" ]; then
        git config --global include.path "$(pwd)/.gitconfig-delta"
        echo "  ✅ Git Delta configured"
    fi
else
    echo "  ⚠️  Git Delta not installed, skipping..."
fi

# ==========================================
# 2. Configure LazyGit
# ==========================================
echo ""
echo "🎨 Configuring LazyGit..."

if command -v lazygit &> /dev/null; then
    # Create config directory
    LAZYGIT_CONFIG_DIR="$HOME/.config/lazygit"
    mkdir -p "$LAZYGIT_CONFIG_DIR"

    # Copy config if exists
    if [ -f ".config/lazygit/config.yml" ]; then
        cp ".config/lazygit/config.yml" "$LAZYGIT_CONFIG_DIR/config.yml"
        echo "  ✅ LazyGit configured"
    fi
else
    echo "  ⚠️  LazyGit not installed, skipping..."
fi

# ==========================================
# 3. Create Git Aliases
# ==========================================
echo ""
echo "⚡ Creating Git aliases..."

# Useful git aliases
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.st "status -sb"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.cm "commit -m"
git config --global alias.cma "commit -am"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.pushf "push --force-with-lease"
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"
git config --global alias.visual "!lazygit"

echo "  ✅ Git aliases created"

# ==========================================
# 4. Test Configuration
# ==========================================
echo ""
echo "🧪 Testing configuration..."

# Test delta
if command -v delta &> /dev/null; then
    echo "  ✅ Delta: $(delta --version | head -n1)"
fi

# Test lazygit
if command -v lazygit &> /dev/null; then
    echo "  ✅ LazyGit: $(lazygit --version)"
fi

echo ""
echo "✅ Git tools setup complete!"
echo ""
echo "📝 Available commands:"
echo "  git visual       - Open LazyGit"
echo "  git lg           - Pretty log"
echo "  git st           - Short status"
echo "  git amend        - Amend last commit"
echo "  git undo         - Undo last commit"
echo ""
echo "🎨 Try it:"
echo "  git visual"
echo "  git lg"
echo "  git diff (with delta highlighting)"
echo ""

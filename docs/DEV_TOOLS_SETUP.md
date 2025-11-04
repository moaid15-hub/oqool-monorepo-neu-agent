# 🛠️ دليل تثبيت أدوات التطوير - Dev Tools Setup Guide

**التاريخ**: 2025-11-04
**النظام**: Linux (Ubuntu/Debian)

---

## 📋 جدول المحتويات

1. [Code Intelligence Tools](#code-intelligence)
2. [Git Enhancement Tools](#git-enhancement)
3. [Performance & Profiling](#performance)
4. [تثبيت سريع (Quick Install)](#quick-install)
5. [التكوينات](#configuration)

---

## 🔍 Code Intelligence Tools {#code-intelligence}

### 1. ripgrep (rg) - بحث سريع جداً

**الوصف**: أداة بحث فائقة السرعة، أسرع من grep بـ 10x

```bash
# Ubuntu/Debian
sudo apt install ripgrep

# أو من GitHub
curl -LO https://github.com/BurntSushi/ripgrep/releases/download/14.1.0/ripgrep_14.1.0-1_amd64.deb
sudo dpkg -i ripgrep_14.1.0-1_amd64.deb
```

**الاستخدام**:
```bash
# بحث في جميع الملفات
rg "pattern"

# بحث في نوع معين من الملفات
rg "pattern" --type typescript

# بحث مع سياق
rg "pattern" -C 3

# تجاهل case
rg "pattern" -i
```

**التكوين** (`.ripgreprc`):
```bash
# عدد الأسطر قبل وبعد
--context=2

# إظهار أرقام الأسطر
--line-number

# الألوان
--colors=line:fg:yellow
--colors=match:fg:green
```

---

### 2. fd - بديل أسرع لـ find

**الوصف**: بحث عن الملفات، أسرع وأسهل من find

```bash
# Ubuntu/Debian
sudo apt install fd-find

# إنشاء alias
echo "alias fd='fdfind'" >> ~/.bashrc
source ~/.bashrc
```

**الاستخدام**:
```bash
# بحث عن ملف
fd filename

# بحث عن ملفات TypeScript
fd -e ts

# بحث في مجلد معين
fd pattern src/

# استبعاد مجلدات
fd pattern --exclude node_modules
```

---

### 3. bat - عرض ملفات بألوان

**الوصف**: بديل لـ cat مع syntax highlighting

```bash
# Ubuntu/Debian
sudo apt install bat

# إنشاء alias
echo "alias cat='batcat'" >> ~/.bashrc
source ~/.bashrc
```

**الاستخدام**:
```bash
# عرض ملف
bat file.ts

# مع أرقام أسطر
bat -n file.ts

# عرض تغييرات git
bat --diff file.ts

# theme
bat --theme="Monokai Extended" file.ts
```

**التكوين** (`~/.config/bat/config`):
```bash
--theme="Monokai Extended"
--style="numbers,changes,header"
--italic-text=always
```

---

### 4. eza - بديل محسّن لـ ls

**الوصف**: ls مع ألوان وأيقونات وشجرة

```bash
# من Cargo (Rust)
cargo install eza

# أو من GitHub releases
wget -c https://github.com/eza-community/eza/releases/latest/download/eza_x86_64-unknown-linux-gnu.tar.gz -O - | tar xz
sudo chmod +x eza
sudo mv eza /usr/local/bin/
```

**الاستخدام**:
```bash
# عرض عادي مع أيقونات
eza --icons

# عرض شجرة
eza --tree --level=2

# تفاصيل كاملة
eza -la --git --icons

# ترتيب حسب التاريخ
eza -la --sort=modified
```

**Aliases** (`~/.bashrc`):
```bash
alias ls='eza --icons'
alias ll='eza -la --git --icons'
alias tree='eza --tree --level=3 --icons'
```

---

### 5. jq - معالجة JSON

**الوصف**: أداة قوية لمعالجة وتحليل JSON

```bash
# Ubuntu/Debian
sudo apt install jq
```

**الاستخدام**:
```bash
# عرض JSON منسق
cat package.json | jq '.'

# استخراج قيمة
jq '.version' package.json

# filter
jq '.dependencies | keys' package.json

# تحويل
echo '{"name":"test"}' | jq '.name = "new"'
```

**أمثلة متقدمة**:
```bash
# عرض جميع dependencies
jq '.dependencies + .devDependencies' package.json

# عد العناصر
jq '.dependencies | length' package.json

# filter حسب شرط
jq '.scripts | to_entries | map(select(.key | startswith("test")))' package.json
```

---

## 🎨 Git Enhancement Tools {#git-enhancement}

### 6. lazygit - واجهة TUI لـ Git

**الوصف**: واجهة terminal تفاعلية لـ Git

```bash
# من binary
LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
tar xf lazygit.tar.gz lazygit
sudo install lazygit /usr/local/bin
rm lazygit lazygit.tar.gz
```

**الاستخدام**:
```bash
# تشغيل lazygit
lazygit

# في مجلد معين
lazygit -p /path/to/repo
```

**الاختصارات الأساسية**:
- `1-5`: التنقل بين panels
- `c`: commit
- `P`: push
- `p`: pull
- `a`: stage/unstage
- `d`: diff
- `q`: خروج

**التكوين** (`~/.config/lazygit/config.yml`):
```yaml
gui:
  theme:
    activeBorderColor:
      - green
      - bold
    inactiveBorderColor:
      - white
  showFileTree: true
  showRandomTip: false
  nerdFontsVersion: "3"

git:
  paging:
    colorArg: always
    pager: delta --dark --paging=never
```

---

### 7. git-delta - diff أفضل

**الوصف**: عرض git diff بألوان وتنسيق أفضل

```bash
# من GitHub releases
wget https://github.com/dandavison/delta/releases/download/0.17.0/git-delta_0.17.0_amd64.deb
sudo dpkg -i git-delta_0.17.0_amd64.deb
```

**التكوين** (`~/.gitconfig`):
```ini
[core]
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    navigate = true
    light = false
    line-numbers = true
    side-by-side = true

[merge]
    conflictstyle = diff3

[diff]
    colorMoved = default
```

**الاستخدام**:
```bash
# diff عادي (سيستخدم delta تلقائياً)
git diff

# diff بين branches
git diff main..feature

# diff staged
git diff --cached

# log مع diff
git log -p
```

---

### 8. commitizen ✅ (مثبت)

**الحالة**: ✅ مثبت ومُفعّل

**الاستخدام**:
```bash
npm run commit
# أو
make commit
```

انظر: `docs/COMMITIZEN_GUIDE.md`

---

### 9. husky ✅ (مثبت)

**الحالة**: ✅ مثبت ومُفعّل

**Hooks المُفعّلة**:
- `.husky/pre-commit` - تشغيل الاختبارات
- `.husky/commit-msg` - التحقق من رسالة commit

---

## 📊 Performance & Profiling {#performance}

### 10. hyperfine - Benchmarking دقيق

**الوصف**: أداة لقياس أداء الأوامر بدقة

```bash
# من GitHub releases
wget https://github.com/sharkdp/hyperfine/releases/download/v1.18.0/hyperfine_1.18.0_amd64.deb
sudo dpkg -i hyperfine_1.18.0_amd64.deb
```

**الاستخدام**:
```bash
# مقارنة بين أمرين
hyperfine 'npm run build' 'npm run build:prod'

# مع warmup
hyperfine --warmup 3 'npm test'

# تصدير النتائج
hyperfine --export-json results.json 'command'

# تصدير markdown
hyperfine --export-markdown results.md 'cmd1' 'cmd2'
```

**مثال عملي**:
```bash
# مقارنة أدوات البحث
hyperfine --warmup 3 \
  'grep -r "pattern" src/' \
  'rg "pattern" src/' \
  'git grep "pattern" src/'
```

---

### 11. tokei - إحصائيات الكود

**الوصف**: حساب أسطر الكود بسرعة

```bash
# من Cargo
cargo install tokei

# أو من GitHub releases
wget https://github.com/XAMPPRocky/tokei/releases/download/v12.1.2/tokei-x86_64-unknown-linux-gnu.tar.gz
tar xzf tokei-x86_64-unknown-linux-gnu.tar.gz
sudo mv tokei /usr/local/bin/
```

**الاستخدام**:
```bash
# إحصائيات المشروع الحالي
tokei

# مع تفاصيل كل ملف
tokei --files

# نوع معين
tokei --type typescript

# تنسيق JSON
tokei --output json

# exclude directories
tokei --exclude node_modules dist
```

**مثال النتيجة**:
```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 TypeScript            127        25684        21234         2450         2000
 JavaScript             45         8934         7234          800          900
 Markdown               15         3456         2800          456          200
 JSON                   12         1234         1234            0            0
===============================================================================
 Total                 199        39308        32502         3706         3100
===============================================================================
```

---

## 🚀 تثبيت سريع (Quick Install) {#quick-install}

### جميع الأدوات دفعة واحدة:

```bash
#!/bin/bash
# install-dev-tools.sh

echo "🚀 Installing Dev Tools..."

# ripgrep
echo "📦 Installing ripgrep..."
sudo apt install -y ripgrep

# fd
echo "📦 Installing fd..."
sudo apt install -y fd-find
echo "alias fd='fdfind'" >> ~/.bashrc

# bat
echo "📦 Installing bat..."
sudo apt install -y bat
echo "alias cat='batcat'" >> ~/.bashrc

# jq
echo "📦 Installing jq..."
sudo apt install -y jq

# eza (requires Rust/Cargo)
echo "📦 Installing eza..."
if ! command -v cargo &> /dev/null; then
    echo "⚠️  Cargo not found. Install Rust first:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
else
    cargo install eza
fi

# lazygit
echo "📦 Installing lazygit..."
LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
tar xf lazygit.tar.gz lazygit
sudo install lazygit /usr/local/bin
rm lazygit lazygit.tar.gz

# git-delta
echo "📦 Installing git-delta..."
wget https://github.com/dandavison/delta/releases/download/0.17.0/git-delta_0.17.0_amd64.deb
sudo dpkg -i git-delta_0.17.0_amd64.deb
rm git-delta_0.17.0_amd64.deb

# hyperfine
echo "📦 Installing hyperfine..."
wget https://github.com/sharkdp/hyperfine/releases/download/v1.18.0/hyperfine_1.18.0_amd64.deb
sudo dpkg -i hyperfine_1.18.0_amd64.deb
rm hyperfine_1.18.0_amd64.deb

# tokei
echo "📦 Installing tokei..."
if command -v cargo &> /dev/null; then
    cargo install tokei
else
    wget https://github.com/XAMPPRocky/tokei/releases/download/v12.1.2/tokei-x86_64-unknown-linux-gnu.tar.gz
    tar xzf tokei-x86_64-unknown-linux-gnu.tar.gz
    sudo mv tokei /usr/local/bin/
    rm tokei-x86_64-unknown-linux-gnu.tar.gz
fi

echo "✅ Installation complete!"
echo "🔄 Reload shell: source ~/.bashrc"
```

**تشغيل**:
```bash
chmod +x scripts/install-dev-tools.sh
./scripts/install-dev-tools.sh
```

---

## ⚙️ التكوينات {#configuration}

### 1. ملف .ripgreprc

```bash
# ~/.ripgreprc
--context=2
--line-number
--colors=line:fg:yellow
--colors=match:fg:green
--smart-case
--hidden
--glob=!.git/
--glob=!node_modules/
--glob=!dist/
--glob=!build/
```

**تفعيل**:
```bash
echo 'export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"' >> ~/.bashrc
```

---

### 2. ملف .fdignore

```bash
# ~/.fdignore
node_modules/
dist/
build/
.git/
*.log
.cache/
```

---

### 3. bat config

```bash
# ~/.config/bat/config
--theme="Monokai Extended"
--style="numbers,changes,header"
--italic-text=always
--paging=never
```

---

### 4. git-delta config

```bash
# ~/.gitconfig
[core]
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    navigate = true
    light = false
    line-numbers = true
    side-by-side = true
    syntax-theme = Monokai Extended

[merge]
    conflictstyle = diff3

[diff]
    colorMoved = default
```

---

### 5. lazygit config

```yaml
# ~/.config/lazygit/config.yml
gui:
  theme:
    activeBorderColor:
      - green
      - bold
    inactiveBorderColor:
      - white
  showFileTree: true
  showRandomTip: false
  nerdFontsVersion: "3"

git:
  paging:
    colorArg: always
    pager: delta --dark --paging=never

  commit:
    signOff: false

customCommands:
  - key: '<c-c>'
    command: 'npm run commit'
    description: 'Commitizen'
    context: 'files'
```

---

## 📊 جدول الأدوات

| الأداة | الحالة | الأولوية | التثبيت |
|--------|--------|----------|---------|
| ripgrep | ❌ | 🔴 عالية | `apt install ripgrep` |
| fd | ❌ | 🔴 عالية | `apt install fd-find` |
| bat | ❌ | 🟡 متوسطة | `apt install bat` |
| eza | ❌ | 🟡 متوسطة | `cargo install eza` |
| jq | ❌ | 🔴 عالية | `apt install jq` |
| lazygit | ❌ | 🟢 اختيارية | binary من GitHub |
| git-delta | ❌ | 🟡 متوسطة | .deb من GitHub |
| commitizen | ✅ | ✅ مثبت | `npm` |
| husky | ✅ | ✅ مثبت | `npm` |
| hyperfine | ❌ | 🟢 اختيارية | .deb من GitHub |
| tokei | ❌ | 🟡 متوسطة | `cargo install` |

---

## 🎯 التوصيات

### الأساسية (يجب تثبيتها):
1. ✅ **ripgrep** - بحث سريع أساسي
2. ✅ **fd** - بحث عن ملفات أساسي
3. ✅ **jq** - معالجة JSON أساسية

### المحسّنات (موصى بها):
4. **bat** - عرض ملفات أفضل
5. **git-delta** - diff أفضل
6. **eza** - ls أفضل
7. **tokei** - إحصائيات الكود

### الاختيارية (Nice to have):
8. **lazygit** - واجهة git تفاعلية
9. **hyperfine** - benchmarking

---

## 📝 ملاحظات

### متطلبات:
- **Rust/Cargo** لبعض الأدوات (eza, tokei)
- **wget/curl** للتحميل
- **sudo** لتثبيت system-wide

### بدائل:
- إذا لم يتوفر **cargo**: استخدم binary releases من GitHub
- إذا لم يتوفر **sudo**: ثبت في `~/.local/bin`

---

**تم الإنشاء**: 2025-11-04
**النظام**: Linux (Ubuntu/Debian)
**الحالة**: ✅ جاهز للتثبيت

🤖 Generated with [Claude Code](https://claude.com/claude-code)

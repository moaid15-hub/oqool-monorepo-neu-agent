# 🔧 دليل الإصلاح الكامل

## 🔴 المشاكل:
1. ❌ النافذة ما تتحرك
2. 🔵 شريط أزرق في الأسفل

---

## ✅ الحلول:

### **الحل 1: السحب (Dragging)**

#### **الخطوة 1 - في `electron/main.ts`:**

تأكد من:
```typescript
frame: false,              // بدون إطار ✅
titleBarStyle: 'hidden',   // إخفاء العنوان ✅
```

#### **الخطوة 2 - في `TopBar.css`:**

```css
.top-bar {
  -webkit-app-region: drag;  /* ← TopBar كله drag */
}

.menu-items,
.language-selector {
  -webkit-app-region: no-drag;  /* ← قابلة للنقر */
}

.search-input {
  -webkit-app-region: no-drag;  /* ← قابل للكتابة */
}
```

#### **الخطوة 3 - في `TopBar.tsx`:**

```tsx
<div className="top-bar">  {/* ← drag من CSS */}
  
  <div className="menu-items" style={{ WebkitAppRegion: 'no-drag' }}>
    {/* القوائم */}
  </div>
  
  <div className="search-bar">  {/* ← drag (مافيه no-drag) */}
    <input style={{ WebkitAppRegion: 'no-drag' }} />
  </div>
  
  <div style={{ WebkitAppRegion: 'no-drag' }}>
    {/* اللغة */}
  </div>
</div>
```

---

### **الحل 2: الشريط الأزرق**

#### **السبب:**
```css
.status-bar {
  background: #007acc;  /* ← هذا الأزرق! */
}
```

#### **الإصلاح:**

في `App.css` أو الملف اللي فيه `.status-bar`:

```css
/* خيار 1: رمادي غامق */
.status-bar {
  background: #2d2d30;
  color: #cccccc;
  border-top: 1px solid #3c3c3c;
}

/* خيار 2: أزرق VS Code */
.status-bar {
  background: #007acc;
  color: #ffffff;
  border-top: none;
}

/* خيار 3: أسود تماماً */
.status-bar {
  background: #1e1e1e;
  color: #858585;
  border-top: 1px solid #2d2d30;
}
```

---

## 🔍 **التشخيص:**

### **اختبار السحب:**

1. **افتح DevTools** (F12)
2. **اكتب في Console:**
```javascript
document.querySelector('.top-bar').style.webkitAppRegion
// يجب يطلع: "drag"

document.querySelector('.menu-items').style.webkitAppRegion
// يجب يطلع: "no-drag"
```

3. **جرب السحب من:**
   - ✅ المنطقة حول شريط البحث
   - ✅ المسافات الفارغة في TopBar
   - ❌ القوائم (لا يجب يسحب - قابلة للنقر)

---

## 📋 **Checklist:**

### **للسحب:**
- [ ] `frame: false` في main.ts
- [ ] `titleBarStyle: 'hidden'` في main.ts
- [ ] `-webkit-app-region: drag` في .top-bar
- [ ] `-webkit-app-region: no-drag` في العناصر القابلة للنقر
- [ ] منطقة البحث **بدون** no-drag

### **للشريط الأزرق:**
- [ ] تحقق من `.status-bar` في CSS
- [ ] غير `background` من أزرق لرمادي
- [ ] أزل أي `border-bottom` أزرق في TopBar
- [ ] أزل أي `outline` أزرق من focus states

---

## 🚀 **الملفات الجاهزة:**

- [main_fixed.ts](computer:///mnt/user-data/outputs/main_fixed.ts)
- [TopBar_Final.css](computer:///mnt/user-data/outputs/TopBar_Final.css)
- [StatusBar_Fix.css](computer:///mnt/user-data/outputs/StatusBar_Fix.css)

---

## 🎯 **الخطوات:**

1. **استبدل `electron/main.ts`** بالملف المحدث
2. **استبدل `TopBar.css`** بالملف المحدث
3. **أضف** الـ CSS للـ StatusBar
4. **أعد تشغيل** التطبيق:
```bash
npm run dev
```

---

## ⚠️ **إذا لم يشتغل:**

### **السحب:**
```bash
# 1. تأكد من إعادة التشغيل
Ctrl+C
npm run dev

# 2. Hard Reload
Ctrl+Shift+R في Electron
```

### **الشريط الأزرق:**
```bash
# ابحث عن:
grep -r "007acc" src/
grep -r "border.*blue" src/
grep -r "outline.*blue" src/
```

---

**الآن جرب وقل لي النتيجة!** 🚀

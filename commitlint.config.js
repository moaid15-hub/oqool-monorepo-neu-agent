module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // ميزة جديدة
        'fix',      // إصلاح
        'docs',     // توثيق
        'style',    // تنسيق
        'refactor', // إعادة هيكلة
        'perf',     // تحسين أداء
        'test',     // اختبارات
        'build',    // بناء
        'ci',       // CI/CD
        'chore',    // مهام
        'revert',   // تراجع
      ],
    ],
    'subject-case': [0], // السماح بأي حالة للموضوع (للعربية)
    'header-max-length': [2, 'always', 100],
  },
};

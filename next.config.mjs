/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist', // שנה את 'build' לשם התיקייה שתרצה
  env: {
    DATABASE_URL: process.env.DATABASE_URL, // הוסף את DATABASE_URL כאן
  },
  i18n: {
    locales: ['en', 'iw'],
    defaultLocale: 'en'
  },
};

export default nextConfig;

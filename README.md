CRUD Assignment – React + TypeScript + Ant Design

Bu proje kapsamında giriş (Login/Register) ekranı, Dashboard, Companies ve Products sayfaları geliştirdim.
Kullanıcılar kayıt olabilir, giriş yapabilir ve sisteme girdikten sonra şirket ve ürün tablolarında CRUD işlemleri gerçekleştirebilir.
Veriler mock olarak localStorage üzerinde tutulmakta ve dinamik olarak güncellenmektedir.

Kurulum

Projeyi çalıştırmak için:

npm install
npm run dev


Ardından tarayıcıdan http://localhost:5173
 adresine gidilebilir.

Demo Kullanıcı

Kullanıcı adı: admin
Şifre: admin

Özellikler

Login / Register: Kullanıcı giriş ve kayıt işlemleri

Dashboard: Toplam şirket ve ürün sayıları, son eklenen 3 şirket ve 3 ürün

Companies:

Şirket ekleme, düzenleme, silme

Sütunlar: Name, Legal Number, Country, Website

Arama, filtreleme, sıralama ve sayfalama

Şirket silindiğinde ona bağlı ürünler de otomatik silinir (cascade delete)

Products:

Ürün ekleme, düzenleme, silme

Sütunlar: Name, Category, Amount, Unit, Company

Company alanı Companies tablosu ile ilişkili (dropdown)

Arama, kategori filtresi, sıralama ve sayfalama

Kullanılan Teknolojiler

React (Vite)

TypeScript

Ant Design

React Router

localStorage (mock veri yönetimi)

Proje Yapısı
src/
  api/mock.ts
  components/AuthGate.tsx
  pages/
    AuthPage.tsx
    Dashboard.tsx
    CompaniesPage.tsx
    ProductsPage.tsx
  types.ts
  utils.ts
  App.tsx
  main.tsx
  styles.css

Notlar

Website alanında URL doğrulaması bulunmaktadır.

Veriler tarayıcıda localStorage üzerinde tutulduğu için sayfa yenilense bile korunur.

Projede TypeScript ile tip güvenliği sağlanmıştır.

Ant Design bileşenleri ile modern ve tutarlı bir arayüz oluşturulmuştur.

# 📅 System Rezerwacji

System rezerwacji stworzony w **React + Firebase**.  
Umożliwia użytkownikom tworzenie kont, rezerwowanie terminów, przeglądanie kalendarza i zarządzanie rezerwacjami.  
Stylizacja oparta o Material UI i FullCalendar z dynamicznym motywem jasny/ciemny 🌗

---

## 🚀 Funkcje

🔐 Rejestracja i logowanie użytkowników (e-mail + hasło)
📬 Resetowanie hasła przez e-mail + własna strona zmiany hasła (/reset-password)
🗓️ Tworzenie i przeglądanie rezerwacji
📆 Widok kalendarza (FullCalendar + Material UI)
🌒 Tryb jasny i ciemny
💄 Stylizacja kalendarza zgodna z kolorystyką aplikacji (różowo-bordowy motyw)
✅ Podświetlanie dnia dzisiejszego w kalendarzu
🧑‍💼 Panel administratora do zarządzania wszystkimi rezerwacjami i użytkownikami
🧾 Wyświetlanie imion i nazwisk zamiast e-maili (uczestnicy, organizatorzy)
🔄 Obsługa ról użytkowników (user / admin) – nadawana w Firebase
☁️ REST API przez Firebase Functions (opcjonalnie)
🌐 Responsywny interfejs i dynamiczne filtrowanie po nazwisku, statusie, itp.

---

## 🛠️ Instalacja

1. **Klonuj repozytorium:**

git clone https://github.com/Himcia/React-website.git
cd projekt-rezerwacje

2. **Zainstaluj zależności:**

npm install

3. **Zainstaluj dodatkowe biblioteki:**

npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

4. **Zainstaluj Firebase**

npm install firebase
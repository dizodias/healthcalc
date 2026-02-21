# 🍎 HealthCalc | Liquid Glass UI

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=flat-square&logo=expo)
![i18next](https://img.shields.io/badge/i18next-Internationalization-26A69A?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**HealthCalc** is a production-ready mobile application designed as a personal health assistant. Built with **React Native** and **Expo**, it showcases a highly scalable architecture, seamless internationalization, and a premium **Liquid Glass (Glassmorphism)** user interface.

## 🚀 The Engineering Approach

This project was built to demonstrate senior-level architectural patterns in mobile development:

* **Scalable Internationalization (i18n):** Fully integrated `react-i18next` with `AsyncStorage` persistence. Defaults to `en-US` with a seamless toggle to `pt-BR`.
* **Agnostic Business Logic:** Health formulas (Harris-Benedict, BMI) are completely decoupled from UI components and translated dynamically via dependency injection, adhering to Clean Code principles.
* **Performance Optimization:** Utilization of React hooks (`useMemo`, `useEffect`) to prevent unnecessary re-renders during form inputs and unit toggling.
* **Dynamic Measurement Systems:** Real-time conversion and UI adaptation between **Metric (KG/M/L)** and **Imperial (LBS/IN/OZ)** systems, ensuring a flawless localized UX.

## ✨ Premium UI/UX (Liquid Glass)

The interface follows strict **Apple Glass / Liquid Glass** aesthetics:
* Deep translucent layers using `expo-blur`.
* Smooth linear gradients for a liquid depth effect.
* Minimalist typography and layout for high scannability.
* Real-time Light/Dark mode switching.

## 📊 Core Features

* **Biological Profile:** Calculates BMI with color-coded risk diagnosis.
* **Smart Hydration:** Dynamic daily water intake goals based on activity levels.
* **TDEE Engine:** Calculates Total Daily Energy Expenditure based on age, gender, job environment, and workout frequency.
* **Actionable Plans:** Generates dynamic caloric goals (lose fat, maintain, or gain muscle) and suggests workout routines based on the user's data.

## 🛠 Tech Stack

* **Framework:** React Native (v0.81), Expo (SDK 54)
* **State & Performance:** React Hooks (`useState`, `useMemo`, `useEffect`)
* **Localization:** `i18next`, `react-i18next`
* **Local Storage:** `@react-native-async-storage/async-storage`
* **UI Libraries:** `expo-blur`, `expo-linear-gradient`, `@expo/vector-icons`

## 🏁 Getting Started

Clone the repository and run it locally:

```bash
# 1. Clone the repo
git clone [https://github.com/dizodias/healthcalc.git](https://github.com/dizodias/healthcalc.git)
cd healthcalc

# 2. Install dependencies
npm install

# 3. Start the Expo server (Clear cache recommended for fresh clones)
npm start -- -c
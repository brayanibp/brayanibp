"use client";
import { useState, useEffect } from "react";
import styles from "./theme-switcher.module.css";

export default function Component() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  }

  return (
    <button onClick={toggleTheme} className={styles["theme-switcher"]}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
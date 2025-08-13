"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./sections-nav.module.css";

type SectionLink = { id: string; label: string };

const humanize = (id: string) => id.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const SectionsNav = () => {
  const [sections, setSections] = useState<SectionLink[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const mapped: SectionLink[] = nodes.map(node => ({ id: node.id, label: humanize(node.id) }));
    setSections(mapped);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 1] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items = useMemo(() => sections.map((s) => (
    <li key={s.id}>
      <a
        href={`#${s.id}`}
        className={`${styles.link} ${activeId === s.id ? styles.active : ""}`}
        onClick={(e) => handleClick(e, s.id)}
      >
        {s.label}
      </a>
    </li>
  )), [sections, activeId]);

  if (sections.length === 0) return null;

  return (
    <nav aria-label="Sections" className={styles.nav}>
      <ul className={styles.list}>
        {items}
      </ul>
    </nav>
  );
}

export default SectionsNav; 
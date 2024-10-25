"use client";
import Image from "next/image";
import style from "./print-button.module.css";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };
  return (
    <button id="printer" className={style['print-button']} onClick={handlePrint}>
      <Image src="/assets/icons/printer.png" alt="Printer" width={16} height={16} title="Print"/>
    </button>
  );
}
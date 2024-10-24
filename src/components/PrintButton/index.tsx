"use client";
import Image from "next/image";
import style from "./print-button.module.css";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };
  return (
    <button className={style['print-button']} onClick={handlePrint}>Print <Image src="/assets/icons/printer.png" alt="Printer Icon" width={32} height={32} /></button>
  );
}
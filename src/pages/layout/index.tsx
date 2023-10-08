import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const Pointer = dynamic(()=>import("@/components/pointer"));
const Navbar = dynamic(()=>import("@/components/navbar"));

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div id="Layout">
      <Pointer></Pointer>
      <Navbar />
      <main id="Content">{children}</main>
    </div>
  );
}
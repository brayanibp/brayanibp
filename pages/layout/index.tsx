import Navbar from "@/components/navbar";
import Pointer from "@/components/pointer";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div id="Layout">
      <Pointer></Pointer>
      <Navbar />
      <main id="Content">{children}</main>
    </div>
  );
}
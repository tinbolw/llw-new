import React from "react";

export default function Header({children} : {children?: React.ReactNode }) {
  return <div className="w-screen justify-center flex my-2 font-sans">
    <h1 className="text-4xl">{children}</h1>
  </div>
}

import Link from "next/link";

export default function Page() {
  return <div className="flex justify-center">
    <main>
      <h1>There was an error processing your request.</h1>
      <Link href="/account">Back to Account</Link>
    </main>
  </div>
}

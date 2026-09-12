import Header from "@/components/ui/header";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <main>
        <Header>Ling Ling Website</Header>
        <div className="flex justify-center items-center">
          <Link className="text-xl underline" href="/account">Account</Link>
        </div>
      </main>
    </div>
  );
}

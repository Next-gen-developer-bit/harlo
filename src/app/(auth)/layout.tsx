import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface/50">
      <header className="px-6 py-6 md:px-8">
        <Link href="/" className="flex w-fit items-center">
          <Logo variant="dark" height={26} />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">{children}</main>
    </div>
  );
}

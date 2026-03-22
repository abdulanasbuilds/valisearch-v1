export function Footer() {
  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto flex flex-col items-center gap-3 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <span className="text-[10px] font-black text-white leading-none">V</span>
          </div>
          <span className="text-[13px] font-semibold">ValiSearch</span>
        </div>
        <p className="text-[11px] text-muted-foreground/40">
          © {new Date().getFullYear()} ValiSearch. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

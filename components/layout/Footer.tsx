export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 py-16 dark:border-neutral-900">
      <div className="mx-auto flex max-w-shell flex-col gap-2 px-6 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-50">
          Sensorial
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          기술, 디자인, 브랜드의 교차점. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

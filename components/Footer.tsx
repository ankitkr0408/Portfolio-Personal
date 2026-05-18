export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500">
        © {year} Ankit Kumar
      </div>
    </footer>
  );
}

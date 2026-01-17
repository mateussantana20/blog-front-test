export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000914] text-gray-500 py-10 text-center border-t border-gray-900 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm font-medium tracking-wide">
          &copy; {currentYear} PLAYREPORT. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

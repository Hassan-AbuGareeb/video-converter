import "./globals.css";

export const metadata = {
  title: "video conversion website",
  description: "convert any video to an mp3 file.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

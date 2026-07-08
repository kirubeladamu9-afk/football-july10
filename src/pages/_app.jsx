import "@/src/styles/index.scss";
import "@/src/styles/admin.scss";
import { AdminAuthProvider } from "@/src/context/AdminAuthContext";
import { AdminLanguageProvider } from "@/src/context/AdminLanguageContext";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function App({ Component, pageProps }) {
  return (
    <AdminAuthProvider>
      <AdminLanguageProvider>
        <Component {...pageProps} />
      </AdminLanguageProvider>
    </AdminAuthProvider>
  );
}

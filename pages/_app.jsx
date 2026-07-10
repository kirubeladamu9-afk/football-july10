import "@/src/styles/index.scss";
import "@/public/assets/scss/admin-panel.scss";
import { useRouter } from "next/router";
import { AuthProvider } from "@/src/admin/hooks/useAuth";
import { LanguageProvider } from "@/src/context/LanguageContext";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

function AppWrapper({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
      <AuthProvider>
        <LoadingSpinner />
        <Component {...pageProps} />
      </AuthProvider>
    );
  }

  return (
    <LanguageProvider>
      <LoadingSpinner />
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default AppWrapper;

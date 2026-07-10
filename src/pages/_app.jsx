import "@/src/styles/index.scss";
import "@/public/assets/scss/admin-panel.scss";
import { useRouter } from "next/router";
import { AuthProvider } from "@/src/admin/hooks/useAuth";
import { LanguageProvider } from "@/src/context/LanguageContext";
import ContextProvider from "@/src/context/ContextProvider";
import PageLoader from "@/src/components/common/PageLoader";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

function AppWrapper({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
      <AuthProvider>
        <PageLoader />
        <Component {...pageProps} />
      </AuthProvider>
    );
  }

  return (
    <LanguageProvider>
      <ContextProvider>
        <PageLoader />
        <Component {...pageProps} />
      </ContextProvider>
    </LanguageProvider>
  );
}

export default AppWrapper;

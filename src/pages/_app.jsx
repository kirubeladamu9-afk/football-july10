import "@/src/styles/index.scss";
import "@/public/assets/scss/admin-panel.scss";
import { useRouter } from "next/router";
import { AuthProvider } from "@/src/admin/hooks/useAuth";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

function AppWrapper({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  }

  return <Component {...pageProps} />;
}

export default AppWrapper;

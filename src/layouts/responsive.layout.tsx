import { PropsWithChildren } from "react";
import { useMediaQuery } from "react-responsive";

import DesktopLayout from "./desktop.layout";
import MobileLayout from "./mobile.layout";

const ResponsiveLayout = ({ children }: PropsWithChildren) => {
  const Desktop = () => {
    const isDesktop = useMediaQuery({ minWidth: 768 });
    return <>{isDesktop && <DesktopLayout>{children}</DesktopLayout>}</>;
  };
  const Mobile = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return <>{isMobile && <MobileLayout>{children}</MobileLayout>}</>;
  };

  return (
    <>
      <Desktop />
      <Mobile />
    </>
  );
};

export default ResponsiveLayout;

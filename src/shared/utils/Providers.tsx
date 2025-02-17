// "use client";
// import { NextUIProvider } from "@nextui-org/react";
// import { usePathname } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import DashboardSidebar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar";
// import { Toaster } from "react-hot-toast";
// import { addStripe } from "@/actions/add.stripe";

// interface ProviderProps {
//   children: React.ReactNode;
// }

// export default function Providers({ children }: ProviderProps) {
//   const pathname = usePathname();

//   const { isLoaded, user } = useUser();

//   const isStripeCustomerIdHas = async () => {
//     await addStripe();
//   };

//   if (!isLoaded) {
//     return null;
//   } else {
//     if (user) {
//       isStripeCustomerIdHas();
//     }
//   }

//   return (
//     <NextUIProvider>
//       {pathname !== "/dashboard/new-email" &&
//       pathname !== "/" &&
//       pathname !== "/sign-up" &&
//       pathname !== "/subscribe" &&
//       pathname !== "/success" &&
//       pathname !== "/sign-in" ? (
//         <div className="w-full flex">
//           <div className="w-[290px] h-screen overflow-y-scroll">
//             <DashboardSidebar />
//           </div>
//           {children}
//         </div>
//       ) : (
//         <>{children}</>
//       )}
//       <Toaster position="top-center" reverseOrder={false} />
//     </NextUIProvider>
//   );
// }


"use client";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import DashboardSidebar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar";
import { Toaster } from "react-hot-toast";
import { addStripe } from "@/actions/add.stripe";
import { useEffect, useState } from "react";

interface ProviderProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();
  const [hasCheckedStripe, setHasCheckedStripe] = useState(false);

  useEffect(() => {
    const checkStripeCustomer = async () => {
      if (user && !hasCheckedStripe) {
        await addStripe();
        setHasCheckedStripe(true); // Ensure it runs only once
      }
    };

    checkStripeCustomer();
  }, [user, hasCheckedStripe]);

  if (!isLoaded) return null;

  return (
    <NextUIProvider>
      {pathname !== "/dashboard/new-email" &&
      pathname !== "/" &&
      pathname !== "/sign-up" &&
      pathname !== "/subscribe" &&
      pathname !== "/success" &&
      pathname !== "/sign-in" ? (
        <div className="w-full flex">
          <div className="w-[290px] h-screen overflow-y-scroll">
            <DashboardSidebar />
          </div>
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </NextUIProvider>
  );
}

"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";

type PlanId = "starter_30" | "pro_60";
type CheckoutPayload = {
  key: string;
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  description: string;
  error?: string;
};

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccess) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

const plans: Array<{
  id: PlanId;
  title: string;
  price: string;
  subtitle: string;
}> = [
  {
    id: "starter_30",
    title: "Starter",
    price: "$30",
    subtitle: "Good for individual developers getting started.",
  },
  {
    id: "pro_60",
    title: "Pro",
    price: "$60",
    subtitle: "Best for frequent usage and team collaboration.",
  },
];

function PricingContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status");

  const loadRazorpayScript = async () => {
    if (window.Razorpay) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = (plan: PlanId) => {
    setError(null);
    setLoadingPlan(plan);

    startTransition(async () => {
      try {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded || !window.Razorpay) {
          throw new Error("Unable to load Razorpay checkout.");
        }

        const response = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }),
        });

        const payload = (await response.json()) as CheckoutPayload;
        if (!response.ok || !payload.orderId) {
          throw new Error(payload.error || "Unable to start checkout.");
        }

        const checkout = new window.Razorpay({
          key: payload.key,
          amount: payload.amount,
          currency: payload.currency,
          name: payload.name,
          description: payload.description,
          order_id: payload.orderId,
          handler: async (razorpayResponse) => {
            try {
              const verifyResponse = await fetch("/api/payments/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(razorpayResponse),
              });

              if (!verifyResponse.ok) {
                const verifyPayload = (await verifyResponse.json()) as { error?: string };
                throw new Error(verifyPayload.error || "Payment verification failed.");
              }

              window.location.assign("/pricing?status=success");
            } catch (verificationError) {
              const message =
                verificationError instanceof Error
                  ? verificationError.message
                  : "Payment verification failed.";
              setError(message);
              setLoadingPlan(null);
            }
          },
          modal: {
            ondismiss: () => {
              window.location.assign("/pricing?status=cancel");
            },
          },
          theme: {
            color: "#0F0F0F",
          },
        });

        checkout.open();
      } catch (checkoutError) {
        const message =
          checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.";
        setError(message);
        setLoadingPlan(null);
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28 gap-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              pricing
            </h1>
            <p className="max-w-xl text-[#919191]">
              Pick a plan and complete checkout securely with{" "}
              <span className="text-[#000000]">Razorpay</span>.
            </p>
          </div>

          {status === "success" && (
            <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-[#CFE5D0] bg-[#F3FAF3] px-4 py-3 text-center text-sm font-medium text-[#4E7B50]">
              Payment successful. Thank you for your purchase.
            </div>
          )}
          {status === "cancel" && (
            <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-[#F1C9C9] bg-[#FFF1F1] px-4 py-3 text-center text-sm font-medium text-[#B04E4E]">
              Checkout canceled. No charge was made.
            </div>
          )}
          {error && (
            <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-[#F1C9C9] bg-[#FFF1F1] px-4 py-3 text-center text-sm font-medium text-[#B04E4E]">
              {error}
            </div>
          )}

          <div className="mt-12 flex w-full flex-col gap-3 lg:flex-row">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white"
              >
                <div className="space-y-4 p-7">
                  <h2 className="text-2xl font-medium">{plan.title}</h2>
                  <p className="font-pixelify text-5xl text-[#D8D8D8]">{plan.price}</p>
                  <p className="text-sm leading-7 text-[#B8B8B8]">{plan.subtitle}</p>
                </div>
                <div className=" p-7 pt-5">
                  <button
                    type="button"
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isPending && loadingPlan === plan.id}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white px-4 py-2 text-md font-semibold text-black transition hover:bg-[#DADADA] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending && loadingPlan === plan.id ? "Opening checkout..." : `Pay`}
                  </button>
                </div>
              </article>
            ))}

            <article className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
              <div className="space-y-4 p-7">
                <h2 className="text-2xl font-semibold">Enterprise</h2>
                <p className="font-pixelify text-5xl text-[#D8D8D8]">Custom</p>
                <p className="text-sm leading-7 text-[#B8B8B8]">
                  Need team onboarding, custom limits, or billing terms? Let&apos;s tailor a
                  package for your organization.
                </p>
              </div>
              <div className="p-7 pt-3">
                <a
                  href="mailto:issues@nap-code.com?subject=Enterprise%20Plan%20Inquiry"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-transparent px-4 py-2 text-md font-semibold text-white transition hover:bg-white/10"
                >
                  Contact us
                </a>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFCFC]" />}>
      <PricingContent />
    </Suspense>
  );
}

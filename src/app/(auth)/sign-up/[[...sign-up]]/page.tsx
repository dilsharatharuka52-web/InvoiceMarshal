import { SignUp } from "@clerk/nextjs";

const hasClerkPublishableKey =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

export default function SignUpPage() {
  if (!hasClerkPublishableKey) {
    return (
      <div className="gradient-brand-soft min-h-dvh px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-brand-100 bg-white p-8 shadow-violet-lg">
          <h1 className="text-2xl font-bold text-brand-700">Configure Clerk to continue</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Replace the placeholder values in `.env.local` with your real Clerk publishable and
            secret keys to enable registration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="gradient-brand-soft min-h-dvh px-4 py-6 sm:px-6 sm:py-10"
      id="clerk-captcha"
    >
      <div className="mx-auto flex w-full justify-center">
        <SignUp
          path="/sign-up"
          routing="path"
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              cardBox: "w-full",
              card: "w-full border border-brand-100 shadow-violet-lg",
              header: "pt-1",
              headerTitle: "text-2xl font-bold text-brand-700",
              headerSubtitle: "text-sm text-gray-500",
              formButtonPrimary: "gradient-brand hover:opacity-90",
              footerActionLink: "text-brand-600",
            },
            layout: {
              animations: false,
            },
          }}
        />
      </div>
    </div>
  );
}
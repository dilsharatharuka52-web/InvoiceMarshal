import { SignIn } from "@clerk/nextjs";

const hasClerkPublishableKey =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

export default function SignInPage() {
  if (!hasClerkPublishableKey) {
    return (
      <div className="gradient-brand-soft flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-brand-100 bg-white p-8 shadow-violet-lg">
          <h1 className="text-2xl font-bold text-brand-700">Configure Clerk to continue</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Replace the placeholder values in `.env.local` with your real Clerk publishable and
            secret keys to enable authentication screens.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-brand-soft flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-brand-700">Welcome Back</h1>
          <p className="mt-1 text-gray-500">Sign in to your InvoiceMarshal account</p>
        </div>
        <SignIn
          path="/sign-in"
          routing="path"
          appearance={{
            elements: {
              card: "shadow-violet-lg border border-brand-100",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-brand-200 hover:bg-brand-50",
              formButtonPrimary: "gradient-brand hover:opacity-90",
              footerActionLink: "text-brand-600",
            },
          }}
        />
      </div>
    </div>
  );
}

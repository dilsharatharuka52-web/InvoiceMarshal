import { SignIn } from "@clerk/nextjs";

const hasClerkPublishableKey =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

export default function SignInPage() {
  if (!hasClerkPublishableKey) {
    return (
      <div className="gradient-brand-soft min-h-dvh px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-brand-100 bg-white p-8 shadow-violet-lg">
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
    <div className="gradient-brand-soft min-h-dvh overflow-y-auto px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full justify-center">
        <SignIn
          path="/sign-in"
          routing="path"
          appearance={{
            elements: {
              rootBox: "block w-full max-w-md !overflow-visible",
              cardBox: "block w-full !overflow-visible",
              card: "w-full !overflow-visible border border-brand-100 shadow-violet-lg",
              main: "!overflow-visible",
              form: "!overflow-visible",
              formContainer: "!overflow-visible",
              header: "pt-1",
              headerTitle: "text-2xl font-bold text-brand-700",
              headerSubtitle: "text-sm text-gray-500",
              socialButtonsBlockButton: "border-brand-200 hover:bg-brand-50",
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

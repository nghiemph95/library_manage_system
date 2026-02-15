"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "@/components/FileUpload";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
  /** Khi set, hiện nút "Continue as Guest" (chỉ dùng khi type = SIGN_IN). */
  onGuestLogin?: () => Promise<{ success: boolean; error?: string }>;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
  onGuestLogin,
}: Props<T>) => {
  const router = useRouter();
  const [guestLoading, setGuestLoading] = useState(false);

  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result.success) {
      toast({
        title: "Success",
        description: isSignIn
          ? "You have successfully signed in."
          : "You have successfully signed up.",
      });

      router.push("/?welcome=1");
    } else {
      toast({
        title: `Error ${isSignIn ? "signing in" : "signing up"}`,
        description: result.error ?? "An error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload your ID"
                        folder="ids"
                        variant="dark"
                        onFileChange={field.onChange}
                      />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="form-btn"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="btn-loading-spinner size-5" aria-hidden />
                {isSignIn ? "Signing in..." : "Creating account..."}
              </>
            ) : isSignIn ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>

          {isSignIn && onGuestLogin && (
            <div className="relative my-2">
              <span className="bg-dark-200 absolute inset-0 flex items-center">
                <span className="w-full border-t border-light-100/30" />
              </span>
              <p className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-light-100">
                <span className="bg-dark-200 px-2">or</span>
              </p>
            </div>
          )}

          {isSignIn && onGuestLogin && (
            <Button
              type="button"
              variant="outline"
              className="form-btn border border-light-100/40 bg-transparent text-light-100 hover:bg-white/10 hover:text-white"
              disabled={guestLoading || form.formState.isSubmitting}
              onClick={async () => {
                setGuestLoading(true);
                try {
                  const result = await onGuestLogin();
                  if (result.success) {
                    toast({
                      title: "Signed in as guest",
                      description:
                        "You can browse the library. Want to try Admin? See the banner below or check My Profile.",
                    });
                    router.push("/?welcome=1");
                  } else {
                    toast({
                      title: "Guest login failed",
                      description: result.error ?? "Try again or sign in with your account.",
                      variant: "destructive",
                    });
                  }
                } finally {
                  setGuestLoading(false);
                }
              }}
            >
              {guestLoading ? (
                <>
                  <Loader2 className="btn-loading-spinner size-5" aria-hidden />
                  Continuing as guest...
                </>
              ) : (
                "Continue as Guest"
              )}
            </Button>
          )}
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;

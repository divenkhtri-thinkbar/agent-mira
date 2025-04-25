import { AuthLayout } from "../../layouts/AuthLayout";
import { useState } from "react";
import {
  GoogleButton,
  InputField,
  Separator,
  SubmitButton,
} from "@/components/common";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <AuthLayout imageClassName="rounded-tr-[32px]">
      <div className="w-auto h-full bg-[#1354B6]  rounded-br-[32px] overflow-hidden">
        <div className="w-full relative bg-[#E3EEFF] px-6 pr-26 rounded-bl-[32px]  border-[#1354B6]">
          <h1 className="text-[#1354B6] font-[ClashDisplay-Medium] text-5xl leading-tight mx-auto">
            Let's craft a winning offer together!
          </h1>
        </div>
        {/* main div */}
        <div className="w-full p-6 h-full rounded-tr-2xl bg-[#1354B6]">
          <div className="max-w-[440px] mx-auto space-y-6 h-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <h2 className="text-white text-[22px] font-[Geologica] font-medium mt-10">
                  Log in
                </h2>
                <InputField
                  label="Email address"
                  type="email"
                  placeholder="Enter your e-mail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-between items-start">
                  <a
                    href="/forgot-password"
                    className="text-white font-[Geologica] font-normal underline text-base"
                  >
                    Forgot password?
                  </a>
                  <SubmitButton text="Submit" />
                </div>
              </div>
            </form>
            <Separator />
            {/* Buttons */}
            <div className="space-y-4">
              <GoogleButton width="w-full" />
              <div className="text-center">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full cursor-pointer font-[Geologica] text-[22px] font-normal h-12 bg-white hover:bg-gray-50 hover:text-[#1354B6] text-[#1354B6] rounded-full"
                >
                  Don't have an account?
                  <span className="font-semibold">Sign up</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

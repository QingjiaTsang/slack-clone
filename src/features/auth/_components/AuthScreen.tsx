'use client'

import { useState } from "react";

import SignIn from "@/features/auth/_components/SignIn"
import SignUp from "@/features/auth/_components/SignUp"

const AuthScreen = () => {
  // Note: different flow indicator for sign in and sign up in convex:
  // https://labs.convex.dev/auth/api_reference/providers/Password
  // https://labs.convex.dev/auth/config/passwords#add-sign-in-form
  const [flow, setFlow] = useState<"signUp" | "signIn">("signUp");

  const onToggleAuthCard = () => {
    setFlow(prev => prev === "signIn" ? "signUp" : "signIn")
  }

  return (
    <>
      {flow === "signIn" ? <SignIn onToggleAuthCard={onToggleAuthCard} /> : <SignUp onToggleAuthCard={onToggleAuthCard} />}
    </>
  )
}

export default AuthScreen
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

type OAuthButtonsProps = {
  onSignInWithOAuth: (provider: 'github' | 'google') => Promise<void>
}

const OAuthButtons = ({ onSignInWithOAuth }: OAuthButtonsProps) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Button variant="outline" className="gap-2" onClick={() => onSignInWithOAuth('google')}>
        <FcGoogle size={18} />
        <div>Continue with Google</div>
      </Button>
      <Button variant="outline" className="gap-2" onClick={() => onSignInWithOAuth('github')}>
        <FaGithub size={18} />
        <div>Continue with Github</div>
      </Button>
    </div>
  )
}

export default OAuthButtons

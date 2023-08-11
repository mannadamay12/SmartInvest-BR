import { ReactNode,FC } from "react";
import { Button } from "./ui/button"
import { useSession, signIn, signOut } from "next-auth/react"


interface GoogleSignInProps{
    children: ReactNode;
}

const GoogleSignIn:FC<GoogleSignInProps> = ({ children }) => {

    // const loginGoogle = () => console.log('yayaya google!');
    const { data: session } = useSession()
    if (session) {
        return (
        <>
            {/* Signed in as {session.user.email} <br /> */}
            <button onClick={() => signOut()}>Sign out</button>
        </>
        )
    }
  return (
    // <Button onClick={loginGoogle} className="w-full">{children}</Button>
    <Button onClick={() => signIn()} className="w-full">{children}</Button>
  )
}

export default GoogleSignIn
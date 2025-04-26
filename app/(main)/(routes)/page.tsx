import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton 
      afterSignOutUrl="/sign-in"
      />
      <p>Welcome to the application!</p>
      <p>Enjoy your stay!</p>
    </div>
  );
}

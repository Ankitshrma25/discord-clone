import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton 
      afterSignOutUrl="/sign-in"
      />
      <ModeToggle />
      <p>Welcome to the application!</p>
      <p>Enjoy your stay!</p>
      <p>Feel free to explore the features and functionalities.</p>
    </div>
  );
}

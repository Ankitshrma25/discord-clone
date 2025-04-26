import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton 
      afterSignOutUrl="/sign-in"
      />
      <p>Welcome to the application!</p>
      <p>Enjoy your stay!</p>
      <p>Feel free to explore the features and functionalities.</p>
    </div>
  );
}

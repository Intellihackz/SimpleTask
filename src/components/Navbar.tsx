import React from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">SimpleTask</h1>
        <div>
          <SignedIn>
            <div className="flex items-center pl-5">
              <span className="mr-4">
               <UserButton/>
              </span>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Log in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

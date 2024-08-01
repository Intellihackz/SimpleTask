import React from 'react';
import { LoginLink, LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const { user } = useKindeBrowserClient();

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">SimpleTask</h1>
        <div>
          {user ? (
            <>
              <span className="mr-4">Welcome, {user.given_name || user.email}</span>
              <LogoutLink>
                <Button variant="secondary">Log out</Button>
              </LogoutLink>
            </>
          ) : (
            <LoginLink>
              <Button variant="secondary">Log in</Button>
            </LoginLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
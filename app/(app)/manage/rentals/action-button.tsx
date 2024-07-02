"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode, useTransition } from "react";
import { toast } from "sonner";

interface ActionButtonProps {
  icon: ReactNode;
  action: () => Promise<void>;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, action, ...rest }) => {
  const [isPending, startTransition] = useTransition();
  const handleClick = () => {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Button 
      disabled={isPending}
      variant="outline"
      size="icon-sm"
      {...rest}
      onClick={handleClick} 
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : icon}
    </Button>
  );
};

export default ActionButton;

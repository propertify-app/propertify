import LayoutHeader from '@/components/client/layout-header';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import ActionButton from './action-button';

interface RentalLayoutProps {
  children: ReactNode;
}

export default async function RentalLayout({ children }: RentalLayoutProps) {
  const baseHref="/manage/rentals"
  return (<>
    <LayoutHeader name="Rentals" baseRef={baseHref} actions={
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <ActionButton icon={<Plus />} action={async () => {
              "use server"
              await new Promise(resolve => setTimeout(resolve, 1000));
              throw new Error("Error")
            }}/>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create rental</p>
          </TooltipContent>
        </Tooltip>
      </>
    } />
    {children}
  </>
  )
}
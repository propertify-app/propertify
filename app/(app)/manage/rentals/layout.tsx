import LayoutHeader from '@/components/client/layout-header';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { headerMolecule } from '@/lib/molecules/header';
import { getDefaultInjector } from 'bunshi';
import { useHydrateAtoms } from 'jotai/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface RentalLayoutProps {
  children: ReactNode;
}

export default async function RentalLayout({ children }: RentalLayoutProps) {
  const baseHref = '/manage/rentals';

  return (
    <>
        {/* <LayoutHeader
          name='Rentals'
          baseRef={baseHref}
          actions={
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size='sm'>
                    <Link href='/manage/rentals/create'>
                      <Plus />
                      Create rental
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create rental</p>
                </TooltipContent>
              </Tooltip>
            </>
          }
        /> */}
      {children}
    </>
  );
}

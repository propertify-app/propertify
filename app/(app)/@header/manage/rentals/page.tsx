import { HeaderBreadcrumbs } from '@/components/server/header-breadcrumbs';
import crumb from './crumb';
import { HeaderActions } from '@/components/server/header-actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default function RentalsHeader() {
  const breadcrumbs = [crumb];
  return (
    <>
      <HeaderBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeaderActions>
        <Button asChild size='sm'>
          <Link href='/manage/rentals/create'>
            <Plus />
            Create rental
          </Link>
        </Button>
      </HeaderActions>
    </>
  );
}

'use client';

import { companyMolecule, CompanyScope } from '@/lib/molecules/company';
import { ScopeProvider, useMolecule } from 'bunshi/react';
import { useAtomValue } from 'jotai';

export function Providers({ children }: { children: React.ReactNode }) {
  const { selectedCompanyAtom } = useMolecule(companyMolecule);
  const selectedCompany = useAtomValue(selectedCompanyAtom);

  return (
    <ScopeProvider value={selectedCompany?.id} scope={CompanyScope}>
      {children}
    </ScopeProvider>
  );
}

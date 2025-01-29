import { useMolecule } from 'bunshi/react';
import { useRouter as useNextRouter } from 'next/navigation';
import { globalModule } from '../molecules/global';
import { useAtomValue, useSetAtom } from 'jotai';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCallback } from 'react';

// Define a custom type that extends AppRouterInstance
export type CustomAppRouterInstance = {
    push: (...args: [...Parameters<AppRouterInstance['push']>, boolean?]) => void;
    back: (force?: boolean) => void;
    forward: (force?: boolean) => void;
    refresh: (force?: boolean) => void;
    replace: (...args: [...Parameters<AppRouterInstance['replace']>, boolean?]) => void;
    prefetch: AppRouterInstance['prefetch'];
};

// Custom useRouter hook
export function useRouter(): CustomAppRouterInstance {
    const router = useNextRouter();
    const { routerConfirmLeaveAtom, requestConfirmationAtom } = useMolecule(globalModule);
    const shouldConfirmLeave = useAtomValue(routerConfirmLeaveAtom);
    const requestConfirmation = useSetAtom(requestConfirmationAtom)

    const confirmNavigation = useCallback((action: () => void, force: boolean = false) => {
        if (force || !shouldConfirmLeave) {
            action();
        } else {
            requestConfirmation(action);
        }
    }, [shouldConfirmLeave, requestConfirmation]);

    const push = useCallback((...args: [...Parameters<typeof router.push>, boolean?]) => {
        const force = args.pop() as boolean;
        confirmNavigation(() => router.push(...args as Parameters<typeof router.push>), force);
    }, [confirmNavigation, router]);

    const back = useCallback((force: boolean = false) => {
        confirmNavigation(() => router.back(), force);
    }, [confirmNavigation, router]);

    const forward = useCallback((force: boolean = false) => {
        confirmNavigation(() => router.forward(), force);
    }, [confirmNavigation, router]);

    const refresh = useCallback((force: boolean = false) => {
        confirmNavigation(() => router.refresh(), force);
    }, [confirmNavigation, router]);

    const replace = useCallback((...args: [...Parameters<typeof router.replace>, boolean?]) => {
        const force = args.pop() as boolean;
        confirmNavigation(() => router.replace(...args as Parameters<typeof router.push>), force);
    }, [confirmNavigation, router]);

    const prefetch = useCallback((...args: Parameters<typeof router.prefetch>) => {
        router.prefetch(...args);
    }, [router]);

    return { push, back, forward, refresh, replace, prefetch };
}
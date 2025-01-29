export const runtime = 'edge';

export default async function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header className='sticky box-content grid h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar px-4 grid-cols-[minmax(0,_1fr)_auto] [grid-template-areas:"breadcrumbs_actions"] transition-[width,height] ease-linear empty:hidden group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      {children}
    </header>
  );
}

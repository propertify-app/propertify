import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Fragment } from 'react';
type Breadcrumb = {
  name: string
  href?: string
}

export function HeaderBreadcrumbs({breadcrumbs}: {breadcrumbs: Breadcrumb[]}) {

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className='[grid-area:breadcrumbs]'>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={`breadcrumb-${index}`}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href ?? '#'}>{crumb.name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

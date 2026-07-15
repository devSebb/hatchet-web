import * as React from "react";
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  passHref?: boolean;
  shallow?: boolean;
}
export default function Link({ href, children, as: _as, replace: _r, scroll: _s, prefetch: _p, locale: _l, legacyBehavior: _lb, passHref: _ph, shallow: _sh, ...rest }: LinkProps) {
  return <a href={href} {...rest}>{children}</a>;
}

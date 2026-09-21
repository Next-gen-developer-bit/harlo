import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';
import acceptLanguage from 'accept-language';
import {
  cookieName,
  headerName,
  languages,
} from '@gitroom/react/translation/i18n.config';
acceptLanguage.languages(languages);

const cookieDomain = () =>
  getCookieUrlFromDomain(process.env.FRONTEND_URL!);

const securedCookie = () =>
  !process.env.NOT_SECURED
    ? {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'none' as const,
        domain: cookieDomain(),
      }
    : { path: '/' };

const setOrgCookie = (response: NextResponse, token: string) => {
  response.cookies.set('org', token, {
    ...securedCookie(),
    expires: new Date(Date.now() + 15 * 60 * 1000),
  });
};

const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set('auth', '', {
    ...securedCookie(),
    maxAge: -1,
  });
};

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const nextUrl = request.nextUrl;
  const authCookie =
    request.cookies.get('auth') ||
    request.headers.get('auth') ||
    nextUrl.searchParams.get('loggedAuth');
  const lng = request.cookies.has(cookieName)
    ? acceptLanguage.get(request.cookies.get(cookieName).value)
    : acceptLanguage.get(
        request.headers.get('Accept-Language') ||
          request.headers.get('accept-language')
      );

  const requestHeaders = new Headers(request.headers);
  if (lng) {
    requestHeaders.set(headerName, lng);
  }

  const topResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (lng) {
    topResponse.headers.set(cookieName, lng);
  }

  if (nextUrl.pathname.startsWith('/modal/') && !authCookie) {
    return NextResponse.redirect(new URL(`/auth/login-required`, nextUrl.href));
  }

  const org = nextUrl.searchParams.get('org');
  const oauthCallback =
    nextUrl.searchParams.has('code') || nextUrl.searchParams.has('error');

  if (nextUrl.pathname === '/' && oauthCallback) {
    return NextResponse.redirect(
      new URL(`/login${nextUrl.search}`, nextUrl.href)
    );
  }

  if (
    (nextUrl.pathname === '/' && !org) ||
    nextUrl.pathname.startsWith('/uploads/') ||
    nextUrl.pathname.startsWith('/p/') ||
    nextUrl.pathname.startsWith('/provider/') ||
    nextUrl.pathname.startsWith('/icons/') ||
    nextUrl.pathname.startsWith('/landing') ||
    nextUrl.pathname.startsWith('/welcome') ||
    nextUrl.pathname.startsWith('/youtube') ||
    nextUrl.pathname.startsWith('/facebook') ||
    nextUrl.pathname.startsWith('/instagram') ||
    nextUrl.pathname.startsWith('/twitter') ||
    nextUrl.pathname.startsWith('/linkedin') ||
    nextUrl.pathname.startsWith('/tiktok') ||
    nextUrl.pathname.startsWith('/pinterest') ||
    nextUrl.pathname.startsWith('/threads') ||
    nextUrl.pathname.startsWith('/bluesky')
  ) {
    return topResponse;
  }

  if (
    nextUrl.pathname.startsWith('/integrations/social/') &&
    nextUrl.href.indexOf('state=login') === -1
  ) {
    return topResponse;
  }

  const isPublicAuthPath =
    nextUrl.pathname.startsWith('/auth') ||
    nextUrl.pathname === '/login' ||
    nextUrl.pathname === '/signup';
  const isInvitePath = nextUrl.pathname === '/auth/invite';
  const isInviteAuthForm =
    nextUrl.pathname === '/auth/login' ||
    nextUrl.pathname === '/login' ||
    nextUrl.pathname === '/signup';

  // If the URL is logout, delete the cookie and redirect to login
  if (nextUrl.href.indexOf('/auth/logout') > -1) {
    const afterLogout = org
      ? `/auth?org=${encodeURIComponent(org)}`
      : '/login';
    const response = NextResponse.redirect(
      new URL(afterLogout, nextUrl.href)
    );
    clearAuthCookie(response);
    if (org) {
      setOrgCookie(response, org);
    }
    return response;
  }

  if (
    (nextUrl.pathname.startsWith('/auth/register') ||
      nextUrl.pathname === '/signup') &&
    process.env.DISABLE_REGISTRATION === 'true'
  ) {
    return NextResponse.redirect(new URL('/login', nextUrl.href));
  }

  const url = new URL(nextUrl).search;
  if (!isPublicAuthPath && !authCookie) {
    const providers = ['google', 'settings'];
    const findIndex = providers.find((p) => nextUrl.href.indexOf(p) > -1);
    const additional = !findIndex
      ? ''
      : (url.indexOf('?') > -1 ? '&' : '?') +
        `provider=${(findIndex === 'settings'
          ? process.env.POSCALLY_GENERIC_OAUTH
            ? 'generic'
            : 'github'
          : findIndex
        ).toUpperCase()}`;
    const authPath = new URL(`/login${url}${additional}`, nextUrl.href);
    if (nextUrl.pathname.startsWith('/billing')) {
      authPath.searchParams.set(
        'returnUrl',
        `${nextUrl.origin}${nextUrl.pathname}${nextUrl.search}`
      );
    }
    return NextResponse.redirect(authPath);
  }

  if (org) {
    if (isInvitePath || (isInviteAuthForm && !authCookie)) {
      setOrgCookie(topResponse, org);
      return topResponse;
    }
    const redirect = NextResponse.redirect(
      new URL(`/auth/invite?org=${encodeURIComponent(org)}`, nextUrl.href)
    );
    setOrgCookie(redirect, org);
    return redirect;
  }

  // If the url is a public auth page and the cookie exists, redirect to /overview
  if (isPublicAuthPath && authCookie && !isInvitePath && !oauthCallback) {
    return NextResponse.redirect(new URL(`/overview${url}`, nextUrl.href));
  }
  if (isPublicAuthPath && !authCookie) {
    return topResponse;
  }
  if (nextUrl.pathname === '/') {
    return topResponse;
  }

  return topResponse;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
};

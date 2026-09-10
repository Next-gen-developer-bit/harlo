import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';
import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
import acceptLanguage from 'accept-language';
import {
  cookieName,
  headerName,
  languages,
} from '@gitroom/react/translation/i18n.config';
acceptLanguage.languages(languages);

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

  // If the URL is logout, delete the cookie and redirect to login
  if (nextUrl.href.indexOf('/auth/logout') > -1) {
    const response = NextResponse.redirect(
      new URL('/auth/login', nextUrl.href)
    );
    response.cookies.set('auth', '', {
      path: '/',
      ...(!process.env.NOT_SECURED
        ? {
            secure: true,
            httpOnly: true,
            sameSite: false,
          }
        : {}),
      maxAge: -1,
      domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
    });
    return response;
  }

  if (
    nextUrl.pathname.startsWith('/auth/register') &&
    process.env.DISABLE_REGISTRATION === 'true'
  ) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl.href));
  }

  const url = new URL(nextUrl).search;
  if (!nextUrl.pathname.startsWith('/auth') && !authCookie) {
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
    const authPath = new URL(`/auth${url}${additional}`, nextUrl.href);
    if (nextUrl.pathname.startsWith('/billing')) {
      authPath.searchParams.set(
        'returnUrl',
        `${nextUrl.origin}${nextUrl.pathname}${nextUrl.search}`
      );
    }
    return NextResponse.redirect(authPath);
  }

  // If the url is /auth and the cookie exists, redirect to /overview
  if (nextUrl.pathname.startsWith('/auth') && authCookie) {
    return NextResponse.redirect(new URL(`/overview${url}`, nextUrl.href));
  }
  if (nextUrl.pathname.startsWith('/auth') && !authCookie) {
    if (org) {
      const redirect = NextResponse.redirect(new URL(`/overview`, nextUrl.href));
      redirect.cookies.set('org', org, {
        ...(!process.env.NOT_SECURED
          ? {
              path: '/',
              secure: true,
              httpOnly: true,
              sameSite: false,
              domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
            }
          : {}),
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });
      return redirect;
    }
    return topResponse;
  }
  try {
    if (org) {
      const joinResponse = await internalFetch('/user/join-org', {
        body: JSON.stringify({
          org,
        }),
        method: 'POST',
      });
      const payload = await joinResponse.json().catch(() => ({}));
      const id = payload?.id;
      if (!joinResponse.ok || !id) {
        return NextResponse.redirect(
          new URL('/overview?invite=invalid', nextUrl.href)
        );
      }
      const redirect = NextResponse.redirect(
        new URL(`/overview?added=true`, nextUrl.href)
      );
      redirect.cookies.set('showorg', id, {
        ...(!process.env.NOT_SECURED
          ? {
              path: '/',
              secure: true,
              httpOnly: true,
              sameSite: false,
              domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
            }
          : {}),
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });
      return redirect;
    }
    if (nextUrl.pathname === '/') {
      return topResponse;
    }

    return topResponse;
  } catch (err) {
    console.log('err', err);
    return NextResponse.redirect(
      new URL('/overview?invite=error', nextUrl.href)
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
};
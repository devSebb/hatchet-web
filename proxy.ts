import { NextResponse, type NextRequest } from "next/server";

const BASIC_AUTH_USERNAME = "admin";
const BASIC_AUTH_PASSWORD = "hatchet26";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const [scheme, encodedCredentials] = authHeader.split(" ");
  if (scheme !== "Basic" || !encodedCredentials) return false;

  try {
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");
    if (separatorIndex === -1) return false;

    const username = decodedCredentials.slice(0, separatorIndex);
    const password = decodedCredentials.slice(separatorIndex + 1);

    return (
      username === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD
    );
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Hatchet", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf|otf|css|js|map)).*)",
  ],
};

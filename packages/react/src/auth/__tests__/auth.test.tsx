import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { AuthProvider, useAuth, useUser, useAuthClient, AuthGuard } from '../index';
import type { AuthConfig } from '@cohostvip/cohost-auth';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockOkResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => ({ status: 'ok', data }),
});

const defaultConfig: AuthConfig = {
  apiUrl: 'https://api.example.com',
  storage: 'memory',
  autoRefresh: false,
};

describe('AuthProvider', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should render children', () => {
    render(
      <AuthProvider config={defaultConfig}>
        <div data-testid="child">Hello</div>
      </AuthProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should provide auth context to children', () => {
    function TestComponent() {
      const auth = useAuth();
      return <div data-testid="has-auth">{auth ? 'yes' : 'no'}</div>;
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('has-auth')).toHaveTextContent('yes');
  });

  it('should initialize and eventually set not authenticated', async () => {
    function TestComponent() {
      const { state } = useAuth();
      return (
        <div>
          <span data-testid="loading">{state.isLoading ? 'yes' : 'no'}</span>
          <span data-testid="authenticated">
            {state.isAuthenticated ? 'yes' : 'no'}
          </span>
        </div>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('no');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
  });
});

describe('useAuth', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should throw if used outside AuthProvider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function TestComponent() {
      useAuth();
      return null;
    }

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    spy.mockRestore();
  });

  it('should provide auth methods', () => {
    function TestComponent() {
      const { requestOTP, verifyOTP, signOut, getToken } = useAuth();
      return (
        <div data-testid="has-methods">
          {typeof requestOTP === 'function' &&
          typeof verifyOTP === 'function' &&
          typeof signOut === 'function' &&
          typeof getToken === 'function'
            ? 'yes'
            : 'no'}
        </div>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('has-methods')).toHaveTextContent('yes');
  });

  it('should call requestOTP successfully', async () => {
    mockFetch.mockResolvedValue(mockOkResponse({ sent: true }));

    let requestResult: boolean | null = null;

    function TestComponent() {
      const { requestOTP } = useAuth();

      React.useEffect(() => {
        requestOTP('test@example.com').then((result) => {
          requestResult = result;
        });
      }, [requestOTP]);

      return null;
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(requestResult).toBe(true);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/otp/request',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('test@example.com'),
      })
    );
  });

  it('should authenticate user with verifyOTP', async () => {
    const authResult = {
      user: {
        uid: '123',
        email: 'test@example.com',
        emailVerified: true,
        provider: 'otp',
        providerId: 'cohost',
      },
      customToken: 'jwt-token',
      isNewUser: false,
    };
    mockFetch.mockResolvedValue(mockOkResponse(authResult));

    function TestComponent() {
      const { state, verifyOTP } = useAuth();
      const [verified, setVerified] = React.useState(false);

      React.useEffect(() => {
        if (!verified) {
          setVerified(true);
          verifyOTP('test@example.com', '123456');
        }
      }, [verified, verifyOTP]);

      return (
        <div>
          <span data-testid="authenticated">
            {state.isAuthenticated ? 'yes' : 'no'}
          </span>
          <span data-testid="email">{state.user?.email || 'none'}</span>
        </div>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    });
    expect(screen.getByTestId('email')).toHaveTextContent('test@example.com');
  });
});

describe('useUser', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return null when not authenticated', async () => {
    function TestComponent() {
      const user = useUser();
      const { state } = useAuth();
      return (
        <div>
          <span data-testid="loading">{state.isLoading ? 'yes' : 'no'}</span>
          <span data-testid="user">{user ? user.email : 'null'}</span>
        </div>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('no');
    });
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  it('should return user when authenticated', async () => {
    const authResult = {
      user: {
        uid: '123',
        email: 'test@example.com',
        emailVerified: true,
        provider: 'otp',
        providerId: 'cohost',
      },
      customToken: 'jwt-token',
      isNewUser: false,
    };
    mockFetch.mockResolvedValue(mockOkResponse(authResult));

    function TestComponent() {
      const { verifyOTP } = useAuth();
      const user = useUser();
      const [verified, setVerified] = React.useState(false);

      React.useEffect(() => {
        if (!verified) {
          setVerified(true);
          verifyOTP('test@example.com', '123456');
        }
      }, [verified, verifyOTP]);

      return <div data-testid="user">{user ? user.email : 'null'}</div>;
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });
});

describe('useAuthClient', () => {
  it('should return the AuthClient instance', () => {
    function TestComponent() {
      const client = useAuthClient();
      return (
        <div data-testid="has-client">
          {client && typeof client.initialize === 'function' ? 'yes' : 'no'}
        </div>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('has-client')).toHaveTextContent('yes');
  });
});

describe('AuthGuard', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should show unauthenticated fallback when not authenticated', async () => {
    function TestComponent() {
      return (
        <AuthGuard
          loadingFallback={<div data-testid="loading">Loading...</div>}
          unauthenticatedFallback={<div data-testid="login">Please log in</div>}
        >
          <div data-testid="protected">Protected Content</div>
        </AuthGuard>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('should call onUnauthenticated callback when not authenticated', async () => {
    const onUnauthenticated = vi.fn();

    function TestComponent() {
      return (
        <AuthGuard onUnauthenticated={onUnauthenticated}>
          <div data-testid="protected">Protected Content</div>
        </AuthGuard>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(onUnauthenticated).toHaveBeenCalled();
    });
  });

  it('should show children when authenticated', async () => {
    const authResult = {
      user: {
        uid: '123',
        email: 'test@example.com',
        emailVerified: true,
        provider: 'otp',
        providerId: 'cohost',
      },
      customToken: 'jwt-token',
      isNewUser: false,
    };
    mockFetch.mockResolvedValue(mockOkResponse(authResult));

    function Wrapper() {
      const { verifyOTP, state } = useAuth();
      const [verified, setVerified] = React.useState(false);

      React.useEffect(() => {
        if (!verified && !state.isAuthenticated) {
          setVerified(true);
          verifyOTP('test@example.com', '123456');
        }
      }, [verified, verifyOTP, state.isAuthenticated]);

      return (
        <AuthGuard
          loadingFallback={<div data-testid="loading">Loading...</div>}
          unauthenticatedFallback={<div data-testid="login">Please log in</div>}
        >
          <div data-testid="protected">Protected Content</div>
        </AuthGuard>
      );
    }

    render(
      <AuthProvider config={defaultConfig}>
        <Wrapper />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('login')).not.toBeInTheDocument();
  });
});

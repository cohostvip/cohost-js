import React from 'react';

import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CohostProvider, useCohost } from '../src';

const TestComponent = () => {
  const client = useCohost();
  return <div>{client ? 'Connected' : 'Missing'}</div>;
};

const TestComponentWithAPI = () => {
  const { client } = useCohost();
  
  const handleClick = async () => {
    await client.events.list();
  };

  return (
    <div>
      <span>{client ? 'Connected' : 'Missing'}</span>
      <button onClick={handleClick}>Fetch Events</button>
    </div>
  );
};

describe('CohostProvider', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('provides the client context', () => {
    render(
      <CohostProvider token="test-key">
        <TestComponent />
      </CohostProvider>
    );

    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('sends bearer token in authorization header when making API calls', async () => {
    const testToken = 'test-token-123';
    
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
      headers: { get: () => 'application/json' }
    });

    render(
      <CohostProvider token={testToken}>
        <TestComponentWithAPI />
      </CohostProvider>
    );

    const button = screen.getByText('Fetch Events');
    
    await act(async () => {
      button.click();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.cohost.vip/v1/events',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${testToken}`
        })
      })
    );
  });

  it('includes bearer token in all API requests', async () => {
    const testToken = 'another-test-token';
    
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
      headers: { get: () => 'application/json' }
    });

    const TestMultipleAPICalls = () => {
      const { client } = useCohost();
      
      const handleMultipleCalls = async () => {
        await client.events.list();
        await client.events.fetch('evt_123');
        await client.cart.start({ contextId: 'evt_123', sessionContext: {} });
      };

      return (
        <button onClick={handleMultipleCalls}>Make Multiple API Calls</button>
      );
    };

    render(
      <CohostProvider token={testToken}>
        <TestMultipleAPICalls />
      </CohostProvider>
    );

    const button = screen.getByText('Make Multiple API Calls');
    
    await act(async () => {
      button.click();
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    
    // Check that all calls include the bearer token
    fetchMock.mock.calls.forEach(call => {
      expect(call[1]).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${testToken}`
          })
        })
      );
    });
  });

  it('handles POST requests with bearer token', async () => {
    const testToken = 'post-test-token';
    
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 'session_123' } }),
      headers: { get: () => 'application/json' }
    });

    const TestPostRequest = () => {
      const { client } = useCohost();
      
      const handlePostRequest = async () => {
        await client.cart.start({ 
          contextId: 'evt_123', 
          sessionContext: { uid: 'user_123' } 
        });
      };

      return (
        <button onClick={handlePostRequest}>Create Cart Session</button>
      );
    };

    render(
      <CohostProvider token={testToken}>
        <TestPostRequest />
      </CohostProvider>
    );

    const button = screen.getByText('Create Cart Session');
    
    await act(async () => {
      button.click();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.cohost.vip/v1/cart/sessions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ 
          contextId: 'evt_123', 
          sessionContext: { uid: 'user_123' } 
        })
      })
    );
  });

  it('works with custom client instance', async () => {
    // Create a mock client
    const mockClient = {
      events: {
        list: vi.fn().mockResolvedValue([])
      },
      orders: {},
      cart: {}
    };

    // Mock the createCohostClient function to return our mock
    const TestCustomClient = () => {
      const { client } = useCohost();
      
      const handleClick = async () => {
        await client.events.list();
      };

      return (
        <button onClick={handleClick}>Custom Client Test</button>
      );
    };

    render(
      <CohostProvider client={mockClient as any}>
        <TestCustomClient />
      </CohostProvider>
    );

    const button = screen.getByText('Custom Client Test');
    
    await act(async () => {
      button.click();
    });

    expect(mockClient.events.list).toHaveBeenCalled();
  });

  it('throws error when useCohost is called outside provider', () => {
    const TestOutsideProvider = () => {
      try {
        useCohost();
        return <div>No Error</div>;
      } catch (error) {
        return <div>Error: {(error as Error).message}</div>;
      }
    };

    render(<TestOutsideProvider />);
    
    expect(screen.getByText('Error: useCohostClient must be used within a CohostProvider')).toBeInTheDocument();
  });

  it('handles different token formats', async () => {
    const tokens = [
      'simple-token',
      'sk_test_123456789',
      'bearer-token-with-dashes',
      'very-long-token-that-has-many-characters-and-symbols_123'
    ];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
        headers: { get: () => 'application/json' }
      });

      const TestTokenFormat = () => {
        const { client } = useCohost();
        
        const handleClick = async () => {
          await client.events.list();
        };

        return (
          <button onClick={handleClick}>Test Token {i}</button>
        );
      };

      const { unmount } = render(
        <CohostProvider token={token}>
          <TestTokenFormat />
        </CohostProvider>
      );

      const button = screen.getByText(`Test Token ${i}`);
      
      await act(async () => {
        button.click();
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.cohost.vip/v1/events',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`
          })
        })
      );

      // Clean up for next iteration
      unmount();
      fetchMock.mockClear();
    }
  });
});

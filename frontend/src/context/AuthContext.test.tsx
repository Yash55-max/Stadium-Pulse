import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

function TestComponent() {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user-state">{user ? `${user.name} - ${user.role}` : 'Logged Out'}</div>
      <button onClick={() => login('John Doe', 'Staff')}>Login Staff</button>
      <button onClick={() => login('Jane Fan', 'Fan')}>Login Fan</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('provides default logged out state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-state').textContent).toBe('Logged Out');
  });

  it('updates state on login and logout', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login Staff').click();
    });
    expect(screen.getByTestId('user-state').textContent).toBe('John Doe - Staff');

    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('user-state').textContent).toBe('Logged Out');
  });
});

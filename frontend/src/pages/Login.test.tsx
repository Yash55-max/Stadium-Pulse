import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Login Component', () => {
  it('renders login form properly', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );
    
    expect(screen.getByText('StadiumPulse Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
  });

  it('navigates to /user for Fan role upon login', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Fan' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'Fan' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByText('Secure Login'));

    expect(mockNavigate).toHaveBeenCalledWith('/user');
  });

  it('navigates to /ops for Staff role upon login', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Staff' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'Staff' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByText('Secure Login'));

    expect(mockNavigate).toHaveBeenCalledWith('/ops');
  });
});

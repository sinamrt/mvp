import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import '@testing-library/jest-dom';

// Import components
import AdminOnly from '../components/AdminOnly';
import UserOnly from '../components/UserOnly';
import AuthStatus from '../components/AuthStatus';
import FormCompletedOnly from '../components/FormCompletedOnly';
import PlaceCard from '../components/PlaceCard';

// Mock NextAuth
const mockSession = {
  data: {
    user: {
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  status: 'authenticated'
};

const mockUserSession = {
  data: {
    user: {
      email: 'user@example.com',
      name: 'Regular User',
      role: 'USER'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  status: 'authenticated'
};

const mockSignIn = jest.fn();
const mockSignOut = jest.fn();

// Mock next-auth/react
const mockUseSession = jest.fn();
jest.mock('next-auth/react', () => ({
  useSession: mockUseSession,
  signIn: () => mockSignIn(),
  signOut: () => mockSignOut(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Component Functionality Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  // Test Case 1: AdminOnly Component Access Control
  describe('TC-COMP-001: AdminOnly Component Access Control', () => {
    it('should render admin content for authenticated admin user', async () => {
      mockUseSession.mockReturnValue(mockSession);

      render(
        <SessionProvider>
          <AdminOnly>
            <div data-testid="admin-content">Admin Dashboard Content</div>
          </AdminOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('admin-content')).toBeInTheDocument();
      });
    });

    it('should show access denied for non-admin user', async () => {
      mockUseSession.mockReturnValue(mockUserSession);

      render(
        <SessionProvider>
          <AdminOnly>
            <div data-testid="admin-content">Admin Dashboard Content</div>
          </AdminOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Access denied. Admins only.')).toBeInTheDocument();
        expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
      });
    });

    it('should show sign-in prompt for unauthenticated user', async () => {
      mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(
        <SessionProvider>
          <AdminOnly>
            <div data-testid="admin-content">Admin Dashboard Content</div>
          </AdminOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('You must be signed in as an admin to view this page.')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });
  });

  // Test Case 2: UserOnly Component Access Control
  describe('TC-COMP-002: UserOnly Component Access Control', () => {
    it('should render user content for authenticated user', async () => {
      mockUseSession.mockReturnValue(mockUserSession);

      render(
        <SessionProvider>
          <UserOnly>
            <div data-testid="user-content">User Dashboard Content</div>
          </UserOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-content')).toBeInTheDocument();
      });
    });

    it('should show sign-in prompt for unauthenticated user', async () => {
      mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(
        <SessionProvider>
          <UserOnly>
            <div data-testid="user-content">User Dashboard Content</div>
          </UserOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('You must be signed in to view this page.')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });
  });

  // Test Case 3: AuthStatus Component Display
  describe('TC-COMP-003: AuthStatus Component Display', () => {
    it('should display user info and sign-out button for authenticated user', async () => {
      const { useSession } = require('next-auth/react');
      useSession.mockReturnValue(mockUserSession);

      render(
        <SessionProvider>
          <AuthStatus />
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Signed in as user@example.com/)).toBeInTheDocument();
        expect(screen.getByText(/USER/)).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });

    it('should display sign-in button for unauthenticated user', async () => {
      const { useSession } = require('next-auth/react');
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(
        <SessionProvider>
          <AuthStatus />
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });

    it('should trigger sign-out when sign-out button is clicked', async () => {
      const { useSession } = require('next-auth/react');
      useSession.mockReturnValue(mockUserSession);

      render(
        <SessionProvider>
          <AuthStatus />
        </SessionProvider>
      );

      await waitFor(() => {
        const signOutButton = screen.getByText('Sign Out');
        fireEvent.click(signOutButton);
        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });

  // Test Case 4: FormCompletedOnly Component Conditional Rendering
  describe('TC-COMP-004: FormCompletedOnly Component Conditional Rendering', () => {
    it('should render content when form is completed and user is authenticated', async () => {
      const { useSession } = require('next-auth/react');
      useSession.mockReturnValue(mockUserSession);
      localStorageMock.getItem.mockReturnValue('true');

      render(
        <SessionProvider>
          <FormCompletedOnly>
            <div data-testid="form-completed-content">Form Completed Content</div>
          </FormCompletedOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('form-completed-content')).toBeInTheDocument();
      });
    });

    it('should show form completion message when form is not completed', async () => {
      const { useSession } = require('next-auth/react');
      useSession.mockReturnValue(mockUserSession);
      localStorageMock.getItem.mockReturnValue('false');

      render(
        <SessionProvider>
          <FormCompletedOnly>
            <div data-testid="form-completed-content">Form Completed Content</div>
          </FormCompletedOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('You must complete the onboarding form to access this content.')).toBeInTheDocument();
        expect(screen.queryByTestId('form-completed-content')).not.toBeInTheDocument();
      });
    });

    it('should show sign-in prompt for unauthenticated user regardless of form status', async () => {
      const { useSession } = require('next-auth/react');
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

      render(
        <SessionProvider>
          <FormCompletedOnly>
            <div data-testid="form-completed-content">Form Completed Content</div>
          </FormCompletedOnly>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('You must be signed in to view this page.')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });
  });

  // Test Case 5: PlaceCard Component Display
  describe('TC-COMP-005: PlaceCard Component Display', () => {
    const mockPlace = {
      name: 'Test Restaurant',
      rating: 4.5,
      types: ['restaurant', 'food', 'establishment'],
      geometry: {
        location: {
          lat: -33.8688,
          lng: 151.2093
        }
      }
    };

    it('should render place information correctly', () => {
      render(<PlaceCard place={mockPlace} />);

      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();
      expect(screen.getByText('restaurant, food, establish')).toBeInTheDocument();
    });

    it('should handle place without rating', () => {
      const placeWithoutRating = { ...mockPlace, rating: undefined };
      render(<PlaceCard place={placeWithoutRating} />);

      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
    });

    it('should handle place without types', () => {
      const placeWithoutTypes = { ...mockPlace, types: undefined };
      render(<PlaceCard place={placeWithoutTypes} />);

      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.queryByText(/restaurant/)).not.toBeInTheDocument();
    });

    it('should truncate long type lists', () => {
      const placeWithManyTypes = {
        ...mockPlace,
        types: ['restaurant', 'food', 'establishment', 'cafe', 'bar', 'nightlife']
      };
      render(<PlaceCard place={placeWithManyTypes} />);

      expect(screen.getByText('restaurant, food, establish')).toBeInTheDocument();
    });
  });
}); 
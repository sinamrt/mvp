import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components
import PlaceCard from '../components/PlaceCard';

describe('Simple Component Tests', () => {
  
  // Test Case 1: PlaceCard Component Basic Rendering
  describe('TC-COMP-001: PlaceCard Component Basic Rendering', () => {
    it('should render place name correctly', () => {
      render(<PlaceCard name="Test Restaurant" />);
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    });

    it('should render rating when provided', () => {
      render(<PlaceCard name="Test Restaurant" rating={4.5} />);
      expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();
    });

    it('should not render rating when not provided', () => {
      render(<PlaceCard name="Test Restaurant" />);
      expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
    });

    it('should render types when provided', () => {
      render(<PlaceCard name="Test Restaurant" types={['restaurant', 'food']} />);
      expect(screen.getByText('restaurant, food')).toBeInTheDocument();
    });

    it('should not render types when not provided', () => {
      render(<PlaceCard name="Test Restaurant" />);
      expect(screen.queryByText(/restaurant/)).not.toBeInTheDocument();
    });

    it('should render all props together', () => {
      render(
        <PlaceCard 
          name="Test Restaurant" 
          rating={4.5} 
          types={['restaurant', 'food', 'establishment']} 
        />
      );
      
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();
      expect(screen.getByText('restaurant, food, establishment')).toBeInTheDocument();
    });
  });

  // Test Case 2: Component Structure Validation
  describe('TC-COMP-002: Component Structure Validation', () => {
    it('should have proper container structure', () => {
      const { container } = render(<PlaceCard name="Test Restaurant" />);
      const cardElement = container.firstChild as HTMLElement;
      
      expect(cardElement).toHaveStyle({
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f8f8f8'
      });
    });

    it('should have h3 element for title', () => {
      render(<PlaceCard name="Test Restaurant" />);
      const titleElement = screen.getByRole('heading', { level: 3 });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Test Restaurant');
    });
  });

  // Test Case 3: Edge Cases and Error Handling
  describe('TC-COMP-003: Edge Cases and Error Handling', () => {
    it('should handle empty name gracefully', () => {
      render(<PlaceCard name="" />);
      const titleElement = screen.getByRole('heading', { level: 3 });
      expect(titleElement).toHaveTextContent('');
    });

    it('should handle zero rating', () => {
      render(<PlaceCard name="Test Restaurant" rating={0} />);
      expect(screen.getByText('⭐ 0')).toBeInTheDocument();
    });

    it('should handle empty types array', () => {
      render(<PlaceCard name="Test Restaurant" types={[]} />);
      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('should handle single type', () => {
      render(<PlaceCard name="Test Restaurant" types={['restaurant']} />);
      expect(screen.getByText('restaurant')).toBeInTheDocument();
    });
  });

  // Test Case 4: Accessibility Testing
  describe('TC-COMP-004: Accessibility Testing', () => {
    it('should have proper heading structure', () => {
      render(<PlaceCard name="Test Restaurant" />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<PlaceCard name="Test Restaurant" />);
      const cardDiv = container.querySelector('div');
      expect(cardDiv).toBeInTheDocument();
    });
  });

  // Test Case 5: Data Display Validation
  describe('TC-COMP-005: Data Display Validation', () => {
    it('should display rating with star emoji', () => {
      render(<PlaceCard name="Test Restaurant" rating={3.7} />);
      expect(screen.getByText('⭐ 3.7')).toBeInTheDocument();
    });

    it('should join multiple types with commas', () => {
      render(<PlaceCard name="Test Restaurant" types={['restaurant', 'food', 'establishment']} />);
      expect(screen.getByText('restaurant, food, establishment')).toBeInTheDocument();
    });

    it('should handle special characters in name', () => {
      render(<PlaceCard name="Café & Bistro" />);
      expect(screen.getByText('Café & Bistro')).toBeInTheDocument();
    });

    it('should handle decimal ratings', () => {
      render(<PlaceCard name="Test Restaurant" rating={4.25} />);
      expect(screen.getByText('⭐ 4.25')).toBeInTheDocument();
    });
  });
}); 
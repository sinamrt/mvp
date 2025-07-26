import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import DietForm from '../pages/diet-form';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Diet Form Component', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Test Case #1: Diet Type Selection', () => {
    it('should render diet type selection on first page', () => {
      render(<DietForm />);
      
      expect(screen.getByText('Diet Onboarding Form')).toBeInTheDocument();
      expect(screen.getByText('Select your diet type:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('-- Choose --')).toBeInTheDocument();
    });

    it('should show all diet type options', () => {
      render(<DietForm />);
      
      const select = screen.getByDisplayValue('-- Choose --');
      expect(select).toBeInTheDocument();
      
      // Check that all diet types are available
      const options = select.querySelectorAll('option');
      expect(options).toHaveLength(5); // Including the placeholder
    });

    it('should enable Next button when diet type is selected', () => {
      render(<DietForm />);
      
      const select = screen.getByDisplayValue('-- Choose --');
      const nextButton = screen.getByText('Next');
      
      expect(nextButton).toBeDisabled();
      
      fireEvent.change(select, { target: { value: 'vegan' } });
      
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Test Case #2: Form Navigation', () => {
    it('should navigate to next page when Next is clicked', () => {
      render(<DietForm />);
      
      const select = screen.getByDisplayValue('-- Choose --');
      fireEvent.change(select, { target: { value: 'vegan' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      expect(screen.getByText('What is your primary motivation for choosing a vegan diet?')).toBeInTheDocument();
      expect(screen.getByText('Page 2 of 20')).toBeInTheDocument();
    });

    it('should navigate back when Back is clicked', () => {
      render(<DietForm />);
      
      // Select diet type and go to next page
      const select = screen.getByDisplayValue('-- Choose --');
      fireEvent.change(select, { target: { value: 'vegan' } });
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      // Go back
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);
      
      expect(screen.getByText('Select your diet type:')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 20')).toBeInTheDocument();
    });
  });

  describe('Test Case #3: Form Data Persistence', () => {
    it('should save form data to localStorage', () => {
      render(<DietForm />);
      
      const select = screen.getByDisplayValue('-- Choose --');
      fireEvent.change(select, { target: { value: 'vegetarian' } });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'dietFormData',
        JSON.stringify({
          dietType: 'vegetarian',
          answers: Array(19).fill(''),
        })
      );
    });

    it('should load form data from localStorage on mount', () => {
      const savedData = {
        dietType: 'omnivore',
        answers: ['Health reasons', '2 years', ''],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));
      
      render(<DietForm />);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('dietFormData');
    });
  });

  describe('Test Case #4: Form Submission', () => {
    it('should submit form and redirect to home page', () => {
      render(<DietForm />);
      
      // Select diet type
      const select = screen.getByDisplayValue('-- Choose --');
      fireEvent.change(select, { target: { value: 'vegan' } });
      
      // Navigate through all pages to reach the submit page
      for (let i = 0; i < 19; i++) {
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        
        // Fill in the answer for each page
        const input = screen.getByDisplayValue('');
        fireEvent.change(input, { target: { value: `Answer ${i + 1}` } });
      }
      
      // Now we should be on the last page with a Submit button
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('formCompleted', 'true');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('dietFormData');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
}); 
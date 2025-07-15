import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';


describe('Button Component', () => {
    it('should render the button with its children', () => {
        render(<Button>Click Me</Button>);

        const buttonElement = screen.getByRole('button', { name: /click me/i });

        expect(buttonElement).toBeInTheDocument();
    });

    it('should call the onClick handler when clicked', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Clickable</Button>);
        const buttonElement = screen.getByRole('button', { name: /clickable/i });

        await user.click(buttonElement);

        expect(handleClick).toHaveBeenCalledTimes(1)
    });

    it('should be disabled when the disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);
        const buttonElement = screen.getByRole('button', { name: /disabled button/i });
        expect(buttonElement).toBeDisabled();
    });

    it('should show a spinner and be disabled when isLoading is true', () => {
        render(<Button isLoading>Loading...</Button>);
        const buttonElement = screen.getByRole('button');

        expect(buttonElement).toBeDisabled();

        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        expect(screen.queryByRole('status')).toBeInTheDocument();
    });
});
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StyledButton = styled.button`
  width: 100%;
  max-width: 280px;
  cursor: pointer;
  background-color: #004d61;
  border: 2px solid #004d61;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  padding: 16px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:disabled {
    opacity: 0.85;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    max-width: 320px;
    padding: 16px 40px;
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: ReactNode;
};

export const Button = ({
  loading = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton aria-busy={loading} {...props}>
      {loading ? (
        <Spinner data-testid="button-loading-spinner" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
    </StyledButton>
  );
};

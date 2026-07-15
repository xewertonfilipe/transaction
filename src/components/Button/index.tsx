import styled from "styled-components";

export const Button = styled.button`
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

  @media (min-width: 768px) {
    max-width: 320px;
    padding: 16px 40px;
  }
`;

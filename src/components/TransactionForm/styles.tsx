import styled from "styled-components";

import patternImg from "../../assets/imgs/pattern.png";

export const Card = styled.div`
  background-color: #cbcbcb;
  border-radius: 8px;
  min-height: clamp(300px, 48vw, 400px);
  width: 100%;
  background-image: url(${patternImg});
  background-repeat: no-repeat;
  background-position: top right;
  background-size: clamp(120px, 28vw, 220px);
  padding: clamp(16px, 4vw, 32px);
  box-sizing: border-box;

  @media (max-width: 480px) {
    background-size: 100px;
    background-position: top 8px right 8px;
  }
`;

export const Heading = styled.h2`
  color: #dee9ea;
  font-weight: 700;
  font-size: clamp(22px, 5vw, 25px);
  line-height: 1.2;
  margin: 0;
  margin-bottom: clamp(20px, 5vw, 32px);
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 5vw, 32px);
  align-items: flex-start;
`;

export const Select = styled.select`
  width: min(100%, 355px);
  padding: clamp(12px, 3.5vw, 16px);
  font-size: clamp(14px, 3.5vw, 16px);
  border-radius: 8px;
  border: 1px solid #004d61;
  color: #444444;
  box-sizing: border-box;
`;

export const Label = styled.label`
  display: block;
  color: #dee9ea;
  font-size: clamp(14px, 3.5vw, 16px);
  margin-bottom: clamp(10px, 3vw, 16px);
`;

export const Input = styled.input`
  width: min(100%, 250px);
  padding: clamp(12px, 3.5vw, 16px);
  font-size: clamp(14px, 3.5vw, 16px);
  border-radius: 8px;
  color: #444444;
  border: 1px solid #004d61;
  box-sizing: border-box;
`;

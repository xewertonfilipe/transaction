import { useState } from "react";

import {
  createTransaction,
  selectCreateTransactionStatus,
  selectTransactionsError,
} from "../../features/transactions/transactionSlice";
import type { TransactionTypeOption } from "../../features/transactionTypes/transactionTypeSlice";
import {
  selectTransactionTypes,
  selectTransactionTypesError,
  selectTransactionTypesStatus,
} from "../../features/transactionTypes/transactionTypeSlice";
import type { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button } from "../Button";
import { Card, Form, Heading, Input, Label, Select } from "./styles";

const TRANSACTION_CREATED_EVENT = "bank:transaction:created";

export const TransactionForm = () => {
  const [transactionType, setTransactionType] = useState("");
  const [transactionValue, setTransactionValue] = useState("");

  const dispatch = useAppDispatch();

  const createTransacion = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const parsedValue = parseFloat(transactionValue);

    if (!Number.isFinite(parsedValue) || !transactionType) {
      return;
    }

    void dispatch(
      createTransaction({
        value: parsedValue,
        type: transactionType,
      })
    )
      .unwrap()
      .then(() => {
        setTransactionType("");
        setTransactionValue("");
        document.dispatchEvent(new CustomEvent(TRANSACTION_CREATED_EVENT));
      })
      .catch(() => undefined);
  };

  const transactionTypes = useAppSelector(
    (state: RootState) =>
      selectTransactionTypes(state) as TransactionTypeOption[]
  );
  const transactionTypesStatus = useAppSelector((state: RootState) =>
    selectTransactionTypesStatus(state)
  );
  const transactionTypesError = useAppSelector((state: RootState) =>
    selectTransactionTypesError(state)
  );
  const createTransactionStatus = useAppSelector((state: RootState) =>
    selectCreateTransactionStatus(state)
  );
  const transactionError = useAppSelector((state: RootState) =>
    selectTransactionsError(state)
  );

  return (
    <Card>
      <Heading>Nova transação</Heading>
      <Form onSubmit={createTransacion}>
        <Select
          value={transactionType}
          onChange={(evt: React.ChangeEvent<HTMLSelectElement>) =>
            setTransactionType(evt.target.value)
          }
          disabled={
            transactionTypesStatus === "loading" ||
            createTransactionStatus === "loading"
          }
          required
        >
          <option value="" disabled hidden>
            {transactionTypesStatus === "loading"
              ? "Carregando tipos de transação..."
              : "Selecione o tipo de transação"}
          </option>
          {transactionTypes.map((t: TransactionTypeOption) => (
            <option value={t.value} key={t.value}>
              {t.display}
            </option>
          ))}
        </Select>
        <div>
          <Label>Valor</Label>
          <Input
            placeholder="00,00"
            type="number"
            value={transactionValue}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              setTransactionValue(evt.target.value)
            }
            disabled={createTransactionStatus === "loading"}
            required
          />
        </div>
        <Button disabled={createTransactionStatus === "loading"}>
          {createTransactionStatus === "loading"
            ? "Concluindo transacao..."
            : "Concluir transacao"}
        </Button>
        {transactionTypesError ? <p>{transactionTypesError}</p> : null}
        {transactionError ? <p>{transactionError}</p> : null}
      </Form>
    </Card>
  );
};

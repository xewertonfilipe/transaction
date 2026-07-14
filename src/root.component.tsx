import { useEffect } from "react";
import { Provider } from "react-redux";

import { TransactionForm } from "./components/TransactionForm";
import { fetchTransactionTypes } from "./features/transactionTypes/transactionTypeSlice";
import store from "./store";
import { useAppDispatch } from "./store/hooks";

function TransactionApp() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactionTypes());
  }, [dispatch]);

  return <TransactionForm />;
}

export default function Root() {
  return (
    <>
      <Provider store={store}>
        <TransactionApp />
      </Provider>
    </>
  );
}

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";

import { TransactionForm } from "./components/TransactionForm";
import { fetchTransactionTypes } from "./features/transactionTypes/transactionTypeSlice";
import store from "./store";

function TransactionApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransactionTypes());
  }, [dispatch]);

  return <TransactionForm />;
}

export default function Root(props) {
  return (
    <>
      <Provider store={store}>
        <TransactionApp />
      </Provider>
    </>
  );
}

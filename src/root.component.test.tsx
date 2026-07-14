import { render } from "@testing-library/react";

import Root from "./root.component";

describe("Root component", () => {
  it("should be in the document", () => {
    const { getByRole } = render(<Root />);

    expect(
      getByRole("heading", { name: /Nova transação/i })
    ).toBeInTheDocument();
  });
});

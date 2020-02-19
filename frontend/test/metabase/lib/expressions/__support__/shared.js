import { ORDERS, PEOPLE } from "__support__/sample_dataset_fixture";

const total = ORDERS.TOTAL.dimension().mbql();
const subtotal = ORDERS.SUBTOTAL.dimension().mbql();
const tax = ORDERS.TAX.dimension().mbql();
const userId = ORDERS.USER_ID.dimension().mbql();
const userName = ORDERS.USER_ID.foreign(PEOPLE.NAME).mbql();

const metric = ORDERS.metrics[0];

const query = ORDERS.query().addExpression("foo", 42);

const expression = [
  ["1", 1, "number literal"],
  ["1 + -1", ["+", 1, -1], "negative number literal"],
  ["1 * 2 + 3", ["+", ["*", 1, 2], 3], "operators ordered by precedence"],
  ["1 + 2 * 3", ["+", 1, ["*", 2, 3]], "operators not ordered by precedence"],
  [
    "1 + 2 + 3 * 4 * 5 + 6",
    ["+", 1, 2, ["*", 3, 4, 5], 6],
    "runs of multiple of the same operator",
  ],
  [
    "1 * (2 + 3)",
    ["*", 1, ["+", 2, 3]],
    "parenthesis overriding operator precedence",
  ],
  [
    "(1 + 2) * 3",
    ["*", ["+", 1, 2], 3],
    "parenthesis overriding operator precedence",
  ],
  ["'hello world'", "hello world", "string literal"],
  ["Subtotal", subtotal, "field name"],
  ["Tax + Total", ["+", tax, total], "adding two fields"],
  ["1 + Subtotal", ["+", 1, subtotal], "adding literal and field"],
  ['"User ID"', userId, "field name with spaces"],
  ["foo", ["expression", "foo"], "named expression"],
  ['"User → Name"', userName, "foriegn key"],
  ['Trim("User → Name")', ["trim", userName], "function with one argument"],
  [
    "Trim(\"User → Name\", ',')",
    ["trim", userName, ","],
    "function with two arguments",
  ],
  [
    "Concat('http://mysite.com/user/', \"User ID\", '/')",
    ["concat", "http://mysite.com/user/", userId, "/"],
    "function with 3 arguments",
  ],
  [
    "Case(Total > 10, 'GOOD', Total < 5, 'BAD', 'OK')",
    [
      "case",
      [[[">", total, 10], "GOOD"], [["<", total, 5], "BAD"]],
      { default: "OK" },
    ],
    "case statement with default",
  ],
];

const aggregation = [
  ["Count", ["count"], "aggregation with no arguments"],
  ["Sum(Total)", ["sum", total], "aggregation with one argument"],
  ["1 - Count", ["-", 1, ["count"]], "aggregation with math outside"],
  ["Sum(Total * 2)", ["sum", ["*", total, 2]], "aggregation with math inside"],
  [
    "1 - Sum(Total * 2) / Count",
    ["-", 1, ["/", ["sum", ["*", total, 2]], ["count"]]],
    "aggregation with math inside and outside",
  ],
  // ['"Total Order Value"', metric, "metric"],
  // ['"Total Order Value" * 2', ["*", metric, 2], "metric with math"],
  ["Share(Total > 50)", ["share", [">", total, 50]], "share aggregation"],
  [
    "CountWhere(Total > 50)",
    ["count-where", [">", total, 50]],
    "count-where aggregation",
  ],
  [
    "SumWhere(Total, Total > 50)",
    ["sum-where", total, [">", total, 50]],
    "sum-where aggregation",
  ],
];

const filter = [
  ["Total < 10", ["<", total, 10], "filter operator"],
  [
    "Total < 10 and Tax >= 1",
    ["and", ["<", total, 10], [">=", tax, 1]],
    "filter with AND",
  ],
];

export default [
  ["expression", expression, { startRule: "expression", query }],
  ["aggregation", aggregation, { startRule: "aggregation", query }],
  ["filter", filter, { startRule: "filter", query }],
];
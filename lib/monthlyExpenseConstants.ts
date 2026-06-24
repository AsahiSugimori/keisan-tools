/**
 * 月の出費計算機の初期値・上限値・項目定義
 */

/**
 * 月の出費計算機のグループID
 */
export type MonthlyExpenseGroupId =
  | "income"
  | "fixed"
  | "variable"
  | "cardLoan";

/**
 * 月の出費計算機の項目定義
 */
export type MonthlyExpenseItemDefinition = {
  id: string;
  label: string;
  defaultValue: number;
};

/**
 * 月の出費計算機のグループ定義
 */
export type MonthlyExpenseGroupDefinition = {
  id: MonthlyExpenseGroupId;
  title: string;
  description: string;
  items: MonthlyExpenseItemDefinition[];
};

/**
 * 入力できる金額の最大値
 */
export const maxMonthlyExpenseAmount = 1000000000;

/**
 * 入力できる金額の最小値
 */
export const minMonthlyExpenseAmount = 0;

/**
 * 1年の月数
 */
export const monthsPerYearForMonthlyExpense = 12;

/**
 * localStorageキー(金額)
 */
export const monthlyExpenseAmountsStorageKey = "monthlyExpenseAmounts";

/**
 * localStorageキー(メモ)
 */
export const monthlyExpenseNotesStorageKey = "monthlyExpenseNotes";

/**
 * 月の出費計算機の初期グループ
 *
 * 将来的にDB化するときは、このグループ/項目構造をユーザーごとに保存する想定。
 * グループの中に項目を持たせているため、内訳追加・折り畳み表示・前月コピーへ拡張しやすい。
 */
export const monthlyExpenseGroups: MonthlyExpenseGroupDefinition[] = [
  {
    id: "income",
    title: "収入・調整",
    description: "月の手取り、先月繰り越し、臨時収入などを入力します。",
    items: [
      { id: "monthlyTakeHomePay", label: "月の手取り", defaultValue: 250000 },
      { id: "carryOver", label: "先月繰り越し", defaultValue: 0 },
      { id: "temporaryIncome", label: "臨時収入", defaultValue: 0 },
    ],
  },
  {
    id: "fixed",
    title: "固定費",
    description: "毎月ほぼ決まって発生する支出を入力します。",
    items: [
      { id: "rent", label: "家賃", defaultValue: 0 },
      { id: "loan", label: "ローン", defaultValue: 0 },
      { id: "communication", label: "通信費", defaultValue: 0 },
      { id: "insurance", label: "保険", defaultValue: 0 },
      { id: "utility", label: "水道光熱費", defaultValue: 0 },
      { id: "subscription", label: "サブスク", defaultValue: 0 },
      { id: "otherFixed", label: "その他固定費", defaultValue: 0 },
    ],
  },
  {
    id: "variable",
    title: "変動費",
    description: "食費、買い物、趣味など月によって変わりやすい支出を入力します。",
    items: [
      { id: "food", label: "食費", defaultValue: 0 },
      { id: "eatingOut", label: "外食", defaultValue: 0 },
      { id: "gasolineTransportation", label: "ガソリン/交通費", defaultValue: 0 },
      { id: "beautyMedical", label: "美容/医療", defaultValue: 0 },
      { id: "hobbyGame", label: "趣味/ゲーム", defaultValue: 0 },
      { id: "shopping", label: "買い物", defaultValue: 0 },
      { id: "otherVariable", label: "その他変動費", defaultValue: 0 },
    ],
  },
  {
    id: "cardLoan",
    title: "カード/分割",
    description: "クレカ支払い、分割払い、ローン支払いをまとめて入力します。",
    items: [
      { id: "creditCardPayment", label: "クレカ支払い", defaultValue: 0 },
      { id: "installmentPayment", label: "分割/ローン支払い", defaultValue: 0 },
    ],
  },
];

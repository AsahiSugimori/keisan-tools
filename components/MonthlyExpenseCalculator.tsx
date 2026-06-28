"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type MonthlyExpenseGroupDefinition,
  type MonthlyExpenseGroupId,
  maxMonthlyExpenseAmount,
  minMonthlyExpenseAmount,
  monthlyExpenseAmountsStorageKey,
  monthlyExpenseGroups,
  monthlyExpenseNotesStorageKey,
  monthsPerYearForMonthlyExpense,
} from "../lib/monthlyExpenseConstants";
import NumberInput from "./NumberInput";

/**
 * 金額入力値
 */
type MonthlyExpenseAmountMap = Record<string, number>;

/**
 * 金額入力文字列
 */
type MonthlyExpenseTextMap = Record<string, string>;

/**
 * グループメモ
 */
type MonthlyExpenseNoteMap = Record<MonthlyExpenseGroupId, string>;

/**
 * 月の出費計算結果
 */
type MonthlyExpenseResult = {
  incomeTotal: number;
  fixedExpenseTotal: number;
  variableExpenseTotal: number;
  cardLoanExpenseTotal: number;
  expenseTotal: number;
  remainingMoney: number;
  yearlyExpense: number;
  expenseRate: number;
};

/**
 * 収支ステータス
 */
type MonthlyExpenseStatus = {
  label: string;
  message: string;
  className: string;
};

/**
 * 初期金額マップを作成する
 *
 * @returns 初期金額マップ
 */
function createDefaultAmountMap(): MonthlyExpenseAmountMap {
  return monthlyExpenseGroups.reduce<MonthlyExpenseAmountMap>((amountMap, group) => {
    group.items.forEach((item) => {
      amountMap[item.id] = item.defaultValue;
    });

    return amountMap;
  }, {});
}

/**
 * 金額マップを入力文字列マップに変換する
 *
 * @param amountMap 金額マップ
 * @returns 入力文字列マップ
 */
function createTextMap(amountMap: MonthlyExpenseAmountMap): MonthlyExpenseTextMap {
  return Object.fromEntries(
    Object.entries(amountMap).map(([key, value]) => [key, String(value)])
  );
}

/**
 * 初期メモマップを作成する
 *
 * @returns 初期メモマップ
 */
function createDefaultNoteMap(): MonthlyExpenseNoteMap {
  return {
    income: "",
    fixed: "",
    variable: "",
    cardLoan: "",
  };
}

/**
 * 金額を0円以上の整数に丸める
 *
 * @param value 金額
 * @returns 0円以上の整数
 */
function floorMoney(value: number): number {
  return Math.max(minMonthlyExpenseAmount, Math.floor(value));
}

/**
 * 金額を円表記にする
 *
 * @param value 金額
 * @returns 円表記
 */
function formatYen(value: number): string {
  return `${value.toLocaleString()}円`;
}

/**
 * グループの合計額を計算する
 *
 * @param group グループ定義
 * @param amounts 金額マップ
 * @returns グループ合計額
 */
function calculateGroupTotal(
  group: MonthlyExpenseGroupDefinition,
  amounts: MonthlyExpenseAmountMap
): number {
  return group.items.reduce((total, item) => total + (amounts[item.id] ?? 0), 0);
}

/**
 * 月の出費を計算する
 *
 * @param amounts 金額マップ
 * @returns 計算結果
 */
function calculateMonthlyExpense(amounts: MonthlyExpenseAmountMap): MonthlyExpenseResult {
  const incomeGroup = monthlyExpenseGroups.find((group) => group.id === "income");
  const fixedGroup = monthlyExpenseGroups.find((group) => group.id === "fixed");
  const variableGroup = monthlyExpenseGroups.find((group) => group.id === "variable");
  const cardLoanGroup = monthlyExpenseGroups.find((group) => group.id === "cardLoan");

  const incomeTotal = incomeGroup ? calculateGroupTotal(incomeGroup, amounts) : 0;
  const fixedExpenseTotal = fixedGroup ? calculateGroupTotal(fixedGroup, amounts) : 0;
  const variableExpenseTotal = variableGroup ? calculateGroupTotal(variableGroup, amounts) : 0;
  const cardLoanExpenseTotal = cardLoanGroup ? calculateGroupTotal(cardLoanGroup, amounts) : 0;
  const expenseTotal = fixedExpenseTotal + variableExpenseTotal + cardLoanExpenseTotal;
  const remainingMoney = incomeTotal - expenseTotal;
  const yearlyExpense = expenseTotal * monthsPerYearForMonthlyExpense;
  const expenseRate = incomeTotal > 0 ? Math.round((expenseTotal / incomeTotal) * 1000) / 10 : 0;

  return {
    incomeTotal: floorMoney(incomeTotal),
    fixedExpenseTotal: floorMoney(fixedExpenseTotal),
    variableExpenseTotal: floorMoney(variableExpenseTotal),
    cardLoanExpenseTotal: floorMoney(cardLoanExpenseTotal),
    expenseTotal: floorMoney(expenseTotal),
    remainingMoney: Math.floor(remainingMoney),
    yearlyExpense: floorMoney(yearlyExpense),
    expenseRate,
  };
}

/**
 * 収支ステータスを取得する
 *
 * @param remainingMoney 残るお金
 * @returns 収支ステータス
 */
function getMonthlyExpenseStatus(remainingMoney: number): MonthlyExpenseStatus {
  if (remainingMoney < 0) {
    return {
      label: "赤字見込み",
      message: "今月は支出が収入を上回っています。カード/分割や変動費を見直すと調整しやすいです。",
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (remainingMoney === 0) {
    return {
      label: "収支ちょうど",
      message: "収入と支出がほぼ同じ状態です。急な出費があると赤字になりやすいので注意です。",
      className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    };
  }

  return {
    label: "黒字見込み",
    message: "今月はお金が残る見込みです。貯金やカード支払いの調整にも回しやすい状態です。",
    className: "border-green-200 bg-green-50 text-green-700",
  };
}

/**
 * 支出割合バーの幅を取得する
 *
 * @param expenseRate 支出割合
 * @returns 幅
 */
function getExpenseRateBarWidth(expenseRate: number): string {
  return `${Math.min(100, Math.max(0, expenseRate))}%`;
}

/**
 * 月の出費計算機
 */
export default function MonthlyExpenseCalculator() {
  /** 初期金額 */
  const defaultAmountMap = useMemo(() => createDefaultAmountMap(), []);

  /** 入力文字列 */
  const [amountTexts, setAmountTexts] = useState<MonthlyExpenseTextMap>(
    createTextMap(defaultAmountMap)
  );

  /** 計算用確定値 */
  const [amounts, setAmounts] = useState<MonthlyExpenseAmountMap>(defaultAmountMap);

  /** グループごとのメモ */
  const [notes, setNotes] = useState<MonthlyExpenseNoteMap>(createDefaultNoteMap());

  /**
   * 保存済み入力値を読み込む
   */
  useEffect(() => {
    const savedAmounts = localStorage.getItem(monthlyExpenseAmountsStorageKey);
    const savedNotes = localStorage.getItem(monthlyExpenseNotesStorageKey);

    if (savedAmounts !== null) {
      try {
        const parsedAmounts = JSON.parse(savedAmounts) as MonthlyExpenseAmountMap;
        const mergedAmounts = { ...defaultAmountMap, ...parsedAmounts };
        setAmounts(mergedAmounts);
        setAmountTexts(createTextMap(mergedAmounts));
      } catch {
        setAmounts(defaultAmountMap);
        setAmountTexts(createTextMap(defaultAmountMap));
      }
    }

    if (savedNotes !== null) {
      try {
        const parsedNotes = JSON.parse(savedNotes) as Partial<MonthlyExpenseNoteMap>;
        setNotes({ ...createDefaultNoteMap(), ...parsedNotes });
      } catch {
        setNotes(createDefaultNoteMap());
      }
    }
  }, [defaultAmountMap]);

  /**
   * 入力文字列を更新する
   *
   * @param itemId 項目ID
   * @param value 入力値
   */
  const changeAmountText = (itemId: string, value: string) => {
    setAmountTexts((current) => ({ ...current, [itemId]: value }));
  };

  /**
   * 入力文字列を検証し、計算用金額に反映する
   *
   * @param itemId 項目ID
   */
  const commitAmount = (itemId: string) => {
    const value = Math.min(
      maxMonthlyExpenseAmount,
      Math.max(minMonthlyExpenseAmount, Number(amountTexts[itemId]) || 0)
    );

    const nextAmounts = { ...amounts, [itemId]: value };
    setAmounts(nextAmounts);
    setAmountTexts((current) => ({ ...current, [itemId]: String(value) }));
    localStorage.setItem(monthlyExpenseAmountsStorageKey, JSON.stringify(nextAmounts));
  };

  /**
   * グループメモを更新する
   *
   * @param groupId グループID
   * @param value メモ
   */
  const changeNote = (groupId: MonthlyExpenseGroupId, value: string) => {
    const nextNotes = { ...notes, [groupId]: value };
    setNotes(nextNotes);
    localStorage.setItem(monthlyExpenseNotesStorageKey, JSON.stringify(nextNotes));
  };

  /**
   * 入力値を初期状態に戻す
   */
  const resetInputs = () => {
    setAmounts(defaultAmountMap);
    setAmountTexts(createTextMap(defaultAmountMap));
    setNotes(createDefaultNoteMap());
    localStorage.removeItem(monthlyExpenseAmountsStorageKey);
    localStorage.removeItem(monthlyExpenseNotesStorageKey);
  };

  /** 計算結果 */
  const result = calculateMonthlyExpense(amounts);

  /** 収支ステータス */
  const status = getMonthlyExpenseStatus(result.remainingMoney);

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-3 text-center text-3xl font-bold">月の出費計算機</h1>

      <p className="mx-auto mb-6 max-w-3xl text-center text-sm leading-7 text-gray-600">
        月の収入、固定費、変動費、カード/分割払いを入力すると、今月の支出合計と残るお金を概算できます。
        家計簿を細かく始める前に、まずはざっくり収支を確認したい人向けの計算機です。
      </p>

      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-gray-700">
        <p className="font-bold text-gray-900">
          手取り額が分からない場合は、先に月の手取りを概算できます。
        </p>
        <p className="mt-1">
          額面給与から社会保険料や税金を引いた、おおよその手取りを確認してから入力すると使いやすいです。
        </p>
        <Link
          href="/take-home-pay"
          className="mt-3 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          額面→手取り計算機で確認する
        </Link>
      </div>

      {/* 上部サマリー */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">今月の収支まとめ</h2>
            <p className="mt-1 text-sm text-gray-600">
              入力内容はこのブラウザ内に自動保存されます。
            </p>
          </div>

          <div className={`rounded-full border px-4 py-2 text-sm font-bold ${status.className}`}>
            {status.label}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-600">月の収入</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">
              {formatYen(result.incomeTotal)}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-600">月の支出</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">
              {formatYen(result.expenseTotal)}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-600">残るお金</div>
            <div
              className={`mt-2 text-2xl font-bold ${
                result.remainingMoney < 0 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {formatYen(result.remainingMoney)}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-gray-700">
              収入に対する支出割合
            </span>
            <span className="text-sm font-bold text-gray-900">
              {result.expenseRate.toLocaleString()}%
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full ${
                result.expenseRate >= 100 ? "bg-red-500" : "bg-blue-600"
              }`}
              style={{ width: getExpenseRateBarWidth(result.expenseRate) }}
            />
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-600">{status.message}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* 入力エリア */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">入力項目</h2>
            <button
              className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-300"
              onClick={resetInputs}
              type="button"
            >
              リセット
            </button>
          </div>

          <div className="space-y-4">
            {monthlyExpenseGroups.map((group) => {
              const groupTotal = calculateGroupTotal(group, amounts);

              return (
                <details
                  key={group.id}
                  className="group rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-sm text-gray-500 group-open:hidden">
                          ▼
                        </span>
                        <span className="mt-0.5 hidden text-sm text-gray-500 group-open:inline">
                          ▲
                        </span>

                        <div>
                          <div className="font-bold text-gray-900">{group.title}</div>
                          <p className="mt-1 text-xs leading-6 text-gray-500">
                            {group.description}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-700 shadow-sm">
                        {formatYen(groupTotal)}
                      </div>
                    </div>
                  </summary>

                  <div className="mt-4 space-y-4">
                    {group.items.map((item) => (
                      <NumberInput
                        key={item.id}
                        label={item.label}
                        value={amountTexts[item.id] ?? "0"}
                        maxValue={maxMonthlyExpenseAmount}
                        onChange={(value) => {
                          changeAmountText(item.id, value);
                        }}
                        onCommit={() => {
                          commitAmount(item.id);
                        }}
                        onEnter={() => {
                          commitAmount(item.id);
                        }}
                      />
                    ))}

                    <div>
                      <label className="mb-1 block font-bold text-gray-700">
                        内訳メモ
                      </label>
                      <textarea
                        className="min-h-20 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="例：楽天カード、JCBカード、分割残り回数、今月だけの出費など"
                        value={notes[group.id]}
                        onChange={(event) => {
                          changeNote(group.id, event.target.value);
                        }}
                      />
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* 結果エリア */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">計算結果</h2>

          <div className="space-y-3">
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">収入合計</span>
              <span className="font-bold">{formatYen(result.incomeTotal)}</span>
            </div>

            <hr />

            <div className="flex justify-between gap-3">
              <span className="text-gray-600">固定費合計</span>
              <span className="font-bold">{formatYen(result.fixedExpenseTotal)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-600">変動費合計</span>
              <span className="font-bold">{formatYen(result.variableExpenseTotal)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-600">カード/分割合計</span>
              <span className="font-bold">{formatYen(result.cardLoanExpenseTotal)}</span>
            </div>

            <hr />

            <div className="flex justify-between gap-3 text-lg font-bold">
              <span>支出合計</span>
              <span>{formatYen(result.expenseTotal)}</span>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">残るお金</div>
              <div
                className={`mt-2 text-3xl font-bold ${
                  result.remainingMoney < 0 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {formatYen(result.remainingMoney)}
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-600">年間支出</span>
              <span className="font-bold">{formatYen(result.yearlyExpense)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-600">支出割合</span>
              <span className="font-bold">{result.expenseRate.toLocaleString()}%</span>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-bold">見直しの目安</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
              <li>・赤字なら、まず変動費とカード/分割を確認</li>
              <li>・支出割合が100%超なら、収入より支出が多い状態</li>
              <li>・固定費が高い場合は、サブスクや保険の見直しが効果的</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* 注意書き・補足説明 */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">この計算機について</h2>

        <div className="space-y-3 text-sm leading-7 text-gray-700">
          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              計算できる内容
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                月の収入、固定費、変動費、カード/分割払いを入力すると、月の支出合計と残るお金を概算できます。
              </p>
              <p>
                家計簿というより、まずは「今月どれくらい使うか」をサクッと確認するための計算機です。
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              保存される内容
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                入力した金額とメモは、このブラウザのlocalStorageに保存されます。
              </p>
              <p>
                サーバーや外部サービスには保存していないため、別の端末や別ブラウザでは共有されません。
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              将来的な拡張イメージ
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                今後ログインやDB保存に対応する場合は、項目の追加・削除、内訳の追加、クレカ別管理、ローン残り回数、前月コピーなどへ広げる想定です。
              </p>
              <p>
                今回の初版でも、内部的には「大項目の中に複数項目を持つ形」にしているため、あとから内訳を折り畳み表示にしやすい構成にしています。
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              注意事項
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                計算結果は目安です。実際の口座残高、カード請求額、分割払いの残回数とはズレる場合があります。
              </p>
              <p>
                正確に管理したい場合は、カード明細や銀行残高と照らし合わせて確認してください。
              </p>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}
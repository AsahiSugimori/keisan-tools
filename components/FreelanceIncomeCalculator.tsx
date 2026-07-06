"use client";

import { useEffect, useRef, useState } from "react";
import {
  consumptionTaxRate,
  defaultIncludeConsumptionTax,
  defaultMonthlyExpenses,
  defaultMonthlySales,
  defaultTargetMonthlyProfit,
  includeConsumptionTaxStorageKey,
  maxMonthlyExpenses,
  maxMonthlySales,
  maxTargetMonthlyProfit,
  minMoneyValue,
  monthlyExpensesStorageKey,
  monthlySalesStorageKey,
  monthsPerYear,
  targetMonthlyProfitStorageKey,
} from "../lib/freelanceIncomeConstants";
import NumberInput from "./NumberInput";

type FreelanceIncomeResult = {
  monthlySales: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  yearlySales: number;
  yearlyExpenses: number;
  yearlyProfit: number;
  monthlyConsumptionTax: number;
  monthlyInvoiceAmountWithTax: number;
  yearlyInvoiceAmountWithTax: number;
  requiredMonthlySales: number;
  requiredMonthlyInvoiceAmountWithTax: number;
};

function floorMoney(value: number): number {
  return Math.max(minMoneyValue, Math.floor(value));
}

function floorSignedMoney(value: number): number {
  return Math.floor(value);
}

function calculateFreelanceIncome(
  monthlySales: number,
  monthlyExpenses: number,
  targetMonthlyProfit: number,
  includeConsumptionTax: boolean,
): FreelanceIncomeResult {
  const monthlyProfit = monthlySales - monthlyExpenses;
  const yearlySales = monthlySales * monthsPerYear;
  const yearlyExpenses = monthlyExpenses * monthsPerYear;
  const yearlyProfit = monthlyProfit * monthsPerYear;
  const monthlyConsumptionTax = includeConsumptionTax
    ? floorMoney(monthlySales * consumptionTaxRate)
    : minMoneyValue;
  const monthlyInvoiceAmountWithTax = monthlySales + monthlyConsumptionTax;
  const yearlyInvoiceAmountWithTax = monthlyInvoiceAmountWithTax * monthsPerYear;
  const requiredMonthlySales = targetMonthlyProfit + monthlyExpenses;
  const requiredMonthlyInvoiceAmountWithTax = includeConsumptionTax
    ? requiredMonthlySales + floorMoney(requiredMonthlySales * consumptionTaxRate)
    : requiredMonthlySales;

  return {
    monthlySales: floorMoney(monthlySales),
    monthlyExpenses: floorMoney(monthlyExpenses),
    monthlyProfit: floorSignedMoney(monthlyProfit),
    yearlySales: floorMoney(yearlySales),
    yearlyExpenses: floorMoney(yearlyExpenses),
    yearlyProfit: floorSignedMoney(yearlyProfit),
    monthlyConsumptionTax,
    monthlyInvoiceAmountWithTax: floorMoney(monthlyInvoiceAmountWithTax),
    yearlyInvoiceAmountWithTax: floorMoney(yearlyInvoiceAmountWithTax),
    requiredMonthlySales: floorMoney(requiredMonthlySales),
    requiredMonthlyInvoiceAmountWithTax: floorMoney(requiredMonthlyInvoiceAmountWithTax),
  };
}

export default function FreelanceIncomeCalculator() {
  const monthlySalesInputRef = useRef<HTMLInputElement>(null);
  const monthlyExpensesInputRef = useRef<HTMLInputElement>(null);
  const targetMonthlyProfitInputRef = useRef<HTMLInputElement>(null);
  const [monthlySalesText, setMonthlySalesText] = useState(String(defaultMonthlySales));
  const [monthlyExpensesText, setMonthlyExpensesText] = useState(String(defaultMonthlyExpenses));
  const [targetMonthlyProfitText, setTargetMonthlyProfitText] = useState(String(defaultTargetMonthlyProfit));
  const [monthlySales, setMonthlySales] = useState(defaultMonthlySales);
  const [monthlyExpenses, setMonthlyExpenses] = useState(defaultMonthlyExpenses);
  const [targetMonthlyProfit, setTargetMonthlyProfit] = useState(defaultTargetMonthlyProfit);
  const [includeConsumptionTax, setIncludeConsumptionTax] = useState(defaultIncludeConsumptionTax);

  useEffect(() => {
    const savedMonthlySales = localStorage.getItem(monthlySalesStorageKey);
    const savedMonthlyExpenses = localStorage.getItem(monthlyExpensesStorageKey);
    const savedTargetMonthlyProfit = localStorage.getItem(targetMonthlyProfitStorageKey);
    const savedIncludeConsumptionTax = localStorage.getItem(includeConsumptionTaxStorageKey);

    if (savedMonthlySales !== null) {
      setMonthlySalesText(savedMonthlySales);
      setMonthlySales(Number(savedMonthlySales));
    }

    if (savedMonthlyExpenses !== null) {
      setMonthlyExpensesText(savedMonthlyExpenses);
      setMonthlyExpenses(Number(savedMonthlyExpenses));
    }

    if (savedTargetMonthlyProfit !== null) {
      setTargetMonthlyProfitText(savedTargetMonthlyProfit);
      setTargetMonthlyProfit(Number(savedTargetMonthlyProfit));
    }

    if (savedIncludeConsumptionTax !== null) {
      setIncludeConsumptionTax(savedIncludeConsumptionTax === "true");
    }
  }, []);

  const commitMonthlySales = () => {
    const value = Math.min(maxMonthlySales, Math.max(minMoneyValue, Number(monthlySalesText) || minMoneyValue));
    setMonthlySales(value);
    setMonthlySalesText(String(value));
    localStorage.setItem(monthlySalesStorageKey, String(value));
  };

  const commitMonthlyExpenses = () => {
    const value = Math.min(maxMonthlyExpenses, Math.max(minMoneyValue, Number(monthlyExpensesText) || minMoneyValue));
    setMonthlyExpenses(value);
    setMonthlyExpensesText(String(value));
    localStorage.setItem(monthlyExpensesStorageKey, String(value));
  };

  const commitTargetMonthlyProfit = () => {
    const value = Math.min(maxTargetMonthlyProfit, Math.max(minMoneyValue, Number(targetMonthlyProfitText) || minMoneyValue));
    setTargetMonthlyProfit(value);
    setTargetMonthlyProfitText(String(value));
    localStorage.setItem(targetMonthlyProfitStorageKey, String(value));
  };

  const changeIncludeConsumptionTax = (value: boolean) => {
    setIncludeConsumptionTax(value);
    localStorage.setItem(includeConsumptionTaxStorageKey, String(value));
  };

  const resetInputs = () => {
    setMonthlySalesText(String(defaultMonthlySales));
    setMonthlyExpensesText(String(defaultMonthlyExpenses));
    setTargetMonthlyProfitText(String(defaultTargetMonthlyProfit));
    setMonthlySales(defaultMonthlySales);
    setMonthlyExpenses(defaultMonthlyExpenses);
    setTargetMonthlyProfit(defaultTargetMonthlyProfit);
    setIncludeConsumptionTax(defaultIncludeConsumptionTax);
    localStorage.removeItem(monthlySalesStorageKey);
    localStorage.removeItem(monthlyExpensesStorageKey);
    localStorage.removeItem(targetMonthlyProfitStorageKey);
    localStorage.removeItem(includeConsumptionTaxStorageKey);
  };

  const result = calculateFreelanceIncome(
    monthlySales,
    monthlyExpenses,
    targetMonthlyProfit,
    includeConsumptionTax,
  );

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">フリーランス報酬計算機</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">入力項目</h2>

          <NumberInput
            label="月の売上（税抜・円）"
            value={monthlySalesText}
            maxValue={maxMonthlySales}
            inputRef={monthlySalesInputRef}
            onChange={setMonthlySalesText}
            onCommit={commitMonthlySales}
            onEnter={() => {
              monthlyExpensesInputRef.current?.focus();
            }}
          />

          <NumberInput
            label="月の経費（円）"
            value={monthlyExpensesText}
            maxValue={maxMonthlyExpenses}
            inputRef={monthlyExpensesInputRef}
            onChange={setMonthlyExpensesText}
            onCommit={commitMonthlyExpenses}
            onEnter={() => {
              targetMonthlyProfitInputRef.current?.focus();
            }}
          />

          <NumberInput
            label="目標月利益（円）"
            value={targetMonthlyProfitText}
            maxValue={maxTargetMonthlyProfit}
            inputRef={targetMonthlyProfitInputRef}
            onChange={setTargetMonthlyProfitText}
            onCommit={commitTargetMonthlyProfit}
            onEnter={() => {
              targetMonthlyProfitInputRef.current?.blur();
            }}
          />

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeConsumptionTax}
              onChange={(event) => {
                changeIncludeConsumptionTax(event.target.checked);
              }}
            />
            消費税10%を請求額の目安に含める
          </label>

          <p className="mt-2 text-xs leading-6 text-gray-500">
            売上は税抜金額として入力してください。消費税を含める場合は、税込の請求額目安も表示します。
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">計算結果</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>月の売上（税抜）</span>
              <span>{result.monthlySales.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>月の経費</span>
              <span>-{result.monthlyExpenses.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">月の利益目安</div>
              <div
                className={`mt-2 text-3xl font-bold ${
                  result.monthlyProfit < 0 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {result.monthlyProfit.toLocaleString()}円
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <span>年間売上（税抜）</span>
              <span>{result.yearlySales.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>年間経費</span>
              <span>-{result.yearlyExpenses.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>年間利益目安</span>
              <span className={result.yearlyProfit < 0 ? "text-red-600" : "text-gray-900"}>
                {result.yearlyProfit.toLocaleString()}円
              </span>
            </div>

            {includeConsumptionTax && (
              <>
                <hr />

                <div className="flex justify-between">
                  <span>請求時の消費税目安</span>
                  <span>{result.monthlyConsumptionTax.toLocaleString()}円</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>月の税込請求額目安</span>
                  <span>{result.monthlyInvoiceAmountWithTax.toLocaleString()}円</span>
                </div>

                <div className="flex justify-between">
                  <span>年間税込請求額目安</span>
                  <span>{result.yearlyInvoiceAmountWithTax.toLocaleString()}円</span>
                </div>
              </>
            )}

            <hr />

            <div className="flex justify-between">
              <span>目標月利益</span>
              <span>{targetMonthlyProfit.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>必要な月売上（税抜）</span>
              <span>{result.requiredMonthlySales.toLocaleString()}円</span>
            </div>

            {includeConsumptionTax && (
              <div className="flex justify-between">
                <span>必要な税込請求額目安</span>
                <span>{result.requiredMonthlyInvoiceAmountWithTax.toLocaleString()}円</span>
              </div>
            )}
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2 font-bold hover:bg-gray-300"
            onClick={resetInputs}
          >
            入力内容をリセット
          </button>
        </div>
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">この計算機について</h2>

        <div className="space-y-4 text-sm leading-7 text-gray-700">
          <div>
            <h3 className="font-bold text-gray-900">計算できる内容</h3>
            <p>
              月の売上と経費から、フリーランス・副業の月利益と年間利益の目安を計算できます。目標月利益を入力すると、必要な月売上も逆算できます。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">消費税の扱い</h3>
            <p>
              消費税を含める場合、売上を税抜金額として扱い、10%を加えた税込請求額の目安を表示します。実際の納税額や免税・課税事業者の判定は考慮していません。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">注意事項</h3>
            <p>この計算結果は概算です。</p>
            <p>
              所得税、住民税、国民健康保険、国民年金、源泉徴収、消費税の納税額などは考慮していません。実際の手取りや税負担は個別条件によって変わります。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

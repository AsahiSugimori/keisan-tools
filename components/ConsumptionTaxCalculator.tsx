"use client";

import { useEffect, useRef, useState } from "react";
import {
  type ConsumptionTaxCalculationMode,
  type ConsumptionTaxRateType,
  consumptionTaxAmountStorageKey,
  consumptionTaxCalculationModeLabels,
  consumptionTaxCalculationModeStorageKey,
  consumptionTaxPercentRateDivisor,
  consumptionTaxRateTypeLabels,
  consumptionTaxRateTypeStorageKey,
  customConsumptionTaxRateStorageKey,
  defaultConsumptionTaxAmount,
  defaultConsumptionTaxCalculationMode,
  defaultConsumptionTaxRateType,
  defaultCustomConsumptionTaxRatePercent,
  maxConsumptionTaxAmount,
  maxCustomConsumptionTaxRatePercent,
  minConsumptionTaxValue,
  reducedConsumptionTaxRatePercent,
  standardConsumptionTaxRatePercent,
} from "../lib/consumptionTaxConstants";
import NumberInput from "./NumberInput";

/**
 * 消費税計算結果
 */
type ConsumptionTaxResult = {
  taxExcludedAmount: number;
  taxAmount: number;
  taxIncludedAmount: number;
};

/**
 * 金額を0円以上の整数に丸める
 *
 * @param value 金額
 * @returns 0円以上の整数
 */
function floorMoney(value: number): number {
  return Math.max(minConsumptionTaxValue, Math.floor(value));
}

/**
 * 税率タイプから税率を取得する
 *
 * @param taxRateType 税率タイプ
 * @param customTaxRatePercent 任意の税率
 * @returns 税率(%)
 */
function getTaxRatePercent(
  taxRateType: ConsumptionTaxRateType,
  customTaxRatePercent: number
): number {
  if (taxRateType === "standard10") {
    return standardConsumptionTaxRatePercent;
  }

  if (taxRateType === "reduced8") {
    return reducedConsumptionTaxRatePercent;
  }

  return customTaxRatePercent;
}

/**
 * 消費税を計算する
 *
 * @param amount 入力金額
 * @param calculationMode 計算方法
 * @param taxRatePercent 税率(%)
 * @returns 計算結果
 */
function calculateConsumptionTax(
  amount: number,
  calculationMode: ConsumptionTaxCalculationMode,
  taxRatePercent: number
): ConsumptionTaxResult {
  const taxRate = taxRatePercent / consumptionTaxPercentRateDivisor;

  if (calculationMode === "taxIncludedToExcluded") {
    const taxExcludedAmount = floorMoney(amount / (1 + taxRate));
    const taxAmount = floorMoney(amount - taxExcludedAmount);

    return {
      taxExcludedAmount,
      taxAmount,
      taxIncludedAmount: floorMoney(amount),
    };
  }

  const taxAmount = floorMoney(amount * taxRate);

  return {
    taxExcludedAmount: floorMoney(amount),
    taxAmount,
    taxIncludedAmount: floorMoney(amount + taxAmount),
  };
}

/**
 * 消費税計算機
 */
export default function ConsumptionTaxCalculator() {
  /** 金額入力欄参照 */
  const amountInputRef = useRef<HTMLInputElement>(null);
  /** 入力文字列(金額) */
  const [amountText, setAmountText] = useState(
    String(defaultConsumptionTaxAmount)
  );
  /** 入力文字列(任意の税率) */
  const [customTaxRatePercentText, setCustomTaxRatePercentText] = useState(
    String(defaultCustomConsumptionTaxRatePercent)
  );
  /** 計算用確定値(金額) */
  const [amount, setAmount] = useState(defaultConsumptionTaxAmount);
  /** 計算用確定値(任意の税率) */
  const [customTaxRatePercent, setCustomTaxRatePercent] = useState(
    defaultCustomConsumptionTaxRatePercent
  );
  /** 計算用確定値(計算方法) */
  const [calculationMode, setCalculationMode] =
    useState<ConsumptionTaxCalculationMode>(
      defaultConsumptionTaxCalculationMode
    );
  /** 計算用確定値(税率タイプ) */
  const [taxRateType, setTaxRateType] = useState<ConsumptionTaxRateType>(
    defaultConsumptionTaxRateType
  );

  /**
   * 保存済み入力値を読み込む
   */
  useEffect(() => {
    const savedAmount = localStorage.getItem(consumptionTaxAmountStorageKey);
    const savedCalculationMode = localStorage.getItem(
      consumptionTaxCalculationModeStorageKey
    );
    const savedTaxRateType = localStorage.getItem(
      consumptionTaxRateTypeStorageKey
    );
    const savedCustomTaxRate = localStorage.getItem(
      customConsumptionTaxRateStorageKey
    );

    if (savedAmount !== null) {
      setAmountText(savedAmount);
      setAmount(Number(savedAmount));
    }

    if (
      savedCalculationMode === "taxExcludedToIncluded" ||
      savedCalculationMode === "taxIncludedToExcluded"
    ) {
      setCalculationMode(savedCalculationMode);
    }

    if (
      savedTaxRateType === "standard10" ||
      savedTaxRateType === "reduced8" ||
      savedTaxRateType === "custom"
    ) {
      setTaxRateType(savedTaxRateType);
    }

    if (savedCustomTaxRate !== null) {
      setCustomTaxRatePercentText(savedCustomTaxRate);
      setCustomTaxRatePercent(Number(savedCustomTaxRate));
    }
  }, []);

  /**
   * 「金額」の入力文字列を検証し、計算用の「金額」に反映する
   */
  const commitAmount = () => {
    const value = Math.min(
      maxConsumptionTaxAmount,
      Math.max(minConsumptionTaxValue, Number(amountText) || minConsumptionTaxValue)
    );

    setAmount(value);
    setAmountText(String(value));
    localStorage.setItem(consumptionTaxAmountStorageKey, String(value));
  };

  /**
   * 「任意の税率」の入力文字列を検証し、計算用の「任意の税率」に反映する
   */
  const commitCustomTaxRatePercent = () => {
    const value = Math.min(
      maxCustomConsumptionTaxRatePercent,
      Math.max(
        minConsumptionTaxValue,
        Number(customTaxRatePercentText) || minConsumptionTaxValue
      )
    );

    setCustomTaxRatePercent(value);
    setCustomTaxRatePercentText(String(value));
    localStorage.setItem(customConsumptionTaxRateStorageKey, String(value));
  };

  /**
   * 「計算方法」を変更する
   *
   * @param value 計算方法
   */
  const changeCalculationMode = (value: ConsumptionTaxCalculationMode) => {
    setCalculationMode(value);
    localStorage.setItem(consumptionTaxCalculationModeStorageKey, value);
  };

  /**
   * 「税率タイプ」を変更する
   *
   * @param value 税率タイプ
   */
  const changeTaxRateType = (value: ConsumptionTaxRateType) => {
    setTaxRateType(value);
    localStorage.setItem(consumptionTaxRateTypeStorageKey, value);
  };

  /**
   * 入力値を初期状態に戻す
   */
  const resetInputs = () => {
    setAmountText(String(defaultConsumptionTaxAmount));
    setCustomTaxRatePercentText(String(defaultCustomConsumptionTaxRatePercent));
    setAmount(defaultConsumptionTaxAmount);
    setCustomTaxRatePercent(defaultCustomConsumptionTaxRatePercent);
    setCalculationMode(defaultConsumptionTaxCalculationMode);
    setTaxRateType(defaultConsumptionTaxRateType);

    localStorage.removeItem(consumptionTaxAmountStorageKey);
    localStorage.removeItem(consumptionTaxCalculationModeStorageKey);
    localStorage.removeItem(consumptionTaxRateTypeStorageKey);
    localStorage.removeItem(customConsumptionTaxRateStorageKey);
  };

  /** 税率(%) */
  const taxRatePercent = getTaxRatePercent(taxRateType, customTaxRatePercent);
  /** 計算結果 */
  const result = calculateConsumptionTax(amount, calculationMode, taxRatePercent);

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">消費税計算機</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 入力エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">入力項目</h2>

          <NumberInput
            label="金額（円）"
            value={amountText}
            maxValue={maxConsumptionTaxAmount}
            inputRef={amountInputRef}
            onChange={setAmountText}
            onCommit={commitAmount}
            onEnter={() => {
              amountInputRef.current?.blur();
            }}
          />

          <div className="mt-4">
            <label className="mb-1 block font-bold">計算方法</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={calculationMode}
              onChange={(event) => {
                changeCalculationMode(
                  event.target.value as ConsumptionTaxCalculationMode
                );
              }}
            >
              <option value="taxExcludedToIncluded">
                {consumptionTaxCalculationModeLabels.taxExcludedToIncluded}
              </option>
              <option value="taxIncludedToExcluded">
                {consumptionTaxCalculationModeLabels.taxIncludedToExcluded}
              </option>
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-1 block font-bold">税率</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={taxRateType}
              onChange={(event) => {
                changeTaxRateType(event.target.value as ConsumptionTaxRateType);
              }}
            >
              <option value="standard10">
                {consumptionTaxRateTypeLabels.standard10}
              </option>
              <option value="reduced8">
                {consumptionTaxRateTypeLabels.reduced8}
              </option>
              <option value="custom">
                {consumptionTaxRateTypeLabels.custom}
              </option>
            </select>
            <p className="mt-2 text-xs leading-6 text-gray-500">
              通常の買い物は10%、軽減税率対象の飲食料品などは8%が目安です。
            </p>
          </div>

          {taxRateType === "custom" && (
            <div className="mt-4">
              <label className="mb-1 block font-bold">任意の税率（%）</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                inputMode="decimal"
                value={customTaxRatePercentText}
                onBlur={commitCustomTaxRatePercent}
                onChange={(event) => {
                  setCustomTaxRatePercentText(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitCustomTaxRatePercent();
                    event.currentTarget.blur();
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* 結果エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">計算結果</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>計算方法</span>
              <span>{consumptionTaxCalculationModeLabels[calculationMode]}</span>
            </div>

            <div className="flex justify-between">
              <span>税率</span>
              <span>{taxRatePercent.toLocaleString()}%</span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>税抜価格</span>
              <span>{result.taxExcludedAmount.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>消費税額</span>
              <span>{result.taxAmount.toLocaleString()}円</span>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">税込価格</div>
              <div className="mt-2 text-3xl font-bold">
                {result.taxIncludedAmount.toLocaleString()}円
              </div>
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2 font-bold hover:bg-gray-300"
            onClick={resetInputs}
          >
            入力内容をリセット
          </button>
        </div>
      </div>

      {/* 注意書き・補足説明 */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">この計算機について</h2>

        <div className="space-y-4 text-sm leading-7 text-gray-700">
          <div>
            <h3 className="font-bold text-gray-900">計算できる内容</h3>
            <p>
              金額、計算方法、税率を入力すると、税抜価格・消費税額・税込価格を計算できます。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">計算式</h3>
            <p>税抜から税込: 税込価格 = 税抜価格 + 税抜価格 × 税率</p>
            <p>税込から税抜: 税抜価格 = 税込価格 ÷ (1 + 税率)</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">注意事項</h3>
            <p>この計算結果は目安です。</p>
            <p>
              軽減税率の対象になるかどうかは商品や取引内容によって変わるため、正確な判断が必要な場合は国税庁や専門窓口の情報を確認してください。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

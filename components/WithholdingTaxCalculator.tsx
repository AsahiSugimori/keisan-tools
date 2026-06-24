"use client";

import { useEffect, useRef, useState } from "react";
import {
  type ConsumptionTaxRateType,
  type WithholdingTargetMode,
  consumptionTaxRateOptions,
  consumptionTaxRateTypeStorageKey,
  defaultConsumptionTaxRateType,
  defaultRewardAmount,
  defaultWithholdingTargetMode,
  excessWithholdingTaxRate,
  maxRewardAmount,
  minMoneyValue,
  rewardAmountStorageKey,
  standardWithholdingTaxRate,
  withholdingBorderAmount,
  withholdingTargetModeLabels,
  withholdingTargetModeStorageKey,
} from "../lib/withholdingTaxConstants";
import NumberInput from "./NumberInput";

/**
 * 源泉徴収計算結果
 */
type WithholdingTaxResult = {
  rewardAmount: number;
  consumptionTax: number;
  invoiceAmount: number;
  withholdingTargetAmount: number;
  withholdingTax: number;
  transferAmount: number;
};

/**
 * 金額を0円以上の整数に丸める
 *
 * @param value 金額
 * @returns 0円以上の整数
 */
function floorMoney(value: number): number {
  return Math.max(minMoneyValue, Math.floor(value));
}

/**
 * 消費税率タイプから税率を取得する
 *
 * @param consumptionTaxRateType 消費税率タイプ
 * @returns 消費税率
 */
function getConsumptionTaxRate(
  consumptionTaxRateType: ConsumptionTaxRateType
): number {
  return (
    consumptionTaxRateOptions.find((option) => option.type === consumptionTaxRateType)
      ?.rate ?? minMoneyValue
  );
}

/**
 * 源泉徴収税額を計算する
 *
 * @param withholdingTargetAmount 源泉徴収対象額
 * @returns 源泉徴収税額
 */
function calculateWithholdingTax(withholdingTargetAmount: number): number {
  if (withholdingTargetAmount <= withholdingBorderAmount) {
    return floorMoney(withholdingTargetAmount * standardWithholdingTaxRate);
  }

  return floorMoney(
    withholdingBorderAmount * standardWithholdingTaxRate +
      (withholdingTargetAmount - withholdingBorderAmount) * excessWithholdingTaxRate
  );
}

/**
 * 源泉徴収計算処理
 *
 * @param rewardAmount 報酬額(税抜)
 * @param consumptionTaxRateType 消費税率タイプ
 * @param withholdingTargetMode 源泉徴収対象額の扱い
 * @returns 計算結果
 */
function calculateWithholdingTaxResult(
  rewardAmount: number,
  consumptionTaxRateType: ConsumptionTaxRateType,
  withholdingTargetMode: WithholdingTargetMode
): WithholdingTaxResult {
  /** 消費税率 */
  const consumptionTaxRate = getConsumptionTaxRate(consumptionTaxRateType);
  /** 消費税額 */
  const consumptionTax = floorMoney(rewardAmount * consumptionTaxRate);
  /** 請求額(税込) */
  const invoiceAmount = rewardAmount + consumptionTax;
  /** 源泉徴収対象額 */
  const withholdingTargetAmount =
    withholdingTargetMode === "taxIncluded" ? invoiceAmount : rewardAmount;
  /** 源泉徴収税額 */
  const withholdingTax = calculateWithholdingTax(withholdingTargetAmount);
  /** 差引入金額 */
  const transferAmount = invoiceAmount - withholdingTax;

  return {
    rewardAmount: floorMoney(rewardAmount),
    consumptionTax,
    invoiceAmount,
    withholdingTargetAmount: floorMoney(withholdingTargetAmount),
    withholdingTax,
    transferAmount: floorMoney(transferAmount),
  };
}

/**
 * 源泉徴収計算機
 */
export default function WithholdingTaxCalculator() {
  /** 報酬額入力欄参照 */
  const rewardAmountInputRef = useRef<HTMLInputElement>(null);
  /** 入力文字列(報酬額・税抜) */
  const [rewardAmountText, setRewardAmountText] = useState(String(defaultRewardAmount));
  /** 計算用確定値(報酬額・税抜) */
  const [rewardAmount, setRewardAmount] = useState(defaultRewardAmount);
  /** 計算用確定値(消費税率) */
  const [consumptionTaxRateType, setConsumptionTaxRateType] =
    useState<ConsumptionTaxRateType>(defaultConsumptionTaxRateType);
  /** 計算用確定値(源泉徴収対象額の扱い) */
  const [withholdingTargetMode, setWithholdingTargetMode] =
    useState<WithholdingTargetMode>(defaultWithholdingTargetMode);

  /**
   * 保存済み入力値を読み込む
   */
  useEffect(() => {
    const savedRewardAmount = localStorage.getItem(rewardAmountStorageKey);
    const savedConsumptionTaxRateType = localStorage.getItem(
      consumptionTaxRateTypeStorageKey
    );
    const savedWithholdingTargetMode = localStorage.getItem(
      withholdingTargetModeStorageKey
    );

    if (savedRewardAmount !== null) {
      setRewardAmountText(savedRewardAmount);
      setRewardAmount(Number(savedRewardAmount));
    }

    if (
      savedConsumptionTaxRateType === "rate10" ||
      savedConsumptionTaxRateType === "rate8" ||
      savedConsumptionTaxRateType === "rate0"
    ) {
      setConsumptionTaxRateType(savedConsumptionTaxRateType);
    }

    if (
      savedWithholdingTargetMode === "taxExcluded" ||
      savedWithholdingTargetMode === "taxIncluded"
    ) {
      setWithholdingTargetMode(savedWithholdingTargetMode);
    }
  }, []);

  /**
   * 「報酬額」の入力文字列を検証し、計算用の「報酬額」に反映する
   */
  const commitRewardAmount = () => {
    const value = Math.min(
      maxRewardAmount,
      Math.max(minMoneyValue, Number(rewardAmountText) || minMoneyValue)
    );

    setRewardAmount(value);
    setRewardAmountText(String(value));
    localStorage.setItem(rewardAmountStorageKey, String(value));
  };

  /**
   * 「消費税率」を変更する
   *
   * @param value 消費税率タイプ
   */
  const changeConsumptionTaxRateType = (value: ConsumptionTaxRateType) => {
    setConsumptionTaxRateType(value);
    localStorage.setItem(consumptionTaxRateTypeStorageKey, value);
  };

  /**
   * 「源泉徴収対象額の扱い」を変更する
   *
   * @param value 源泉徴収対象額の扱い
   */
  const changeWithholdingTargetMode = (value: WithholdingTargetMode) => {
    setWithholdingTargetMode(value);
    localStorage.setItem(withholdingTargetModeStorageKey, value);
  };

  /**
   * 入力値を初期状態に戻す
   */
  const resetInputs = () => {
    setRewardAmountText(String(defaultRewardAmount));
    setRewardAmount(defaultRewardAmount);
    setConsumptionTaxRateType(defaultConsumptionTaxRateType);
    setWithholdingTargetMode(defaultWithholdingTargetMode);

    localStorage.removeItem(rewardAmountStorageKey);
    localStorage.removeItem(consumptionTaxRateTypeStorageKey);
    localStorage.removeItem(withholdingTargetModeStorageKey);
  };

  /** 計算結果 */
  const result = calculateWithholdingTaxResult(
    rewardAmount,
    consumptionTaxRateType,
    withholdingTargetMode
  );

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        源泉徴収計算機
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 入力エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">入力項目</h2>

          <NumberInput
            label="報酬額（税抜・円）"
            value={rewardAmountText}
            maxValue={maxRewardAmount}
            inputRef={rewardAmountInputRef}
            onChange={setRewardAmountText}
            onCommit={commitRewardAmount}
            onEnter={() => {
              rewardAmountInputRef.current?.blur();
            }}
          />

          <p className="mt-1 text-xs leading-6 text-gray-500">
            請求書に記載する報酬本体の金額を入力してください。消費税は下の税率から自動計算します。
          </p>

          <div className="mt-4">
            <label className="mb-1 block font-bold">消費税率</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={consumptionTaxRateType}
              onChange={(event) => {
                changeConsumptionTaxRateType(
                  event.target.value as ConsumptionTaxRateType
                );
              }}
            >
              {consumptionTaxRateOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-1 block font-bold">源泉徴収対象額</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={withholdingTargetMode}
              onChange={(event) => {
                changeWithholdingTargetMode(
                  event.target.value as WithholdingTargetMode
                );
              }}
            >
              <option value="taxExcluded">
                {withholdingTargetModeLabels.taxExcluded}
              </option>
              <option value="taxIncluded">
                {withholdingTargetModeLabels.taxIncluded}
              </option>
            </select>
            <p className="mt-2 text-xs leading-6 text-gray-500">
              請求書で報酬額と消費税額を明確に分ける場合は、税抜の報酬額を対象にする設定が使いやすいです。
            </p>
          </div>
        </div>

        {/* 結果エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">計算結果</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>報酬額（税抜）</span>
              <span>{result.rewardAmount.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>消費税</span>
              <span>{result.consumptionTax.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>請求額（税込）</span>
              <span>{result.invoiceAmount.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>源泉徴収対象額</span>
              <span>{result.withholdingTargetAmount.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>源泉徴収税額</span>
              <span>-{result.withholdingTax.toLocaleString()}円</span>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">差引入金額</div>

              <div className="mt-2 text-3xl font-bold">
                {result.transferAmount.toLocaleString()}円
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
              フリーランス・副業・業務委託などで、報酬額から源泉徴収税額と差引入金額を概算できます。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">計算式</h3>
            <p>
              源泉徴収対象額が100万円以下の場合は、対象額に10.21%を掛けて計算します。
            </p>
            <p>
              100万円を超える場合は、100万円までの部分を10.21%、100万円を超える部分を20.42%として計算します。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">消費税の扱い</h3>
            <p>
              原則として税込額が源泉徴収の対象ですが、請求書で報酬額と消費税額を明確に区分している場合は、税抜の報酬額だけを対象にできる場合があります。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">注意事項</h3>
            <p>この計算結果は概算です。</p>
            <p>
              源泉徴収が必要かどうかは、報酬の種類、支払者、契約内容などによって変わります。
            </p>
            <p>
              最終的な判断が必要な場合は、国税庁の情報や税理士などの専門家に確認してください。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

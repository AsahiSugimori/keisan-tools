"use client";

import { useEffect, useRef, useState } from "react";
import {
  type AnnualLimitType,
  annualLimitOptions,
  annualLimitTypeStorageKey,
  averageWeeksPerMonth,
  customAnnualLimitStorageKey,
  defaultAnnualLimitType,
  defaultCustomAnnualLimit,
  defaultHourlyWage,
  defaultIncludeTransportationCost,
  defaultTransportationCost,
  defaultWorkingDaysPerWeek,
  hourlyWageStorageKey,
  includeTransportationCostStorageKey,
  maxCustomAnnualLimit,
  maxHourlyWage,
  maxTransportationCost,
  maxWorkingDaysPerWeek,
  minValue,
  monthsPerYear,
  transportationCostStorageKey,
  weeksPerYear,
  workingDaysPerWeekStorageKey,
} from "../lib/dependentWorkLimitConstants";
import NumberInput from "./NumberInput";

/**
 * 扶養内勤務シミュレーターの計算結果
 */
type DependentWorkLimitResult = {
  annualLimit: number;
  yearlyTransportationCost: number;
  yearlyWageLimit: number;
  monthlyIncomeLimit: number;
  monthlyWageLimit: number;
  yearlyWorkingHours: number;
  monthlyWorkingHours: number;
  weeklyWorkingHours: number;
  monthlyWorkingDays: number;
  hoursPerDay: number;
};

/**
 * 時給別の目安表示用データ
 */
const exampleHourlyWages = [1100, 1200, 1300, 1500];

/**
 * 金額・時間を0以上に丸める
 *
 * @param value 数値
 * @returns 0以上の数値
 */
function floorPositive(value: number): number {
  return Math.max(minValue, Math.floor(value));
}

/**
 * 小数1桁で丸める
 *
 * @param value 数値
 * @returns 小数1桁の数値
 */
function roundOneDecimal(value: number): number {
  return Math.round(Math.max(minValue, value) * 10) / 10;
}

/**
 * 年収上限タイプから年収上限額を取得する
 *
 * @param annualLimitType 年収上限タイプ
 * @param customAnnualLimit 任意入力の年収上限
 * @returns 年収上限額
 */
function getAnnualLimit(
  annualLimitType: AnnualLimitType,
  customAnnualLimit: number,
): number {
  if (annualLimitType === "custom") {
    return customAnnualLimit;
  }

  return (
    annualLimitOptions.find((option) => option.type === annualLimitType)
      ?.amount ?? defaultCustomAnnualLimit
  );
}

/**
 * 扶養内で働ける時間を逆算する
 *
 * @param hourlyWage 時給
 * @param transportationCost 月の交通費
 * @param workingDaysPerWeek 週の勤務日数
 * @param annualLimitType 年収上限タイプ
 * @param customAnnualLimit 任意入力の年収上限
 * @param includeTransportationCost 交通費を年収上限に含めるか
 * @returns 計算結果
 */
function calculateDependentWorkLimit(
  hourlyWage: number,
  transportationCost: number,
  workingDaysPerWeek: number,
  annualLimitType: AnnualLimitType,
  customAnnualLimit: number,
  includeTransportationCost: boolean,
): DependentWorkLimitResult {
  /** 年収上限 */
  const annualLimit = getAnnualLimit(annualLimitType, customAnnualLimit);
  /** 年間交通費 */
  const yearlyTransportationCost = includeTransportationCost
    ? transportationCost * monthsPerYear
    : minValue;
  /** 年間で稼げる給与上限 */
  const yearlyWageLimit = Math.max(
    minValue,
    annualLimit - yearlyTransportationCost,
  );
  /** 月の収入上限 */
  const monthlyIncomeLimit = annualLimit / monthsPerYear;
  /** 月に稼げる給与上限 */
  const monthlyWageLimit = yearlyWageLimit / monthsPerYear;
  /** 年間で働ける時間 */
  const yearlyWorkingHours =
    hourlyWage > minValue ? yearlyWageLimit / hourlyWage : minValue;
  /** 月に働ける時間 */
  const monthlyWorkingHours = yearlyWorkingHours / monthsPerYear;
  /** 週に働ける時間 */
  const weeklyWorkingHours = yearlyWorkingHours / weeksPerYear;
  /** 月の勤務日数目安 */
  const monthlyWorkingDays = workingDaysPerWeek * averageWeeksPerMonth;
  /** 1日あたり働ける時間 */
  const hoursPerDay =
    monthlyWorkingDays > minValue
      ? monthlyWorkingHours / monthlyWorkingDays
      : minValue;

  return {
    annualLimit: floorPositive(annualLimit),
    yearlyTransportationCost: floorPositive(yearlyTransportationCost),
    yearlyWageLimit: floorPositive(yearlyWageLimit),
    monthlyIncomeLimit: floorPositive(monthlyIncomeLimit),
    monthlyWageLimit: floorPositive(monthlyWageLimit),
    yearlyWorkingHours: roundOneDecimal(yearlyWorkingHours),
    monthlyWorkingHours: roundOneDecimal(monthlyWorkingHours),
    weeklyWorkingHours: roundOneDecimal(weeklyWorkingHours),
    monthlyWorkingDays: roundOneDecimal(monthlyWorkingDays),
    hoursPerDay: roundOneDecimal(hoursPerDay),
  };
}

/**
 * 扶養内勤務シミュレーター
 */
export default function DependentWorkLimitCalculator() {
  /** 時給入力欄参照 */
  const hourlyWageInputRef = useRef<HTMLInputElement>(null);
  /** 月の交通費入力欄参照 */
  const transportationCostInputRef = useRef<HTMLInputElement>(null);
  /** 週の勤務日数入力欄参照 */
  const workingDaysPerWeekInputRef = useRef<HTMLInputElement>(null);
  /** 任意の年収上限入力欄参照 */
  const customAnnualLimitInputRef = useRef<HTMLInputElement>(null);
  /** 入力文字列(時給) */
  const [hourlyWageText, setHourlyWageText] = useState(
    String(defaultHourlyWage),
  );
  /** 入力文字列(月の交通費) */
  const [transportationCostText, setTransportationCostText] = useState(
    String(defaultTransportationCost),
  );
  /** 入力文字列(週の勤務日数) */
  const [workingDaysPerWeekText, setWorkingDaysPerWeekText] = useState(
    String(defaultWorkingDaysPerWeek),
  );
  /** 入力文字列(任意の年収上限) */
  const [customAnnualLimitText, setCustomAnnualLimitText] = useState(
    String(defaultCustomAnnualLimit),
  );
  /** 計算用確定値(時給) */
  const [hourlyWage, setHourlyWage] = useState(defaultHourlyWage);
  /** 計算用確定値(月の交通費) */
  const [transportationCost, setTransportationCost] = useState(
    defaultTransportationCost,
  );
  /** 計算用確定値(週の勤務日数) */
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(
    defaultWorkingDaysPerWeek,
  );
  /** 計算用確定値(任意の年収上限) */
  const [customAnnualLimit, setCustomAnnualLimit] = useState(
    defaultCustomAnnualLimit,
  );
  /** 計算用確定値(年収上限タイプ) */
  const [annualLimitType, setAnnualLimitType] = useState<AnnualLimitType>(
    defaultAnnualLimitType,
  );
  /** 計算用確定値(交通費を年収上限に含めるか) */
  const [includeTransportationCost, setIncludeTransportationCost] = useState(
    defaultIncludeTransportationCost,
  );

  /**
   * 保存済み入力値を読み込む
   */
  useEffect(() => {
    const savedHourlyWage = localStorage.getItem(hourlyWageStorageKey);
    const savedTransportationCost = localStorage.getItem(
      transportationCostStorageKey,
    );
    const savedWorkingDaysPerWeek = localStorage.getItem(
      workingDaysPerWeekStorageKey,
    );
    const savedAnnualLimitType = localStorage.getItem(
      annualLimitTypeStorageKey,
    );
    const savedCustomAnnualLimit = localStorage.getItem(
      customAnnualLimitStorageKey,
    );
    const savedIncludeTransportationCost = localStorage.getItem(
      includeTransportationCostStorageKey,
    );

    if (savedHourlyWage !== null) {
      setHourlyWageText(savedHourlyWage);
      setHourlyWage(Number(savedHourlyWage));
    }

    if (savedTransportationCost !== null) {
      setTransportationCostText(savedTransportationCost);
      setTransportationCost(Number(savedTransportationCost));
    }

    if (savedWorkingDaysPerWeek !== null) {
      setWorkingDaysPerWeekText(savedWorkingDaysPerWeek);
      setWorkingDaysPerWeek(Number(savedWorkingDaysPerWeek));
    }

    if (
      savedAnnualLimitType === "limit103" ||
      savedAnnualLimitType === "limit106" ||
      savedAnnualLimitType === "limit123" ||
      savedAnnualLimitType === "limit130" ||
      savedAnnualLimitType === "limit150" ||
      savedAnnualLimitType === "limit160" ||
      savedAnnualLimitType === "custom"
    ) {
      setAnnualLimitType(savedAnnualLimitType);
    }

    if (savedCustomAnnualLimit !== null) {
      setCustomAnnualLimitText(savedCustomAnnualLimit);
      setCustomAnnualLimit(Number(savedCustomAnnualLimit));
    }

    if (savedIncludeTransportationCost !== null) {
      setIncludeTransportationCost(savedIncludeTransportationCost === "true");
    }
  }, []);

  /**
   * 「時給」の入力文字列を検証し、計算用の「時給」に反映する
   */
  const commitHourlyWage = () => {
    const value = Math.min(
      maxHourlyWage,
      Math.max(minValue, Number(hourlyWageText) || minValue),
    );

    setHourlyWage(value);
    setHourlyWageText(String(value));
    localStorage.setItem(hourlyWageStorageKey, String(value));
  };

  /**
   * 「月の交通費」の入力文字列を検証し、計算用の「月の交通費」に反映する
   */
  const commitTransportationCost = () => {
    const value = Math.min(
      maxTransportationCost,
      Math.max(minValue, Number(transportationCostText) || minValue),
    );

    setTransportationCost(value);
    setTransportationCostText(String(value));
    localStorage.setItem(transportationCostStorageKey, String(value));
  };

  /**
   * 「週の勤務日数」の入力文字列を検証し、計算用の「週の勤務日数」に反映する
   */
  const commitWorkingDaysPerWeek = () => {
    const value = Math.min(
      maxWorkingDaysPerWeek,
      Math.max(minValue, Number(workingDaysPerWeekText) || minValue),
    );

    setWorkingDaysPerWeek(value);
    setWorkingDaysPerWeekText(String(value));
    localStorage.setItem(workingDaysPerWeekStorageKey, String(value));
  };

  /**
   * 「任意の年収上限」の入力文字列を検証し、計算用の「任意の年収上限」に反映する
   */
  const commitCustomAnnualLimit = () => {
    const value = Math.min(
      maxCustomAnnualLimit,
      Math.max(minValue, Number(customAnnualLimitText) || minValue),
    );

    setCustomAnnualLimit(value);
    setCustomAnnualLimitText(String(value));
    localStorage.setItem(customAnnualLimitStorageKey, String(value));
  };

  /**
   * 「年収上限」を変更する
   *
   * @param value 年収上限タイプ
   */
  const changeAnnualLimitType = (value: AnnualLimitType) => {
    setAnnualLimitType(value);
    localStorage.setItem(annualLimitTypeStorageKey, value);
  };

  /**
   * 「交通費を年収上限に含めるか」を変更する
   *
   * @param value 交通費を年収上限に含めるか
   */
  const changeIncludeTransportationCost = (value: boolean) => {
    setIncludeTransportationCost(value);
    localStorage.setItem(includeTransportationCostStorageKey, String(value));
  };

  /**
   * 入力値を初期状態に戻す
   */
  const resetInputs = () => {
    setHourlyWageText(String(defaultHourlyWage));
    setTransportationCostText(String(defaultTransportationCost));
    setWorkingDaysPerWeekText(String(defaultWorkingDaysPerWeek));
    setCustomAnnualLimitText(String(defaultCustomAnnualLimit));
    setHourlyWage(defaultHourlyWage);
    setTransportationCost(defaultTransportationCost);
    setWorkingDaysPerWeek(defaultWorkingDaysPerWeek);
    setCustomAnnualLimit(defaultCustomAnnualLimit);
    setAnnualLimitType(defaultAnnualLimitType);
    setIncludeTransportationCost(defaultIncludeTransportationCost);

    localStorage.removeItem(hourlyWageStorageKey);
    localStorage.removeItem(transportationCostStorageKey);
    localStorage.removeItem(workingDaysPerWeekStorageKey);
    localStorage.removeItem(annualLimitTypeStorageKey);
    localStorage.removeItem(customAnnualLimitStorageKey);
    localStorage.removeItem(includeTransportationCostStorageKey);
  };

  /** 計算結果 */
  const result = calculateDependentWorkLimit(
    hourlyWage,
    transportationCost,
    workingDaysPerWeek,
    annualLimitType,
    customAnnualLimit,
    includeTransportationCost,
  );
  /** 時給別の目安 */
  const exampleResults = exampleHourlyWages.map((exampleHourlyWage) => ({
    hourlyWage: exampleHourlyWage,
    limit103: calculateDependentWorkLimit(
      exampleHourlyWage,
      minValue,
      defaultWorkingDaysPerWeek,
      "limit103",
      defaultCustomAnnualLimit,
      false,
    ),
    limit130: calculateDependentWorkLimit(
      exampleHourlyWage,
      minValue,
      defaultWorkingDaysPerWeek,
      "limit130",
      defaultCustomAnnualLimit,
      false,
    ),
  }));

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        扶養内勤務シミュレーター
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 入力エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">入力項目</h2>

          {/* 入力項目(時給) */}
          <NumberInput
            label="時給（円）"
            value={hourlyWageText}
            maxValue={maxHourlyWage}
            inputRef={hourlyWageInputRef}
            onChange={setHourlyWageText}
            onCommit={commitHourlyWage}
            onEnter={() => {
              transportationCostInputRef.current?.focus();
            }}
          />

          {/* 入力項目(月の交通費) */}
          <NumberInput
            label="月の交通費（円）"
            value={transportationCostText}
            maxValue={maxTransportationCost}
            inputRef={transportationCostInputRef}
            onChange={setTransportationCostText}
            onCommit={commitTransportationCost}
            onEnter={() => {
              workingDaysPerWeekInputRef.current?.focus();
            }}
          />

          {/* 入力項目(週の勤務日数) */}
          <NumberInput
            label="週の勤務日数"
            value={workingDaysPerWeekText}
            maxValue={maxWorkingDaysPerWeek}
            inputRef={workingDaysPerWeekInputRef}
            onChange={setWorkingDaysPerWeekText}
            onCommit={commitWorkingDaysPerWeek}
            onEnter={() => {
              customAnnualLimitInputRef.current?.focus();
            }}
          />

          {/* 入力項目(年収上限) */}
          <div className="mt-4">
            <label className="mb-1 block font-bold text-gray-700">
              年収上限
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={annualLimitType}
              onChange={(event) => {
                changeAnnualLimitType(event.target.value as AnnualLimitType);
              }}
            >
              {annualLimitOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 入力項目(任意の年収上限) */}
          {annualLimitType === "custom" && (
            <NumberInput
              label="任意の年収上限（円）"
              value={customAnnualLimitText}
              maxValue={maxCustomAnnualLimit}
              inputRef={customAnnualLimitInputRef}
              onChange={setCustomAnnualLimitText}
              onCommit={commitCustomAnnualLimit}
              onEnter={() => {
                customAnnualLimitInputRef.current?.blur();
              }}
            />
          )}

          {/* 入力項目(交通費の扱い) */}
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeTransportationCost}
              onChange={(event) => {
                changeIncludeTransportationCost(event.target.checked);
              }}
            />
            交通費を年収上限に含める
          </label>

          <p className="mt-2 text-xs leading-6 text-gray-500">
            扶養・社会保険の判定では交通費の扱いがケースによって異なります。不安な場合はチェックありで少し安全側に見積もってください。
          </p>
        </div>

        {/* 結果エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">計算結果</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>年収上限</span>
              <span>{result.annualLimit.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>月の収入上限</span>
              <span>{result.monthlyIncomeLimit.toLocaleString()}円</span>
            </div>

            {includeTransportationCost && (
              <div className="flex justify-between">
                <span>年間交通費</span>
                <span>
                  -{result.yearlyTransportationCost.toLocaleString()}円
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>月に稼げる給与上限</span>
              <span>{result.monthlyWageLimit.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">月に働ける時間</div>

              <div className="mt-2 text-3xl font-bold">
                {result.monthlyWorkingHours.toLocaleString()}時間
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <span>週に働ける時間</span>
              <span>{result.weeklyWorkingHours.toLocaleString()}時間</span>
            </div>

            <div className="flex justify-between">
              <span>1日あたり働ける時間</span>
              <span>{result.hoursPerDay.toLocaleString()}時間</span>
            </div>

            <div className="flex justify-between">
              <span>月の勤務日数目安</span>
              <span>{result.monthlyWorkingDays.toLocaleString()}日</span>
            </div>

            <div className="flex justify-between">
              <span>年間で働ける時間</span>
              <span>{result.yearlyWorkingHours.toLocaleString()}時間</span>
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

        <div className="space-y-3 text-sm leading-7 text-gray-700">
          <details
            className="rounded-lg border border-gray-200 bg-white p-4"
            open
          >
            <summary className="cursor-pointer font-bold text-gray-900">
              計算できる内容
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                時給、月の交通費、週の勤務日数、年収上限から、扶養範囲内で働くための月の勤務時間・週の勤務時間・1日あたりの勤務時間を逆算できます。
              </p>
              <p>
                「時給1200円で扶養内に収めるには月何時間まで働けるか」「130万円以内なら週何時間くらいか」などをざっくり確認したいときに使えます。
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              使い方
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                「時給」と「年収上限」を入力すると、その範囲内に収めるために月何時間くらい働けるかを計算します。
              </p>
              <p>
                週の勤務日数を変えると、1日あたり何時間まで働けるかの目安も変わります。
              </p>
              <p>
                交通費を年収上限に含める場合は、月の交通費を入力してチェックを入れてください。
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              扶養内で働くとは？
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                扶養内で働くとは、税金や社会保険の負担が大きく変わらない範囲を意識して、年収や勤務時間を調整しながら働くことを指す場合が多いです。
              </p>
              <p>
                ただし、扶養の判定は年収だけで決まるとは限りません。勤務先の規模、週の所定労働時間、月額賃金、学生かどうか、配偶者や親の扶養かどうかによって扱いが変わります。
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              103万円・106万円・123万円・130万円・150万円・160万円の違い
            </summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-3 py-2 font-bold">年収の目安</th>
                    <th className="px-3 py-2 font-bold">主な意味</th>
                    <th className="px-3 py-2 font-bold">注意点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-3 py-2">103万円</td>
                    <td className="px-3 py-2">以前からよく使われる扶養の目安</td>
                    <td className="px-3 py-2">
                      税制改正後は、税金面の目安としては123万円や160万円もあわせて確認が必要です。
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">106万円</td>
                    <td className="px-3 py-2">社会保険加入の旧目安</td>
                    <td className="px-3 py-2">
                      週20時間以上などの条件が関係します。今後は制度改正により、金額要件の扱いが変わる予定です。
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">123万円</td>
                    <td className="px-3 py-2">税制改正後の扶養目安</td>
                    <td className="px-3 py-2">
                      扶養控除など税金面の目安として確認される金額です。社会保険の扶養判定とは別に考える必要があります。
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">130万円</td>
                    <td className="px-3 py-2">社会保険の扶養目安</td>
                    <td className="px-3 py-2">
                      交通費や今後の見込み収入を含めて判断されることがあります。
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">150万円</td>
                    <td className="px-3 py-2">配偶者特別控除などの目安</td>
                    <td className="px-3 py-2">
                      配偶者の所得や家族構成によって、実際の控除額は変わります。
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">160万円</td>
                    <td className="px-3 py-2">所得税がかかり始める目安</td>
                    <td className="px-3 py-2">
                      令和7年度税制改正後の目安です。住民税や社会保険の判定とは別に確認してください。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              時給別の勤務時間目安
            </summary>
            <div className="mt-3 space-y-3">
              <p>
                交通費を含めず、週3日働く場合の目安です。実際の勤務シフトや交通費の扱いによって変わります。
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-3 py-2 font-bold">時給</th>
                      <th className="px-3 py-2 font-bold">
                        103万円以内の月時間
                      </th>
                      <th className="px-3 py-2 font-bold">
                        130万円以内の月時間
                      </th>
                      <th className="px-3 py-2 font-bold">
                        130万円以内の1日時間
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exampleResults.map((example) => (
                      <tr key={example.hourlyWage} className="border-b">
                        <td className="px-3 py-2">
                          {example.hourlyWage.toLocaleString()}円
                        </td>
                        <td className="px-3 py-2">
                          約
                          {example.limit103.monthlyWorkingHours.toLocaleString()}
                          時間
                        </td>
                        <td className="px-3 py-2">
                          約
                          {example.limit130.monthlyWorkingHours.toLocaleString()}
                          時間
                        </td>
                        <td className="px-3 py-2">
                          約{example.limit130.hoursPerDay.toLocaleString()}時間
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              交通費は年収上限に含めるべき？
            </summary>
            <div className="mt-3 space-y-2">
              <p>
                税金の計算と社会保険の判定では、交通費の扱いが同じとは限りません。
              </p>
              <p>
                社会保険の扶養判定では、交通費などを含めた収入見込みで見られる場合があります。安全側に見積もりたい場合は、「交通費を年収上限に含める」にチェックを入れて計算してください。
              </p>
            </div>
          </details>

          <details className="rounded-lg border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-gray-900">
              注意事項
            </summary>
            <div className="mt-3 space-y-2">
              <p>この計算結果は目安です。</p>
              <p>
                税金の扶養、社会保険の扶養、本人に税金がかかるラインはそれぞれ別の制度なので、同じ「年収の壁」でも意味が異なります。
              </p>
              <p>
                扶養や社会保険の判定は、年齢、学生かどうか、勤務先の従業員数、週の所定労働時間、月額賃金、交通費の扱い、配偶者・親の扶養かどうかによって変わります。
              </p>
              <p>
                特に106万円・130万円の壁は、収入額だけでなく勤務先や労働条件によって扱いが変わるため、最終判断は勤務先や専門窓口に確認してください。
              </p>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}

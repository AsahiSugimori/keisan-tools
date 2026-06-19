"use client";

import { useEffect, useRef, useState } from "react";
import {
  defaultHourlyWage,
  defaultOvertimeHours,
  defaultTransportationCost,
  defaultWorkingDaysPerMonth,
  defaultWorkingHoursPerDay,
  hourlyWageStorageKey,
  maxHourlyWage,
  maxOvertimeHours,
  maxTransportationCost,
  maxWorkingDaysPerMonth,
  maxWorkingHoursPerDay,
  overtimeHoursStorageKey,
  overtimeRate,
  transportationCostStorageKey,
  workingDaysStorageKey,
  workingHoursStorageKey,
} from "../lib/hourlyToMonthlyConstants";
import NumberInput from "./NumberInput";

/**
 * 基本月収計算処理
 *
 * 「時給」×「1日の労働時間」×「月の勤務日数」で月収を計算する。
 *
 * @param hourlyWage 時給
 * @param workingHoursPerDay 1日の労働時間
 * @param workingDaysPerMonth 月の勤務日数
 * @returns 月収
 */
function calculateMonthlyIncome(
  hourlyWage: number,
  workingHoursPerDay: number,
  workingDaysPerMonth: number,
): number {
  return hourlyWage * workingHoursPerDay * workingDaysPerMonth;
}
/**
 * 残業代計算処理
 *
 * 「時給」×「残業倍率」×「残業時間」で残業代を計算する。
 *
 * @param hourlyWage 時給
 * @param overtimeHours 残業時間
 * @param overtimeRate 残業倍率
 * @returns 残業代
 */
function calculateOvertimePay(
  hourlyWage: number,
  overtimeHours: number,
  overtimeRate: number
): number {
  return hourlyWage * overtimeHours * overtimeRate;
}
/**
 * 月総支給額計算処理
 *
 * 「月収」＋「残業代」＋「交通費」で月の総支給額を計算する。
 *
 * @param monthlyIncome 月収
 * @param overtimePay 残業代
 * @param transportationCost 交通費
 * @returns 月総支給額
 */
function calculateTotalIncome(
  monthlyIncome: number,
  overtimePay: number,
  transportationCost: number
): number {
  return monthlyIncome + overtimePay + transportationCost;
}

export default function HourlyToMonthlyCalculator() {
  /** 時給入力欄参照 */
  const hourlyWageInputRef = useRef<HTMLInputElement>(null);
  /** 1日の労働時間入力欄参照 */
  const workingHoursInputRef = useRef<HTMLInputElement>(null);
  /** 月の勤務日数入力欄参照 */
  const workingDaysInputRef = useRef<HTMLInputElement>(null);
  /** 交通費入力欄参照 */
  const transportationCostInputRef = useRef<HTMLInputElement>(null);
  /** 残業時間入力欄参照 */
  const overtimeHoursInputRef = useRef<HTMLInputElement>(null);

  /** 入力文字列(時給) */
  const [hourlyWageText, setHourlyWageText] = useState(String(defaultHourlyWage));
  /** 入力文字列(1日の労働時間) */
  const [workingHoursText, setWorkingHoursText] = useState(String(defaultWorkingHoursPerDay));
  /** 入力文字列(月の勤務日数) */
  const [workingDaysText, setWorkingDaysText] = useState(String(defaultWorkingDaysPerMonth));
  /** 入力文字列(交通費) */
  const [transportationCostText, setTransportationCostText] = useState(String(defaultTransportationCost));
  /** 入力文字列(残業時間) */
  const [overtimeHoursText, setOvertimeHoursText] = useState(String(defaultOvertimeHours));

  /** 計算用確定値(時給) */
  const [hourlyWage, setHourlyWage] = useState(defaultHourlyWage);
  /** 計算用確定値(1日の労働時間) */
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState(defaultWorkingHoursPerDay);
  /** 計算用確定値(月の勤務日数) */
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(defaultWorkingDaysPerMonth);
  /** 計算用確定値(交通費) */
  const [transportationCost, setTransportationCost] = useState(defaultTransportationCost);
  /** 計算用確定値(残業時間) */
  const [overtimeHours, setOvertimeHours] = useState(defaultOvertimeHours);

  /**
   * 保存済み入力値を読み込む
   */
  useEffect(() => {
    const savedHourlyWage = localStorage.getItem(hourlyWageStorageKey);
    const savedWorkingHours = localStorage.getItem(workingHoursStorageKey);
    const savedWorkingDays = localStorage.getItem(workingDaysStorageKey);
    const savedTransportationCost = localStorage.getItem(transportationCostStorageKey);
    const savedOvertimeHours = localStorage.getItem(overtimeHoursStorageKey);

    if (savedHourlyWage !== null) {
      setHourlyWageText(savedHourlyWage);
      setHourlyWage(Number(savedHourlyWage));
    }

    if (savedWorkingHours !== null) {
      setWorkingHoursText(savedWorkingHours);
      setWorkingHoursPerDay(Number(savedWorkingHours));
    }

    if (savedWorkingDays !== null) {
      setWorkingDaysText(savedWorkingDays);
      setWorkingDaysPerMonth(Number(savedWorkingDays));
    }

    if (savedTransportationCost !== null) {
      setTransportationCostText(savedTransportationCost);
      setTransportationCost(Number(savedTransportationCost));
    }

    if (savedOvertimeHours !== null) {
      setOvertimeHoursText(savedOvertimeHours);
      setOvertimeHours(Number(savedOvertimeHours));
    }
  }, []);

  /**
   * 「時給」の入力文字列を検証し、計算用の「時給」に反映する
   */
  const commitHourlyWage = () => {
    const value = Math.min(
      maxHourlyWage,
      Math.max(0, Number(hourlyWageText) || 0)
    );

    setHourlyWage(value);
    setHourlyWageText(String(value));
    localStorage.setItem(hourlyWageStorageKey, String(value));
  };

  /**
   * 「1日の労働時間」の入力文字列を検証し、計算用の「1日の労働時間」に反映する
   */
  const commitWorkingHours = () => {
    const value = Math.min(
      maxWorkingHoursPerDay,
      Math.max(0, Number(workingHoursText) || 0)
    );

    setWorkingHoursPerDay(value);
    setWorkingHoursText(String(value));
    localStorage.setItem(workingHoursStorageKey, String(value));
  };

  /**
   * 「月の勤務日数」の入力文字列を検証し、計算用の「月の勤務日数」に反映する
   */
  const commitWorkingDays = () => {
    const value = Math.min(
      maxWorkingDaysPerMonth,
      Math.max(0, Number(workingDaysText) || 0)
    );

    setWorkingDaysPerMonth(value);
    setWorkingDaysText(String(value));
    localStorage.setItem(workingDaysStorageKey, String(value));
  };

  /**
   * 「交通費」の入力文字列を検証し、計算用の「交通費」に反映する
   */
  const commitTransportationCost = () => {
    const value = Math.min(
      maxTransportationCost,
      Math.max(0, Number(transportationCostText) || 0)
    );

    setTransportationCost(value);
    setTransportationCostText(String(value));
    localStorage.setItem(transportationCostStorageKey, String(value));
  };

  /**
   * 「残業時間」の入力文字列を検証し、計算用の「残業時間」に反映する
   */
  const commitOvertimeHours = () => {
    const value =
      Math.min(
        maxOvertimeHours,
        Math.max(0, Number(overtimeHoursText) || 0)
      );

    setOvertimeHours(value);
    setOvertimeHoursText(String(value));
    localStorage.setItem(overtimeHoursStorageKey, String(value));
  };

  /**
   * 入力値を初期状態に戻す
   */
  const resetInputs = () => {
    setHourlyWageText(String(defaultHourlyWage));
    setWorkingHoursText(String(defaultWorkingHoursPerDay));
    setWorkingDaysText(String(defaultWorkingDaysPerMonth));
    setTransportationCostText(String(defaultTransportationCost));
    setOvertimeHoursText(String(defaultOvertimeHours));

    setHourlyWage(defaultHourlyWage);
    setWorkingHoursPerDay(defaultWorkingHoursPerDay);
    setWorkingDaysPerMonth(defaultWorkingDaysPerMonth);
    setTransportationCost(defaultTransportationCost);
    setOvertimeHours(defaultOvertimeHours);

    localStorage.removeItem(hourlyWageStorageKey);
    localStorage.removeItem(workingHoursStorageKey);
    localStorage.removeItem(workingDaysStorageKey);
    localStorage.removeItem(transportationCostStorageKey);
    localStorage.removeItem(overtimeHoursStorageKey);
  };

  /** 計算結果(基本月収) */
  const monthlyIncome = calculateMonthlyIncome(hourlyWage, workingHoursPerDay, workingDaysPerMonth,);
  /** 計算結果(残業代) */
  const overtimePay = calculateOvertimePay(hourlyWage, overtimeHours, overtimeRate);
  /** 計算結果(月総支給額) */
  const totalIncome = calculateTotalIncome(monthlyIncome, overtimePay, transportationCost);
  /** 計算結果(想定年収) */
  const yearlyIncome = totalIncome * 12;

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        時給→月給計算機
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        {/* 入力エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">
            入力項目
          </h2>

          {/* 入力項目(時給) */}
          <NumberInput
            label="時給（円）"
            value={hourlyWageText}
            maxValue={maxHourlyWage}
            inputRef={hourlyWageInputRef}
            onChange={setHourlyWageText}
            onCommit={commitHourlyWage}
            onEnter={() => {
              workingHoursInputRef.current?.focus();
            }}
          />

          {/* 入力項目(1日の労働時間) */}
          <NumberInput
            label="1日の労働時間"
            value={workingHoursText}
            maxValue={maxWorkingHoursPerDay}
            inputRef={workingHoursInputRef}
            onChange={setWorkingHoursText}
            onCommit={commitWorkingHours}
            onEnter={() => {
              workingDaysInputRef.current?.focus();
            }}
          />

          {/* 入力項目(月の勤務日数) */}
          <NumberInput
            label="月の勤務日数"
            value={workingDaysText}
            maxValue={maxWorkingDaysPerMonth}
            inputRef={workingDaysInputRef}
            onChange={setWorkingDaysText}
            onCommit={commitWorkingDays}
            onEnter={() => {
              transportationCostInputRef.current?.focus();
            }}
          />

          {/* 入力項目(交通費) */}
          <NumberInput
            label="交通費（円）"
            value={transportationCostText}
            maxValue={maxTransportationCost}
            inputRef={transportationCostInputRef}
            onChange={setTransportationCostText}
            onCommit={commitTransportationCost}
            onEnter={() => {
              overtimeHoursInputRef.current?.focus();
            }}
          />

          {/* 入力項目(残業時間) */}
          <NumberInput
            label="残業時間（月）"
            value={overtimeHoursText}
            maxValue={maxOvertimeHours}
            inputRef={overtimeHoursInputRef}
            onChange={setOvertimeHoursText}
            onCommit={commitOvertimeHours}
            onEnter={() => {
              hourlyWageInputRef.current?.focus();
            }}
          />
        </div>

        {/* 結果エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">
            計算結果
          </h2>

          <div className="space-y-2">

            <div className="flex justify-between">
              <span>基本月収</span>
              <span>{monthlyIncome.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>残業代</span>
              <span>{overtimePay.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>交通費</span>
              <span>{transportationCost.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>月総支給額</span>
              <span>{totalIncome.toLocaleString()}円</span>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">
                想定年収
              </div>

              <div className="mt-2 text-3xl font-bold">
                {yearlyIncome.toLocaleString()}円
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
              時給、1日の労働時間、月の勤務日数、交通費、残業時間を入力すると、
              基本月収・残業代・月総支給額・想定年収を計算できます。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">計算式</h3>
            <p>基本月収 = 時給 × 1日の労働時間 × 月の勤務日数</p>
            <p>残業代 = 時給 × 残業時間 × 1.25</p>
            <p>月総支給額 = 基本月収 + 残業代 + 交通費</p>
            <p>想定年収 = 月総支給額 × 12</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">注意事項</h3>
            <p>この計算結果は概算です。</p>
            <p>社会保険料、所得税、住民税などは考慮していません。</p>
            <p>残業代は時給の1.25倍として計算しています。</p>
          </div>
        </div>
      </section>

    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import NumberInput from "./NumberInput";

/**
 * 年齢区分
 */
type AgeGroup = "under40" | "over40";

/**
 * 概算手取り計算結果
 */
type TakeHomePayResult = {
  healthInsurance: number;
  careInsurance: number;
  welfarePension: number;
  employmentInsurance: number;
  incomeTax: number;
  residentTax: number;
  totalDeduction: number;
  monthlyTakeHomePay: number;
  yearlyGrossSalary: number;
  yearlyTakeHomePay: number;
};

/**
 * 金額を0円以上の整数に丸める
 *
 * @param value 金額
 * @returns 0円以上の整数
 */
function floorMoney(value: number): number {
  return Math.max(0, Math.floor(value));
}

/**
 * 給与所得控除額を計算する
 *
 * 令和7年分以後の最低保障額65万円を反映しつつ、
 * 年収190万円超は従来の速算式を利用する。
 *
 * @param yearlyGrossSalary 額面年収
 * @returns 給与所得控除額
 */
function calculateSalaryIncomeDeduction(yearlyGrossSalary: number): number {
  if (yearlyGrossSalary <= 1625000) {
    return 650000;
  }

  if (yearlyGrossSalary <= 1800000) {
    return yearlyGrossSalary * 0.4 - 100000;
  }

  if (yearlyGrossSalary <= 1900000) {
    return yearlyGrossSalary * 0.3 + 80000;
  }

  if (yearlyGrossSalary <= 3600000) {
    return yearlyGrossSalary * 0.3 + 80000;
  }

  if (yearlyGrossSalary <= 6600000) {
    return yearlyGrossSalary * 0.2 + 440000;
  }

  if (yearlyGrossSalary <= 8500000) {
    return yearlyGrossSalary * 0.1 + 1100000;
  }

  return 1950000;
}

/**
 * 所得税の基礎控除額を計算する
 *
 * 初期版では多くの会社員に当てはまりやすい58万円を利用する。
 * 低所得者向けの上乗せ控除や高所得者の段階的縮小は、今後の精度改善で対応する。
 *
 * @returns 所得税の基礎控除額
 */
function calculateIncomeTaxBasicDeduction(): number {
  return 580000;
}

/**
 * 所得税額を計算する
 *
 * 国税庁の所得税速算表をもとに計算する。
 *
 * @param taxableIncome 課税所得
 * @returns 所得税額
 */
function calculateIncomeTax(taxableIncome: number): number {
  const roundedTaxableIncome = Math.floor(Math.max(0, taxableIncome) / 1000) * 1000;

  if (roundedTaxableIncome <= 0) {
    return 0;
  }

  if (roundedTaxableIncome <= 1949000) {
    return roundedTaxableIncome * 0.05;
  }

  if (roundedTaxableIncome <= 3299000) {
    return roundedTaxableIncome * 0.1 - 97500;
  }

  if (roundedTaxableIncome <= 6949000) {
    return roundedTaxableIncome * 0.2 - 427500;
  }

  if (roundedTaxableIncome <= 8999000) {
    return roundedTaxableIncome * 0.23 - 636000;
  }

  if (roundedTaxableIncome <= 17999000) {
    return roundedTaxableIncome * 0.33 - 1536000;
  }

  if (roundedTaxableIncome <= 39999000) {
    return roundedTaxableIncome * 0.4 - 2796000;
  }

  return roundedTaxableIncome * 0.45 - 4796000;
}

/**
 * 会社員の概算手取りを計算する
 *
 * @param grossMonthlySalary 額面月給
 * @param ageGroup 年齢区分
 * @param includeResidentTax 住民税を引くか
 * @returns 概算手取り計算結果
 */
function calculateEmployeeTakeHomePay(
  grossMonthlySalary: number,
  ageGroup: AgeGroup,
  includeResidentTax: boolean
): TakeHomePayResult {
  /** 健康保険料率(協会けんぽ東京の本人負担概算) */
  const healthInsuranceRate = 0.04955;
  /** 介護保険料率(40歳以上の本人負担概算) */
  const careInsuranceRate = 0.00795;
  /** 厚生年金保険料率(本人負担) */
  const welfarePensionRate = 0.0915;
  /** 雇用保険料率(一般の事業・労働者負担) */
  const employmentInsuranceRate = 0.0055;

  /** 計算結果(健康保険料) */
  const healthInsurance = floorMoney(grossMonthlySalary * healthInsuranceRate);
  /** 計算結果(介護保険料) */
  const careInsurance =
    ageGroup === "over40" ? floorMoney(grossMonthlySalary * careInsuranceRate) : 0;
  /** 計算結果(厚生年金保険料) */
  const welfarePension = floorMoney(grossMonthlySalary * welfarePensionRate);
  /** 計算結果(雇用保険料) */
  const employmentInsurance = floorMoney(grossMonthlySalary * employmentInsuranceRate);
  /** 計算結果(額面年収) */
  const yearlyGrossSalary = grossMonthlySalary * 12;
  /** 計算結果(年間社会保険料) */
  const yearlySocialInsurance =
    (healthInsurance + careInsurance + welfarePension + employmentInsurance) * 12;
  /** 計算結果(給与所得控除) */
  const salaryIncomeDeduction = calculateSalaryIncomeDeduction(yearlyGrossSalary);
  /** 計算結果(給与所得) */
  const salaryIncome = Math.max(0, yearlyGrossSalary - salaryIncomeDeduction);
  /** 計算結果(所得税の基礎控除) */
  const incomeTaxBasicDeduction = calculateIncomeTaxBasicDeduction();
  /** 計算結果(所得税の課税所得) */
  const incomeTaxTaxableIncome = Math.max(
    0,
    salaryIncome - yearlySocialInsurance - incomeTaxBasicDeduction
  );
  /** 計算結果(年間所得税) */
  const yearlyIncomeTax = calculateIncomeTax(incomeTaxTaxableIncome);
  /** 計算結果(復興特別所得税を含む年間所得税) */
  const yearlyIncomeTaxWithSpecialTax = floorMoney(yearlyIncomeTax * 1.021);
  /** 計算結果(月間所得税) */
  const incomeTax = floorMoney(yearlyIncomeTaxWithSpecialTax / 12);
  /** 計算結果(住民税の基礎控除) */
  const residentTaxBasicDeduction = 430000;
  /** 計算結果(住民税の課税所得) */
  const residentTaxTaxableIncome = Math.max(
    0,
    salaryIncome - yearlySocialInsurance - residentTaxBasicDeduction
  );
  /** 計算結果(年間住民税所得割) */
  const yearlyResidentTaxIncomeBased = floorMoney(residentTaxTaxableIncome * 0.1);
  /** 計算結果(年間住民税均等割・森林環境税の概算) */
  const yearlyResidentTaxFlat = 5000;
  /** 計算結果(月間住民税) */
  const residentTax = includeResidentTax
    ? floorMoney((yearlyResidentTaxIncomeBased + yearlyResidentTaxFlat) / 12)
    : 0;
  /** 計算結果(月間控除合計) */
  const totalDeduction =
    healthInsurance +
    careInsurance +
    welfarePension +
    employmentInsurance +
    incomeTax +
    residentTax;
  /** 計算結果(月間手取り) */
  const monthlyTakeHomePay = floorMoney(grossMonthlySalary - totalDeduction);
  /** 計算結果(年間手取り) */
  const yearlyTakeHomePay = monthlyTakeHomePay * 12;

  return {
    healthInsurance,
    careInsurance,
    welfarePension,
    employmentInsurance,
    incomeTax,
    residentTax,
    totalDeduction,
    monthlyTakeHomePay,
    yearlyGrossSalary,
    yearlyTakeHomePay,
  };
}

export default function TakeHomePayCalculator() {
  /** 額面月給入力欄参照 */
  const grossMonthlySalaryInputRef = useRef<HTMLInputElement>(null);
  /** 入力文字列(額面月給) */
  const [grossMonthlySalaryText, setGrossMonthlySalaryText] = useState("300000");
  /** 計算用確定値(額面月給) */
  const [grossMonthlySalary, setGrossMonthlySalary] = useState(300000);
  /** 計算用確定値(年齢区分) */
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("under40");
  /** 計算用確定値(住民税を引くか) */
  const [includeResidentTax, setIncludeResidentTax] = useState(true);

  /**
   * 保存済み入力値を読み込む
   */
  useEffect(() => {
    const savedGrossMonthlySalary = localStorage.getItem("takeHomeGrossMonthlySalary");
    const savedAgeGroup = localStorage.getItem("takeHomeAgeGroup");
    const savedIncludeResidentTax = localStorage.getItem("takeHomeIncludeResidentTax");

    if (savedGrossMonthlySalary !== null) {
      setGrossMonthlySalaryText(savedGrossMonthlySalary);
      setGrossMonthlySalary(Number(savedGrossMonthlySalary));
    }

    if (savedAgeGroup === "under40" || savedAgeGroup === "over40") {
      setAgeGroup(savedAgeGroup);
    }

    if (savedIncludeResidentTax !== null) {
      setIncludeResidentTax(savedIncludeResidentTax === "true");
    }
  }, []);

  /**
   * 「額面月給」の入力文字列を検証し、計算用の「額面月給」に反映する
   */
  const commitGrossMonthlySalary = () => {
    const value = Math.min(
      10000000,
      Math.max(0, Number(grossMonthlySalaryText) || 0)
    );

    setGrossMonthlySalary(value);
    setGrossMonthlySalaryText(String(value));
    localStorage.setItem("takeHomeGrossMonthlySalary", String(value));
  };

  /**
   * 「年齢区分」を変更する
   *
   * @param value 年齢区分
   */
  const changeAgeGroup = (value: AgeGroup) => {
    setAgeGroup(value);
    localStorage.setItem("takeHomeAgeGroup", value);
  };

  /**
   * 「住民税を引くか」を変更する
   *
   * @param value 住民税を引くか
   */
  const changeIncludeResidentTax = (value: boolean) => {
    setIncludeResidentTax(value);
    localStorage.setItem("takeHomeIncludeResidentTax", String(value));
  };

  /**
   * 入力値を初期状態に戻す
   */
  const resetInputs = () => {
    setGrossMonthlySalaryText("300000");
    setGrossMonthlySalary(300000);
    setAgeGroup("under40");
    setIncludeResidentTax(true);

    localStorage.removeItem("takeHomeGrossMonthlySalary");
    localStorage.removeItem("takeHomeAgeGroup");
    localStorage.removeItem("takeHomeIncludeResidentTax");
  };

  /** 計算結果 */
  const result = calculateEmployeeTakeHomePay(
    grossMonthlySalary,
    ageGroup,
    includeResidentTax
  );

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        額面→手取り計算機
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 入力エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">
            入力項目
          </h2>

          {/* 入力項目(額面月給) */}
          <NumberInput
            label="額面月給（円）"
            value={grossMonthlySalaryText}
            maxValue={10000000}
            inputRef={grossMonthlySalaryInputRef}
            onChange={setGrossMonthlySalaryText}
            onCommit={commitGrossMonthlySalary}
            onEnter={() => {
              grossMonthlySalaryInputRef.current?.blur();
            }}
          />

          {/* 入力項目(年齢区分) */}
          <div className="mt-4">
            <label className="mb-1 block font-bold">
              年齢区分
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={ageGroup}
              onChange={(event) => {
                changeAgeGroup(event.target.value as AgeGroup);
              }}
            >
              <option value="under40">40歳未満</option>
              <option value="over40">40歳以上</option>
            </select>
          </div>

          {/* 入力項目(住民税) */}
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeResidentTax}
              onChange={(event) => {
                changeIncludeResidentTax(event.target.checked);
              }}
            />
            住民税を差し引く
          </label>

          <p className="mt-2 text-xs leading-6 text-gray-500">
            新卒1年目など、住民税がまだ給与から引かれていない場合はチェックを外してください。
          </p>
        </div>

        {/* 結果エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">
            計算結果
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>額面月給</span>
              <span>{grossMonthlySalary.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>健康保険</span>
              <span>-{result.healthInsurance.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>介護保険</span>
              <span>-{result.careInsurance.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>厚生年金</span>
              <span>-{result.welfarePension.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>雇用保険</span>
              <span>-{result.employmentInsurance.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>所得税</span>
              <span>-{result.incomeTax.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>住民税</span>
              <span>-{result.residentTax.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold">
              <span>控除合計</span>
              <span>-{result.totalDeduction.toLocaleString()}円</span>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">
                概算手取り
              </div>

              <div className="mt-2 text-3xl font-bold">
                {result.monthlyTakeHomePay.toLocaleString()}円
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <span>額面年収</span>
              <span>{result.yearlyGrossSalary.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>概算年間手取り</span>
              <span>{result.yearlyTakeHomePay.toLocaleString()}円</span>
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
              会社員の月給（額面）から、社会保険料・所得税・住民税を差し引いた概算手取り額を計算できます。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">計算に含めているもの</h3>
            <p>健康保険、介護保険、厚生年金、雇用保険、所得税、住民税を概算で計算しています。</p>
            <p>健康保険料は協会けんぽ東京の料率を参考にした概算です。</p>
            <p>厚生年金は本人負担9.15%、雇用保険は一般の事業の労働者負担0.55%として計算しています。</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">注意事項</h3>
            <p>この計算結果は概算です。</p>
            <p>実際の手取り額は、勤務先、加入している健康保険、都道府県、扶養人数、賞与、各種控除などによって異なります。</p>
            <p>住民税は前年の所得をもとに計算されるため、新卒1年目などは給与から引かれていない場合があります。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
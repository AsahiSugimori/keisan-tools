"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type AgeGroup,
  type HealthInsuranceType,
  type Prefecture,
  defaultAgeGroup,
  defaultCustomCareInsuranceRatePercent,
  defaultCustomHealthInsuranceRatePercent,
  defaultHealthInsuranceType,
  defaultPrefecture,
  employmentInsuranceEmployeeRate,
  healthInsuranceTypeLabels,
  itsKenpoEmployeeCareInsuranceRate,
  itsKenpoEmployeeHealthInsuranceRate,
  kyoukaiKenpoCareInsuranceRate,
  kyoukaiKenpoHealthInsuranceRates,
  maxCustomCareInsuranceRatePercent,
  maxCustomHealthInsuranceRatePercent,
  percentRateDivisor,
  prefectureLabels,
  welfarePensionEmployeeRate,
} from "../lib/takeHomePayConstants";
import {
  bonusAgeGroupStorageKey,
  bonusCustomCareInsuranceRateStorageKey,
  bonusCustomHealthInsuranceRateStorageKey,
  bonusHealthInsuranceTypeStorageKey,
  bonusPrefectureStorageKey,
  bonusWithholdingTaxRateRows,
  defaultDependentCount,
  defaultGrossBonus,
  defaultPreviousMonthlySalaryAfterSocialInsurance,
  dependentCountStorageKey,
  grossBonusStorageKey,
  healthInsuranceStandardBonusLimit,
  maxDependentCount,
  maxGrossBonus,
  maxPreviousMonthlySalaryAfterSocialInsurance,
  minBonusMoneyValue,
  previousMonthlySalaryAfterSocialInsuranceStorageKey,
  standardBonusRoundingUnit,
  welfarePensionStandardBonusLimit,
} from "../lib/bonusTakeHomePayConstants";
import NumberInput from "./NumberInput";

type BonusTakeHomePayResult = {
  standardBonus: number;
  healthInsurance: number;
  careInsurance: number;
  welfarePension: number;
  employmentInsurance: number;
  withholdingTaxRate: number;
  incomeTax: number;
  totalDeduction: number;
  bonusTakeHomePay: number;
};

function floorMoney(value: number): number {
  return Math.max(minBonusMoneyValue, Math.floor(value));
}

function parsePercentRate(valueText: string): number {
  return Math.max(minBonusMoneyValue, Number(valueText) || minBonusMoneyValue) / percentRateDivisor;
}

function getEmployeeHealthInsuranceRate(
  healthInsuranceType: HealthInsuranceType,
  prefecture: Prefecture,
  customHealthInsuranceEmployeeRate: number,
): number {
  if (healthInsuranceType === "kyoukaikenpo") return kyoukaiKenpoHealthInsuranceRates[prefecture] / 2;
  if (healthInsuranceType === "itsKenpo") return itsKenpoEmployeeHealthInsuranceRate;
  return customHealthInsuranceEmployeeRate;
}

function getEmployeeCareInsuranceRate(
  healthInsuranceType: HealthInsuranceType,
  customCareInsuranceEmployeeRate: number,
): number {
  if (healthInsuranceType === "kyoukaikenpo") return kyoukaiKenpoCareInsuranceRate / 2;
  if (healthInsuranceType === "itsKenpo") return itsKenpoEmployeeCareInsuranceRate;
  return customCareInsuranceEmployeeRate;
}

function getBonusWithholdingTaxRate(
  previousMonthlySalaryAfterSocialInsurance: number,
  dependentCount: number,
): number {
  const normalizedDependentCount = Math.min(maxDependentCount, Math.max(0, dependentCount));

  const row = bonusWithholdingTaxRateRows.find((rateRow) => {
    const range = rateRow.ranges[normalizedDependentCount];
    return (
      previousMonthlySalaryAfterSocialInsurance >= range.min &&
      (range.max === null || previousMonthlySalaryAfterSocialInsurance < range.max)
    );
  });

  return row?.rate ?? 0;
}

function calculateBonusTakeHomePay(
  grossBonus: number,
  previousMonthlySalaryAfterSocialInsurance: number,
  dependentCount: number,
  prefecture: Prefecture,
  healthInsuranceType: HealthInsuranceType,
  customHealthInsuranceEmployeeRate: number,
  customCareInsuranceEmployeeRate: number,
  ageGroup: AgeGroup,
): BonusTakeHomePayResult {
  const healthInsuranceRate = getEmployeeHealthInsuranceRate(
    healthInsuranceType,
    prefecture,
    customHealthInsuranceEmployeeRate,
  );
  const careInsuranceRate = getEmployeeCareInsuranceRate(
    healthInsuranceType,
    customCareInsuranceEmployeeRate,
  );
  const standardBonus = floorMoney(grossBonus / standardBonusRoundingUnit) * standardBonusRoundingUnit;
  const healthInsuranceStandardBonus = Math.min(standardBonus, healthInsuranceStandardBonusLimit);
  const welfarePensionStandardBonus = Math.min(standardBonus, welfarePensionStandardBonusLimit);
  const healthInsurance = floorMoney(healthInsuranceStandardBonus * healthInsuranceRate);
  const careInsurance =
    ageGroup === "over40" ? floorMoney(healthInsuranceStandardBonus * careInsuranceRate) : 0;
  const welfarePension = floorMoney(welfarePensionStandardBonus * welfarePensionEmployeeRate);
  const employmentInsurance = floorMoney(grossBonus * employmentInsuranceEmployeeRate);
  const withholdingTaxRate = getBonusWithholdingTaxRate(
    previousMonthlySalaryAfterSocialInsurance,
    dependentCount,
  );
  const bonusAfterSocialInsurance = Math.max(
    minBonusMoneyValue,
    grossBonus - healthInsurance - careInsurance - welfarePension - employmentInsurance,
  );
  const incomeTax = floorMoney(bonusAfterSocialInsurance * withholdingTaxRate);
  const totalDeduction = healthInsurance + careInsurance + welfarePension + employmentInsurance + incomeTax;
  const bonusTakeHomePay = floorMoney(grossBonus - totalDeduction);

  return {
    standardBonus,
    healthInsurance,
    careInsurance,
    welfarePension,
    employmentInsurance,
    withholdingTaxRate,
    incomeTax,
    totalDeduction,
    bonusTakeHomePay,
  };
}

export default function BonusTakeHomePayCalculator() {
  const grossBonusInputRef = useRef<HTMLInputElement>(null);
  const previousMonthlySalaryInputRef = useRef<HTMLInputElement>(null);
  const dependentCountInputRef = useRef<HTMLInputElement>(null);
  const [grossBonusText, setGrossBonusText] = useState(String(defaultGrossBonus));
  const [previousMonthlySalaryText, setPreviousMonthlySalaryText] = useState(
    String(defaultPreviousMonthlySalaryAfterSocialInsurance),
  );
  const [dependentCountText, setDependentCountText] = useState(String(defaultDependentCount));
  const [customHealthInsuranceRateText, setCustomHealthInsuranceRateText] = useState(
    String(defaultCustomHealthInsuranceRatePercent),
  );
  const [customCareInsuranceRateText, setCustomCareInsuranceRateText] = useState(
    String(defaultCustomCareInsuranceRatePercent),
  );
  const [grossBonus, setGrossBonus] = useState(defaultGrossBonus);
  const [previousMonthlySalaryAfterSocialInsurance, setPreviousMonthlySalaryAfterSocialInsurance] =
    useState(defaultPreviousMonthlySalaryAfterSocialInsurance);
  const [dependentCount, setDependentCount] = useState(defaultDependentCount);
  const [customHealthInsuranceRate, setCustomHealthInsuranceRate] = useState(
    defaultCustomHealthInsuranceRatePercent / percentRateDivisor,
  );
  const [customCareInsuranceRate, setCustomCareInsuranceRate] = useState(
    defaultCustomCareInsuranceRatePercent / percentRateDivisor,
  );
  const [prefecture, setPrefecture] = useState<Prefecture>(defaultPrefecture);
  const [healthInsuranceType, setHealthInsuranceType] =
    useState<HealthInsuranceType>(defaultHealthInsuranceType);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(defaultAgeGroup);

  useEffect(() => {
    const savedGrossBonus = localStorage.getItem(grossBonusStorageKey);
    const savedPreviousMonthlySalary = localStorage.getItem(
      previousMonthlySalaryAfterSocialInsuranceStorageKey,
    );
    const savedDependentCount = localStorage.getItem(dependentCountStorageKey);
    const savedPrefecture = localStorage.getItem(bonusPrefectureStorageKey);
    const savedHealthInsuranceType = localStorage.getItem(bonusHealthInsuranceTypeStorageKey);
    const savedAgeGroup = localStorage.getItem(bonusAgeGroupStorageKey);
    const savedCustomHealthInsuranceRate = localStorage.getItem(
      bonusCustomHealthInsuranceRateStorageKey,
    );
    const savedCustomCareInsuranceRate = localStorage.getItem(
      bonusCustomCareInsuranceRateStorageKey,
    );

    if (savedGrossBonus !== null) {
      setGrossBonusText(savedGrossBonus);
      setGrossBonus(Number(savedGrossBonus));
    }
    if (savedPreviousMonthlySalary !== null) {
      setPreviousMonthlySalaryText(savedPreviousMonthlySalary);
      setPreviousMonthlySalaryAfterSocialInsurance(Number(savedPreviousMonthlySalary));
    }
    if (savedDependentCount !== null) {
      setDependentCountText(savedDependentCount);
      setDependentCount(Number(savedDependentCount));
    }
    if (
      savedPrefecture === "ibaraki" ||
      savedPrefecture === "tochigi" ||
      savedPrefecture === "gunma" ||
      savedPrefecture === "saitama" ||
      savedPrefecture === "chiba" ||
      savedPrefecture === "tokyo" ||
      savedPrefecture === "kanagawa"
    ) {
      setPrefecture(savedPrefecture);
    }
    if (
      savedHealthInsuranceType === "kyoukaikenpo" ||
      savedHealthInsuranceType === "itsKenpo" ||
      savedHealthInsuranceType === "custom"
    ) {
      setHealthInsuranceType(savedHealthInsuranceType);
    }
    if (savedAgeGroup === "under40" || savedAgeGroup === "over40") {
      setAgeGroup(savedAgeGroup);
    }
    if (savedCustomHealthInsuranceRate !== null) {
      setCustomHealthInsuranceRateText(savedCustomHealthInsuranceRate);
      setCustomHealthInsuranceRate(parsePercentRate(savedCustomHealthInsuranceRate));
    }
    if (savedCustomCareInsuranceRate !== null) {
      setCustomCareInsuranceRateText(savedCustomCareInsuranceRate);
      setCustomCareInsuranceRate(parsePercentRate(savedCustomCareInsuranceRate));
    }
  }, []);

  const commitGrossBonus = () => {
    const value = Math.min(maxGrossBonus, Math.max(minBonusMoneyValue, Number(grossBonusText) || 0));
    setGrossBonus(value);
    setGrossBonusText(String(value));
    localStorage.setItem(grossBonusStorageKey, String(value));
  };

  const commitPreviousMonthlySalary = () => {
    const value = Math.min(
      maxPreviousMonthlySalaryAfterSocialInsurance,
      Math.max(minBonusMoneyValue, Number(previousMonthlySalaryText) || 0),
    );
    setPreviousMonthlySalaryAfterSocialInsurance(value);
    setPreviousMonthlySalaryText(String(value));
    localStorage.setItem(previousMonthlySalaryAfterSocialInsuranceStorageKey, String(value));
  };

  const commitDependentCount = () => {
    const value = Math.min(maxDependentCount, Math.max(0, Math.floor(Number(dependentCountText) || 0)));
    setDependentCount(value);
    setDependentCountText(String(value));
    localStorage.setItem(dependentCountStorageKey, String(value));
  };

  const commitCustomHealthInsuranceRate = () => {
    const value = Math.min(
      maxCustomHealthInsuranceRatePercent,
      Math.max(minBonusMoneyValue, Number(customHealthInsuranceRateText) || 0),
    );
    setCustomHealthInsuranceRateText(String(value));
    setCustomHealthInsuranceRate(value / percentRateDivisor);
    localStorage.setItem(bonusCustomHealthInsuranceRateStorageKey, String(value));
  };

  const commitCustomCareInsuranceRate = () => {
    const value = Math.min(
      maxCustomCareInsuranceRatePercent,
      Math.max(minBonusMoneyValue, Number(customCareInsuranceRateText) || 0),
    );
    setCustomCareInsuranceRateText(String(value));
    setCustomCareInsuranceRate(value / percentRateDivisor);
    localStorage.setItem(bonusCustomCareInsuranceRateStorageKey, String(value));
  };

  const changePrefecture = (value: Prefecture) => {
    setPrefecture(value);
    localStorage.setItem(bonusPrefectureStorageKey, value);
  };

  const changeHealthInsuranceType = (value: HealthInsuranceType) => {
    setHealthInsuranceType(value);
    localStorage.setItem(bonusHealthInsuranceTypeStorageKey, value);
  };

  const changeAgeGroup = (value: AgeGroup) => {
    setAgeGroup(value);
    localStorage.setItem(bonusAgeGroupStorageKey, value);
  };

  const resetInputs = () => {
    setGrossBonusText(String(defaultGrossBonus));
    setPreviousMonthlySalaryText(String(defaultPreviousMonthlySalaryAfterSocialInsurance));
    setDependentCountText(String(defaultDependentCount));
    setCustomHealthInsuranceRateText(String(defaultCustomHealthInsuranceRatePercent));
    setCustomCareInsuranceRateText(String(defaultCustomCareInsuranceRatePercent));
    setGrossBonus(defaultGrossBonus);
    setPreviousMonthlySalaryAfterSocialInsurance(defaultPreviousMonthlySalaryAfterSocialInsurance);
    setDependentCount(defaultDependentCount);
    setCustomHealthInsuranceRate(defaultCustomHealthInsuranceRatePercent / percentRateDivisor);
    setCustomCareInsuranceRate(defaultCustomCareInsuranceRatePercent / percentRateDivisor);
    setPrefecture(defaultPrefecture);
    setHealthInsuranceType(defaultHealthInsuranceType);
    setAgeGroup(defaultAgeGroup);

    localStorage.removeItem(grossBonusStorageKey);
    localStorage.removeItem(previousMonthlySalaryAfterSocialInsuranceStorageKey);
    localStorage.removeItem(dependentCountStorageKey);
    localStorage.removeItem(bonusPrefectureStorageKey);
    localStorage.removeItem(bonusHealthInsuranceTypeStorageKey);
    localStorage.removeItem(bonusAgeGroupStorageKey);
    localStorage.removeItem(bonusCustomHealthInsuranceRateStorageKey);
    localStorage.removeItem(bonusCustomCareInsuranceRateStorageKey);
  };

  const employeeHealthInsuranceRate = getEmployeeHealthInsuranceRate(
    healthInsuranceType,
    prefecture,
    customHealthInsuranceRate,
  );
  const employeeCareInsuranceRate = getEmployeeCareInsuranceRate(
    healthInsuranceType,
    customCareInsuranceRate,
  );
  const result = calculateBonusTakeHomePay(
    grossBonus,
    previousMonthlySalaryAfterSocialInsurance,
    dependentCount,
    prefecture,
    healthInsuranceType,
    customHealthInsuranceRate,
    customCareInsuranceRate,
    ageGroup,
  );

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">賞与→手取り計算機</h1>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-gray-700">
        <p className="font-bold text-blue-800">賞与額面から、社会保険料・所得税を差し引いた手取り額を概算します。</p>
        <p>
          毎月の給与の手取りを確認したい場合は{" "}
          <Link href="/take-home-pay" className="font-bold text-blue-700 underline">
            額面→手取り計算機
          </Link>
          を使ってください。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">入力項目</h2>

          <NumberInput
            label="賞与額面（円）"
            value={grossBonusText}
            maxValue={maxGrossBonus}
            inputRef={grossBonusInputRef}
            onChange={setGrossBonusText}
            onCommit={commitGrossBonus}
            onEnter={() => {
              previousMonthlySalaryInputRef.current?.focus();
            }}
          />

          <NumberInput
            label="前月給与（社保控除後・円）"
            value={previousMonthlySalaryText}
            maxValue={maxPreviousMonthlySalaryAfterSocialInsurance}
            inputRef={previousMonthlySalaryInputRef}
            onChange={setPreviousMonthlySalaryText}
            onCommit={commitPreviousMonthlySalary}
            onEnter={() => {
              dependentCountInputRef.current?.focus();
            }}
          />

          <p className="mt-1 text-xs leading-6 text-gray-500">
            給与明細の「課税対象額」や、前月給与から社会保険料等を引いた金額を入力してください。
          </p>

          <NumberInput
            label="扶養親族等の数"
            value={dependentCountText}
            maxValue={maxDependentCount}
            inputRef={dependentCountInputRef}
            onChange={setDependentCountText}
            onCommit={commitDependentCount}
            onEnter={() => {
              dependentCountInputRef.current?.blur();
            }}
          />

          <div className="mt-4">
            <label className="mb-1 block font-bold">健康保険の種類</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={healthInsuranceType}
              onChange={(event) => {
                changeHealthInsuranceType(event.target.value as HealthInsuranceType);
              }}
            >
              <option value="kyoukaikenpo">協会けんぽ</option>
              <option value="itsKenpo">関東ITソフトウェア健康保険組合</option>
              <option value="custom">その他の健康保険組合</option>
            </select>
          </div>

          {healthInsuranceType === "kyoukaikenpo" && (
            <div className="mt-4">
              <label className="mb-1 block font-bold">都道府県</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={prefecture}
                onChange={(event) => {
                  changePrefecture(event.target.value as Prefecture);
                }}
              >
                <option value="ibaraki">茨城県</option>
                <option value="tochigi">栃木県</option>
                <option value="gunma">群馬県</option>
                <option value="saitama">埼玉県</option>
                <option value="chiba">千葉県</option>
                <option value="tokyo">東京都</option>
                <option value="kanagawa">神奈川県</option>
              </select>
            </div>
          )}

          {healthInsuranceType === "custom" && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block font-bold">健康保険 本人負担率（%）</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  inputMode="decimal"
                  value={customHealthInsuranceRateText}
                  onBlur={commitCustomHealthInsuranceRate}
                  onChange={(event) => {
                    setCustomHealthInsuranceRateText(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      commitCustomHealthInsuranceRate();
                      event.currentTarget.blur();
                    }
                  }}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">介護保険 本人負担率（%）</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  inputMode="decimal"
                  value={customCareInsuranceRateText}
                  onBlur={commitCustomCareInsuranceRate}
                  onChange={(event) => {
                    setCustomCareInsuranceRateText(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      commitCustomCareInsuranceRate();
                      event.currentTarget.blur();
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="mb-1 block font-bold">年齢区分</label>
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
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">計算結果</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>賞与額面</span>
              <span>{grossBonus.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>標準賞与額</span>
              <span>{result.standardBonus.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>健康保険</span>
              <span>{healthInsuranceTypeLabels[healthInsuranceType]}</span>
            </div>

            {healthInsuranceType === "kyoukaikenpo" && (
              <div className="flex justify-between">
                <span>都道府県</span>
                <span>{prefectureLabels[prefecture]}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-500">
              <span>健康保険本人負担率</span>
              <span>{(employeeHealthInsuranceRate * percentRateDivisor).toFixed(3)}%</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>介護保険本人負担率</span>
              <span>{(employeeCareInsuranceRate * percentRateDivisor).toFixed(3)}%</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>所得税率</span>
              <span>{(result.withholdingTaxRate * percentRateDivisor).toFixed(3)}%</span>
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

            <hr />

            <div className="flex justify-between font-bold">
              <span>控除合計</span>
              <span>-{result.totalDeduction.toLocaleString()}円</span>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">賞与の概算手取り</div>
              <div className="mt-2 text-3xl font-bold">
                {result.bonusTakeHomePay.toLocaleString()}円
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

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">この計算機について</h2>

        <div className="space-y-4 text-sm leading-7 text-gray-700">
          <div>
            <h3 className="font-bold text-gray-900">計算できる内容</h3>
            <p>
              賞与額面から、健康保険・介護保険・厚生年金・雇用保険・所得税を差し引いた概算手取り額を計算できます。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">計算に含めているもの</h3>
            <p>
              社会保険料は、賞与額面から1,000円未満を切り捨てた標準賞与額をもとに概算します。
            </p>
            <p>
              所得税は、前月給与の社会保険料等控除後の金額と扶養親族等の数から、賞与に対する源泉徴収税率を求めて概算します。
            </p>
            <p>住民税は通常の賞与計算では差し引かないため、この計算には含めていません。</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">注意事項</h3>
            <p>この計算結果は目安です。</p>
            <p>
              前月給与がない場合、賞与が前月給与の10倍を超える場合、退職月、同月に複数回賞与がある場合などは扱いが変わることがあります。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

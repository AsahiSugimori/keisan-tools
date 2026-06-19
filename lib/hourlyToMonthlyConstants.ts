/**
 * 時給→月給計算機の初期値・上限値・固定値
 */

/** 初期値(時給) */
export const defaultHourlyWage = 1200;

/** 初期値(1日の労働時間) */
export const defaultWorkingHoursPerDay = 8;

/** 初期値(月の勤務日数) */
export const defaultWorkingDaysPerMonth = 20;

/** 初期値(交通費) */
export const defaultTransportationCost = 0;

/** 初期値(残業時間) */
export const defaultOvertimeHours = 0;

/** 上限値(時給) */
export const maxHourlyWage = 100000;

/** 上限値(1日の労働時間) */
export const maxWorkingHoursPerDay = 24;

/** 上限値(月の勤務日数) */
export const maxWorkingDaysPerMonth = 31;

/** 上限値(交通費) */
export const maxTransportationCost = 100000;

/** 上限値(残業時間) */
export const maxOvertimeHours = 300;

/** 残業倍率 */
export const overtimeRate = 1.25;

/** localStorageキー(時給) */
export const hourlyWageStorageKey = "hourlyWage";

/** localStorageキー(1日の労働時間) */
export const workingHoursStorageKey = "workingHours";

/** localStorageキー(月の勤務日数) */
export const workingDaysStorageKey = "workingDays";

/** localStorageキー(交通費) */
export const transportationCostStorageKey = "transportationCost";

/** localStorageキー(残業時間) */
export const overtimeHoursStorageKey = "overtimeHours";
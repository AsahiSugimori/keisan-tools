"use client";

import { minNumberInputValue } from "../lib/commonInputConstants";

type NumberInputProps = {
  /** ラベル名称 */
  label: string;
  /** 入力欄に表示する値 */
  value: string;
  /** 入力可能な最大値 */
  maxValue: number;
  /** 入力欄 */
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** 値変更時 */
  onChange: (value: string) => void;
  /** 入力確定時(Enter押下またはフォーカスアウト) */
  onCommit: () => void;
  /** Enter押下時 */
  onEnter?: () => void;
};

/**
 * 数値入力コンポーネント
 *
 * 共通の数値入力欄を提供する。
 * Enter押下またはフォーカスアウト時に入力確定処理を実行する。
 */
export default function NumberInput({
  label,
  value,
  maxValue,
  inputRef,
  onChange,
  onCommit,
  onEnter,
}: NumberInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block font-bold text-gray-700">
        {label}
      </label>
      <input
        ref={inputRef}
        type="number"
        value={value}
        min={minNumberInputValue}
        max={maxValue}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        onFocus={(event) => {
          event.target.select();
        }}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onBlur={() => {
          onCommit();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onCommit();
            onEnter?.();
          }
        }}
      />
    </div>
  );
}
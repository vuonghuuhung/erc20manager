import { InputHTMLAttributes, forwardRef, useMemo } from "react";
export interface InputNumberProps
  extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string;
  localValue?: string;
  setLocalValue?: React.Dispatch<React.SetStateAction<string>>;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumberInner(
    {
      className,
      classNameInput = "block w-full p-3 h-[45px] text-white rounded-[8px] bg-[#161b26] text-[14px] font-medium border border-[#d0d5dd] outline-none",
      onChange,
      localValue = "",
      setLocalValue,
      value = "",
      ...rest
    },
    ref
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: any) => {
      const value = event.target.value.replace(/,/g, "");
      if (/^\d*\.?\d*$/.test(value) || value === "") {
        if (value.includes(".")) {
          onChange?.(value);
          setLocalValue?.(value);
        } else {
          onChange?.(value);
          setLocalValue?.(value);
          
        }
      }
    };

    const calculatedValue = useMemo(() => {
      const _value = typeof value === "undefined" ? localValue : String(value);
      if (_value === "") {
        return _value;
      }
      if (_value.includes(".")) {
        const [integer, decimal] = _value.split(".");
        if (integer === "") {
          return `.${decimal}`;
        }
        return `${Number(integer).toLocaleString("en-US")}.${decimal}`;

      }
      return Number(_value).toLocaleString("en-US");

    }, [localValue, value]);

    return (
      <div className={className}>
        <div className="relative">
          <input
            type="text"
            className={classNameInput}
            {...rest}
            value={calculatedValue}
            onChange={handleChange}
            ref={ref}
          />
        </div>
      </div>
    );
  }
);

export default InputNumber;

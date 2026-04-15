import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import * as s from './index.css';

export type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> & {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File | File[] | null) => void;
};

export function FileInput({
  accept,
  multiple = false,
  onChange,
  className,
  ...props
}: FileInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) {
      onChange?.(null);
      return;
    }
    if (multiple) {
      onChange?.(Array.from(files));
    } else {
      onChange?.(files[0]);
    }
  };

  return (
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={handleChange}
      className={clsx(s.input, className)}
      {...props}
    />
  );
}

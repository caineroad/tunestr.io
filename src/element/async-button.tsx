import "./async-button.css";
import { useState } from "react";
import Spinner from "./spinner";
import classNames from "classnames";

interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => Promise<void> | void;
  children?: React.ReactNode;
}

export default function AsyncButton(props: AsyncButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);

  async function handle(e: React.MouseEvent) {
    e.stopPropagation();
    if (loading || props.disabled) return;
    setLoading(true);
    try {
      if (typeof props.onClick === "function") {
        const f = props.onClick(e);
        if (f instanceof Promise) {
          await f;
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      disabled={loading || props.disabled}
      {...props}
      onClick={handle}
      className={classNames("px-3 py-2 bg-gray-2 rounded-full", props.className)}>
      <span style={{ visibility: loading ? "hidden" : "visible" }}>{props.children}</span>
      {loading && (
        <span className="spinner-wrapper">
          <Spinner />
        </span>
      )}
    </button>
  );
}

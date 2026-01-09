import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    href,
    onClick,
    disabled = false,
    fullWidth = false,
    icon,
    iconPosition = "left",
    className = "",
    type = "button",
}: ButtonProps) {
    const buttonClasses = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${fullWidth ? styles.fullWidth : ""}
    ${disabled ? styles.disabled : ""}
    ${className}
  `.trim();

    const content = (
        <>
            {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={buttonClasses}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonClasses}
        >
            {content}
        </button>
    );
}

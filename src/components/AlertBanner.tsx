import { type JSX } from 'react';

type AlertBannerProps = {
    message: string;
    className?: string;
};

export default function AlertBanner({ message, className = '' }: AlertBannerProps): JSX.Element | null {
    if (!message) {
        return null;
    }

    return (
        <div
            className={`rounded-md border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-300 ${className}`.trim()}
        >
            {message}
        </div>
    );
}

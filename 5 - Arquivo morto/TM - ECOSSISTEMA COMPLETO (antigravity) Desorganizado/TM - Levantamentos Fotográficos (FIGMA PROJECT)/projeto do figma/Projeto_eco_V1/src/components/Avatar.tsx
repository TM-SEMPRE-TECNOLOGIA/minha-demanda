import React from 'react';

interface AvatarProps {
    url?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ url, name, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10', // Standard List
        lg: 'w-12 h-12', // Header
        xl: 'w-24 h-24', // Profile
    };

    const initial = name ? name.substring(0, 1).toUpperCase() : '?';

    return (
        <div className={`shrink-0 relative ${sizeClasses[size]}`}>
            {url ? (
                <img
                    src={url}
                    alt={name}
                    className="w-full h-full rounded-full object-cover border border-white/10"
                />
            ) : (
                <div className="w-full h-full rounded-full bg-[var(--TM-primary)] flex items-center justify-center text-[var(--TM-primary-foreground)] font-bold shadow-sm">
                    {initial}
                </div>
            )}
        </div>
    );
};

export default Avatar;
